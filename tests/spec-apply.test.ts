import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { _memory_test_hooks, apply_prepared, ask } from "../src/memory.ts";
import { register_document } from "../src/records.ts";

const sourceCli = fileURLToPath(new URL("../src/cli.ts", import.meta.url));
const forgeInvocation = process.env.FORGE_TEST_BINARY
  ? [process.env.FORGE_TEST_BINARY]
  : [process.execPath, sourceCli];
let repo: string;

function digest(content: string): string {
  return Bun.CryptoHasher.hash("sha256", content, "hex");
}

function spec(id: string, code: string, title: string, body: string): string {
  return `---
id: ${id}
code: ${code}
type: standing-spec
title: ${title}
status: stable
createdAt: 2026-09-10T00:00:00+00:00
updatedAt: 2026-09-10T00:00:00+00:00
---
# ${title}

${body}
`;
}

function write(path: string, content: string): string {
  const target = join(repo, path);
  mkdirSync(join(target, ".."), { recursive: true });
  writeFileSync(target, content);
  return path;
}

function writeRegistered(path: string, content: string): void {
  write(path, content);
  register_document(repo, join(repo, path), content);
}

function manifest(operation: string, changes: Array<Record<string, unknown>>, proofStatus = "document-only"): string {
  const baseline = write(`.forge/retained/${operation}-baseline.md`, `# Accepted baseline\n\n${operation}\n`);
  const change = write(`.forge/retained/${operation}-change.md`, `# Approved change\n\n${operation}\n`);
  return write(`.forge/prepared/${operation}.json`, `${JSON.stringify({
    version: 1,
    operation_id: operation,
    authorization_file: "authorization.json",
    application: "spec",
    proof: { status: proofStatus, source: [change], evidence: [], acceptance: [] },
    retained_inputs: [
      { role: "accepted-baseline", source: baseline, sha256: digest(readFileSync(join(repo, baseline), "utf8")) },
      { role: "approved-change", source: change, sha256: digest(readFileSync(join(repo, change), "utf8")) },
      { role: "context", source: "https://example.test/request/42", sha256: null },
    ],
    changes,
  }, null, 2)}\n`);
}

function run(args: string[]) {
  return spawnSync(forgeInvocation[0]!, [...forgeInvocation.slice(1), ...args, "--repo", repo], {
    encoding: "utf8",
  });
}

beforeEach(() => {
  repo = mkdtempSync(join(tmpdir(), "forge-spec-apply-"));
  write("authority.txt", "Human approves the retained Spec change.\n");
  write("authorization.json", JSON.stringify({
    actor: "human",
    source: "authority.txt",
    quote: "Human approves the retained Spec change.",
    scope: "the named Spec change and associated knowledge",
    date: "2026-09-10",
  }));
});

afterEach(() => {
  delete _memory_test_hooks.register_document;
  rmSync(repo, { recursive: true, force: true });
});

describe("early specification application", () => {
  test("pins proposed bytes, retains independent authority inputs, and reports matching or diverged working-copy provenance", () => {
    const old = spec("11111111-1111-4111-8111-111111111111", "TASKS-SPEC", "Tasks", "GIVEN one task\nWHEN it is listed\nTHEN it appears.");
    const next = old.replace("THEN it appears.", "THEN it appears with its owner.");
    writeRegistered("docs/specs/tasks/SPEC.md", old);
    write(".forge/prepared/tasks.md", next);
    const manifestPath = manifest("SPEC-TASKS-01", [{
      path: "docs/specs/tasks/SPEC.md",
      kind: "standing-spec",
      action: "update",
      base_sha256: digest(old),
      proposed_file: ".forge/prepared/tasks.md",
      proposed_sha256: digest(next),
      metadata_changes: [],
    }]);

    const applied = apply_prepared(repo, manifestPath);
    expect(applied).toMatchObject({ applied: true, application: "spec" });
    expect((applied.proof as Record<string, unknown>).status).toBe("document-only");
    expect(readFileSync(join(repo, "docs/specs/tasks/SPEC.md"), "utf8")).toBe(next);
    const receipt = JSON.parse(readFileSync(join(repo, ".forge/memory/SPEC-TASKS-01.json"), "utf8"));
    expect(receipt.application).toBe("spec");
    expect(receipt.retained_input_snapshots.map((input: { role: string }) => input.role)).toEqual([
      "accepted-baseline",
      "approved-change",
      "context",
    ]);
    expect(receipt.retained_input_snapshots[0].content).toContain("Accepted baseline");
    expect(receipt.authority_snapshots.human_source.content).toContain("Human approves");
    expect(receipt.result.changes[0].proposed_content).toBe(next);

    const matching = ask(repo, "owner", ["standing-spec"]);
    expect((matching.references as Array<Record<string, unknown>>)[0]).toMatchObject({
      observation: "working-copy",
      authority: "not-inferred",
      implementation: "not-inferred",
      provenance: { application: "spec", proof_status: "document-only", match: "matching" },
    });
    write("docs/specs/tasks/SPEC.md", next.replace("owner", "assignee"));
    const diverged = ask(repo, "assignee", ["standing-spec"]);
    expect(((diverged.references as Array<Record<string, unknown>>)[0]?.provenance as Record<string, unknown>).match).toBe("diverged");
    expect((diverged.gaps as string[]).some((gap) => gap.includes("diverge"))).toBe(true);
  });

  test("rejects modified drafts, integrated claims, and protected decision changes before writing", () => {
    const old = spec("22222222-2222-4222-8222-222222222222", "ACCESS-SPEC", "Access", "GIVEN access\nWHEN it is checked\nTHEN Original behavior applies.");
    const next = old.replace("Original", "Approved");
    writeRegistered("docs/specs/access/SPEC.md", old);
    write(".forge/prepared/access.md", next);
    const change = {
      path: "docs/specs/access/SPEC.md",
      kind: "standing-spec",
      action: "update",
      base_sha256: digest(old),
      proposed_file: ".forge/prepared/access.md",
      proposed_sha256: "0".repeat(64),
      metadata_changes: [],
    };
    expect(() => apply_prepared(repo, manifest("SPEC-STALE-DRAFT", [change]))).toThrow("stale proposed file");
    expect(readFileSync(join(repo, "docs/specs/access/SPEC.md"), "utf8")).toBe(old);

    change.proposed_sha256 = digest(next);
    expect(() => apply_prepared(repo, manifest("SPEC-INTEGRATED", [change], "integrated"))).toThrow("document-only");

    const decision = `---\ntype: Decision\ntitle: Smuggled\n---\n# Smuggled\n`;
    write(".forge/prepared/D1-smuggled.md", decision);
    expect(() => apply_prepared(repo, manifest("SPEC-DECISION", [change, {
      path: "docs/knowledge/decisions/D1-smuggled.md",
      kind: "kb-decision",
      action: "add",
      base_sha256: null,
      proposed_file: ".forge/prepared/D1-smuggled.md",
      proposed_sha256: digest(decision),
      metadata_changes: [],
    }]))).toThrow("protected D-number decisions");
    expect(existsSync(join(repo, "docs/knowledge/decisions/D1-smuggled.md"))).toBe(false);
  });

  test("moves one canonical file with exact bytes and its registered identity", () => {
    const content = spec("33333333-3333-4333-8333-333333333333", "QUEUE-SPEC", "Queue", "GIVEN a queue\nWHEN it is read\nTHEN Stable behavior applies.");
    writeRegistered("docs/specs/old-queue/SPEC.md", content);
    const manifestPath = manifest("SPEC-MOVE", [{
      path: "docs/specs/queue/SPEC.md",
      from_path: "docs/specs/old-queue/SPEC.md",
      kind: "standing-spec",
      action: "move",
      base_sha256: digest(content),
      proposed_file: null,
      proposed_sha256: digest(content),
      metadata_changes: [],
    }]);

    const verified = run(["memory", "verify", manifestPath]);
    expect(verified.status, verified.stderr).toBe(0);
    expect(JSON.parse(verified.stdout)).toMatchObject({ valid: true, application: "spec" });
    const result = run(["memory", "apply", manifestPath]);
    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({ applied: true, application: "spec" });
    expect(existsSync(join(repo, "docs/specs/old-queue/SPEC.md"))).toBe(false);
    expect(readFileSync(join(repo, "docs/specs/queue/SPEC.md"), "utf8")).toBe(content);
    const identities = JSON.parse(readFileSync(join(repo, ".forge/identities.json"), "utf8"));
    expect(identities["docs/specs/old-queue/SPEC.md"]).toBeUndefined();
    expect(identities["docs/specs/queue/SPEC.md"]).toEqual({
      id: "33333333-3333-4333-8333-333333333333",
      code: "QUEUE-SPEC",
      type: "standing-spec",
    });
    const replay = run(["memory", "apply", manifestPath]);
    expect(replay.status, replay.stderr).toBe(0);
    expect(JSON.parse(replay.stdout)).toMatchObject({ applied: false, already_applied: true, result_match: "matching" });
  });

  test("reports a removed canonical file that reappears as diverged from the latest receipt", () => {
    const content = spec("66666666-6666-4666-8666-666666666666", "REMOVED-SPEC", "Removed", "GIVEN old behavior\nWHEN it is retired\nTHEN it is absent.");
    write(".forge/prepared/removed.md", content);
    apply_prepared(repo, manifest("SPEC-REMOVE-ADD", [{
      path: "docs/specs/removed/SPEC.md",
      kind: "standing-spec",
      action: "add",
      base_sha256: null,
      proposed_file: ".forge/prepared/removed.md",
      proposed_sha256: digest(content),
      metadata_changes: [],
    }]));
    apply_prepared(repo, manifest("SPEC-REMOVE-LATER", [{
      path: "docs/specs/removed/SPEC.md",
      kind: "standing-spec",
      action: "remove",
      base_sha256: digest(content),
      proposed_file: null,
      proposed_sha256: null,
      metadata_changes: [],
    }]));

    write("docs/specs/removed/SPEC.md", content);
    const result = ask(repo, "retired", ["standing-spec"]);
    const reference = (result.references as Array<Record<string, unknown>>)[0];
    expect(reference?.provenance).toMatchObject({
      operation_id: "SPEC-REMOVE-LATER",
      recorded_sha256: null,
      current_sha256: digest(content),
      match: "diverged",
    });
    expect(result.gaps).toContain("Working-copy bytes diverge from the latest receipt for docs/specs/removed/SPEC.md.");
  });

  test("tracks the latest move receipt for both its matching destination and absent source", () => {
    const content = spec("77777777-7777-4777-8777-777777777777", "MOVED-PROVENANCE-SPEC", "Moved provenance", "GIVEN move history\nWHEN it is queried\nTHEN both affected paths are tracked.");
    write(".forge/prepared/moved-provenance.md", content);
    apply_prepared(repo, manifest("SPEC-MOVE-ADD", [{
      path: "docs/specs/move-source/SPEC.md",
      kind: "standing-spec",
      action: "add",
      base_sha256: null,
      proposed_file: ".forge/prepared/moved-provenance.md",
      proposed_sha256: digest(content),
      metadata_changes: [],
    }]));
    apply_prepared(repo, manifest("SPEC-MOVE-LATER", [{
      path: "docs/specs/move-target/SPEC.md",
      from_path: "docs/specs/move-source/SPEC.md",
      kind: "standing-spec",
      action: "move",
      base_sha256: digest(content),
      proposed_file: null,
      proposed_sha256: digest(content),
      metadata_changes: [],
    }]));

    write("docs/specs/move-source/SPEC.md", content);
    const result = ask(repo, "affected paths", ["standing-spec"]);
    const references = result.references as Array<Record<string, unknown>>;
    const source = references.find((reference) => reference.path === "docs/specs/move-source/SPEC.md");
    const target = references.find((reference) => reference.path === "docs/specs/move-target/SPEC.md");
    expect(source?.provenance).toMatchObject({
      operation_id: "SPEC-MOVE-LATER",
      recorded_sha256: null,
      current_sha256: digest(content),
      match: "diverged",
    });
    expect(target?.provenance).toMatchObject({
      operation_id: "SPEC-MOVE-LATER",
      recorded_sha256: digest(content),
      current_sha256: digest(content),
      match: "matching",
    });
    expect(result.gaps).toContain("Working-copy bytes diverge from the latest receipt for docs/specs/move-source/SPEC.md.");
  });

  test("rejects a move that breaks a protected link and preserves intervening edits during rollback", () => {
    const moved = spec("44444444-4444-4444-8444-444444444444", "MOVED-SPEC", "Moved", "GIVEN moved behavior\nWHEN it runs\nTHEN it remains stable.");
    const referring = spec("55555555-5555-4555-8555-555555555555", "REF-SPEC", "Reference", "GIVEN a reference\nWHEN it is followed\nTHEN [Moved](../old/SPEC.md) remains available.");
    writeRegistered("docs/specs/old/SPEC.md", moved);
    writeRegistered("docs/specs/ref/SPEC.md", referring);
    const change = {
      path: "docs/specs/new/SPEC.md",
      from_path: "docs/specs/old/SPEC.md",
      kind: "standing-spec",
      action: "move",
      base_sha256: digest(moved),
      proposed_file: null,
      proposed_sha256: digest(moved),
      metadata_changes: [],
    };
    expect(() => apply_prepared(repo, manifest("SPEC-BROKEN-MOVE", [change]))).toThrow("break an inbound local link");
    expect(existsSync(join(repo, "docs/specs/old/SPEC.md"))).toBe(true);
    expect(existsSync(join(repo, "docs/specs/new/SPEC.md"))).toBe(false);

    write("docs/specs/ref/SPEC.md", referring.replace("../old/SPEC.md", "../new/SPEC.md"));
    const intervening = moved.replace("remains stable", "was concurrently clarified");
    _memory_test_hooks.register_document = (_root, target) => {
      writeFileSync(target, intervening);
      throw new Error("simulated registry failure");
    };
    expect(() => apply_prepared(repo, manifest("SPEC-MOVE-ROLLBACK", [change]))).toThrow("rollback incomplete");
    expect(readFileSync(join(repo, "docs/specs/old/SPEC.md"), "utf8")).toBe(moved);
    expect(readFileSync(join(repo, "docs/specs/new/SPEC.md"), "utf8")).toBe(intervening);
    expect(existsSync(join(repo, ".forge/memory/SPEC-MOVE-ROLLBACK.json"))).toBe(false);
  });
});
