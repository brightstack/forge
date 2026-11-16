import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { _memory_test_hooks, apply_prepared } from "../src/memory.ts";

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

function legacySpec(name: string) {
  const path = `docs/specs/${name}/SPEC.md`;
  const draft = `.forge/prepared/${name}.md`;
  const old = `# ${name}\n\nGIVEN existing behavior\nWHEN it runs\nTHEN it stays stable.\n`;
  const next = spec(randomUUID(), `${name.toUpperCase()}-SPEC`, name, "GIVEN approved behavior\nWHEN it runs\nTHEN it stays stable.");
  write(path, old);
  write(draft, next);
  return {
    path, draft, old, next,
    change: {
      path, kind: "standing-spec", action: "update", base_sha256: digest(old),
      proposed_file: draft, proposed_sha256: digest(next),
      metadata_changes: ["id", "code", "type", "title", "status", "createdAt", "updatedAt"],
    },
  };
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
  delete _memory_test_hooks.after_install;
  rmSync(repo, { recursive: true, force: true });
});

describe("early specification application", () => {
  test("adopts a plain Spec through its prepared draft's frontmatter identity and keeps later updates strict", () => {
    const legacy = legacySpec("legacy");
    const manifestPath = manifest("SPEC-ADOPT", [legacy.change]);
    const applied = apply_prepared(repo, manifestPath);
    expect(applied.applied).toBe(true);
    expect(readFileSync(join(repo, legacy.path), "utf8")).toBe(legacy.next);
    expect((applied.changes as Array<Record<string, unknown>>)[0]!.forge_identity).toMatchObject({ code: "LEGACY-SPEC", type: "standing-spec" });
    expect(existsSync(join(repo, ".forge/identities.json"))).toBe(false);
    const receipt = JSON.parse(readFileSync(join(repo, ".forge/memory/SPEC-ADOPT.json"), "utf8"));
    expect(receipt.result.changes[0]).toMatchObject({ previous_content: legacy.old, proposed_content: legacy.next });
    expect(apply_prepared(repo, manifestPath)).toMatchObject({ already_applied: true, result_match: "matching" });

    const next = legacy.next.replace("approved behavior", "clarified behavior");
    write(legacy.draft, next);
    const followup = { ...legacy.change, base_sha256: digest(legacy.next), proposed_sha256: digest(next), metadata_changes: [] };
    apply_prepared(repo, manifest("SPEC-ADOPT-FOLLOWUP", [followup]));
    expect(readFileSync(join(repo, legacy.path), "utf8")).toBe(next);
    write(legacy.draft, next.replace("code: LEGACY-SPEC", "code: REPLACED-SPEC"));
    expect(() => apply_prepared(repo, manifest("SPEC-ADOPT-REIDENTIFY", [{
      ...followup, base_sha256: digest(next), proposed_sha256: digest(readFileSync(join(repo, legacy.draft), "utf8")),
    }]))).toThrow("immutable identity");
    write(legacy.draft, legacy.old);
    expect(() => apply_prepared(repo, manifest("SPEC-ADOPT-DOWNGRADE", [{
      ...followup, base_sha256: digest(next), proposed_sha256: digest(legacy.old),
    }]))).toThrow("YAML frontmatter");
    expect(readFileSync(join(repo, legacy.path), "utf8")).toBe(next);
  });

  test("adoption requires an exact initial metadata declaration and an unused identity", () => {
    const legacy = legacySpec("initialization");
    expect(() => apply_prepared(repo, manifest("SPEC-ADOPT-UNDECLARED", [{
      ...legacy.change, metadata_changes: ["title"],
    }]))).toThrow("metadata change declaration mismatch");
    write("docs/specs/existing/SPEC.md", legacy.next.replace("code: INITIALIZATION-SPEC", "code: EXISTING-SPEC"));
    expect(() => apply_prepared(repo, manifest("SPEC-ADOPT-DUPLICATE", [legacy.change]))).toThrow("duplicate id/code with docs/specs/existing/SPEC.md");
    expect(readFileSync(join(repo, legacy.path), "utf8")).toBe(legacy.old);
  });

  test("malformed and behaviorless old Specs cannot use plain Markdown adoption", () => {
    for (const [name, old] of [
      ["malformed", "---\ntitle: broken\n# Broken\n"],
      ["spaced", " \n---\ninvalid header\n---\n# Broken\n"],
      ["behaviorless", "# Missing scenarios\n"],
    ]) {
      const legacy = legacySpec(name!);
      write(legacy.path, old!);
      expect(() => apply_prepared(repo, manifest(`SPEC-REJECT-${name}`, [{
        ...legacy.change, base_sha256: digest(old!),
      }]))).toThrow();
      expect(readFileSync(join(repo, legacy.path), "utf8")).toBe(old!);
    }
  });

  test("only Spec apply updates can adopt plain Markdown", () => {
    const legacy = legacySpec("bounded");
    const generic = manifest("SPEC-NOT-SPEC-APPLY", [legacy.change]);
    const value = JSON.parse(readFileSync(join(repo, generic), "utf8"));
    delete value.application;
    write(generic, JSON.stringify(value));
    expect(() => apply_prepared(repo, generic)).toThrow("immutable metadata");
    for (const action of ["remove", "move"]) {
      expect(() => apply_prepared(repo, manifest(`SPEC-NOT-UPDATE-${action}`, [{
        ...legacy.change, action, path: action === "move" ? "docs/specs/moved/SPEC.md" : legacy.path,
        ...(action === "move" ? { from_path: legacy.path } : {}),
        proposed_file: null, proposed_sha256: action === "move" ? digest(legacy.old) : null,
        metadata_changes: [],
      }]))).toThrow("YAML frontmatter");
    }
    expect(readFileSync(join(repo, legacy.path), "utf8")).toBe(legacy.old);
  });

  test("stale base or proposed hashes abort a multi-Spec adoption before any mutation", () => {
    const first = legacySpec("first");
    const second = legacySpec("second");
    for (const field of ["base_sha256", "proposed_sha256"]) {
      const operation = `SPEC-ADOPT-STALE-${field}`;
      expect(() => apply_prepared(repo, manifest(operation, [first.change, { ...second.change, [field]: "0".repeat(64) }]))).toThrow("stale");
      expect(readFileSync(join(repo, first.path), "utf8")).toBe(first.old);
      expect(readFileSync(join(repo, second.path), "utf8")).toBe(second.old);
      expect(existsSync(join(repo, `.forge/memory/${operation}.json`))).toBe(false);
    }
  });

  test("failure after adoption restores plain bytes", () => {
    const legacy = legacySpec("rollback");
    const formal = spec(randomUUID(), "FORMAL-SPEC", "Formal", "GIVEN behavior\nWHEN it runs\nTHEN it stays stable.");
    write("docs/specs/formal/SPEC.md", formal);
    const nextFormal = formal.replace("stays stable", "remains stable");
    write(".forge/prepared/formal.md", nextFormal);
    _memory_test_hooks.after_install = () => { throw new Error("simulated post-write failure"); };
    expect(() => apply_prepared(repo, manifest("SPEC-ADOPT-ROLLBACK", [legacy.change, {
      path: "docs/specs/formal/SPEC.md", kind: "standing-spec", action: "update",
      base_sha256: digest(formal), proposed_file: ".forge/prepared/formal.md", proposed_sha256: digest(nextFormal), metadata_changes: [],
    }]))).toThrow("simulated post-write failure");
    expect(readFileSync(join(repo, legacy.path), "utf8")).toBe(legacy.old);
    expect(readFileSync(join(repo, "docs/specs/formal/SPEC.md"), "utf8")).toBe(formal);
    expect(existsSync(join(repo, ".forge/memory/SPEC-ADOPT-ROLLBACK.json"))).toBe(false);
  });

  test("pins proposed bytes, retains independent authority inputs", () => {
    const old = spec("11111111-1111-4111-8111-111111111111", "TASKS-SPEC", "Tasks", "GIVEN one task\nWHEN it is listed\nTHEN it appears.");
    const next = old.replace("THEN it appears.", "THEN it appears with its owner.");
    write("docs/specs/tasks/SPEC.md", old);
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
  });

  test("rejects modified drafts, integrated claims, and protected decision changes before writing", () => {
    const old = spec("22222222-2222-4222-8222-222222222222", "ACCESS-SPEC", "Access", "GIVEN access\nWHEN it is checked\nTHEN Original behavior applies.");
    const next = old.replace("Original", "Approved");
    write("docs/specs/access/SPEC.md", old);
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
    }]))).toThrow("protected canonical decisions");
    expect(existsSync(join(repo, "docs/knowledge/decisions/D1-smuggled.md"))).toBe(false);
  });

  test("moves one canonical file with exact bytes and its frontmatter identity", () => {
    const content = spec("33333333-3333-4333-8333-333333333333", "QUEUE-SPEC", "Queue", "GIVEN a queue\nWHEN it is read\nTHEN Stable behavior applies.");
    write("docs/specs/old-queue/SPEC.md", content);
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
    const applied = JSON.parse(result.stdout);
    expect(applied).toMatchObject({ applied: true, application: "spec" });
    expect(existsSync(join(repo, "docs/specs/old-queue/SPEC.md"))).toBe(false);
    expect(readFileSync(join(repo, "docs/specs/queue/SPEC.md"), "utf8")).toBe(content);
    expect(applied.changes[0].forge_identity).toEqual({
      id: "33333333-3333-4333-8333-333333333333",
      code: "QUEUE-SPEC",
      type: "standing-spec",
    });
    expect(existsSync(join(repo, ".forge/identities.json"))).toBe(false);
    const replay = run(["memory", "apply", manifestPath]);
    expect(replay.status, replay.stderr).toBe(0);
    expect(JSON.parse(replay.stdout)).toMatchObject({ applied: false, already_applied: true, result_match: "matching" });
  });

  test("rejects a move that breaks a protected link and preserves intervening edits during rollback", () => {
    const moved = spec("44444444-4444-4444-8444-444444444444", "MOVED-SPEC", "Moved", "GIVEN moved behavior\nWHEN it runs\nTHEN it remains stable.");
    const referring = spec("55555555-5555-4555-8555-555555555555", "REF-SPEC", "Reference", "GIVEN a reference\nWHEN it is followed\nTHEN [Moved](../old/SPEC.md) remains available.");
    write("docs/specs/old/SPEC.md", moved);
    write("docs/specs/ref/SPEC.md", referring);
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
    _memory_test_hooks.after_install = (installed) => {
      writeFileSync(installed.target, intervening);
      throw new Error("simulated post-write failure");
    };
    expect(() => apply_prepared(repo, manifest("SPEC-MOVE-ROLLBACK", [change]))).toThrow("rollback incomplete");
    expect(readFileSync(join(repo, "docs/specs/old/SPEC.md"), "utf8")).toBe(moved);
    expect(readFileSync(join(repo, "docs/specs/new/SPEC.md"), "utf8")).toBe(intervening);
    expect(existsSync(join(repo, ".forge/memory/SPEC-MOVE-ROLLBACK.json"))).toBe(false);
  });
});
