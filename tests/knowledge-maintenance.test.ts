import { afterEach, describe, expect, test } from "bun:test";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { parseDocument } from "yaml";

const APP = join(import.meta.dir, "..");
const command = process.env.FORGE_TEST_BINARY
  ? [process.env.FORGE_TEST_BINARY]
  : [process.execPath, join(APP, "src/cli.ts")];

interface CliResult {
  status: number | null;
  stdout: string;
  stderr: string;
  error?: Error;
}

interface Authorization {
  path: string;
  source: string;
  quote: string;
  scope: string;
  date: string;
}

interface MemoryChange {
  path: string;
  kind: string;
  action: "add" | "update" | "remove";
  base_sha256: string | null;
  proposed_file: string | null;
  metadata_changes: string[];
}

let repo = "";

function run(args: string[]): CliResult {
  const result = spawnSync(command[0] as string, [...command.slice(1), ...args, "--repo", repo], {
    encoding: "utf8",
    timeout: 15_000,
  });
  return {
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    ...(result.error ? { error: result.error } : {}),
  };
}

function runAsync(args: string[]): Promise<CliResult> {
  return new Promise((resolve) => {
    const child = spawn(command[0] as string, [...command.slice(1), ...args, "--repo", repo]);
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", (error) => resolve({ status: null, stdout, stderr, error }));
    child.on("close", (status) => resolve({ status, stdout, stderr }));
  });
}

function ok(args: string[]): Record<string, unknown> {
  const result = run(args);
  expect(result.error, result.stderr).toBeUndefined();
  expect(result.status, result.stderr).toBe(0);
  return JSON.parse(result.stdout) as Record<string, unknown>;
}

function failed(args: string[]): string {
  const result = run(args);
  expect(result.error, result.stdout).toBeUndefined();
  expect(result.status).not.toBe(0);
  return result.stderr;
}

function write(relativePath: string, content: string): string {
  const path = join(repo, relativePath);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  return path;
}

function writeJson(relativePath: string, value: unknown): string {
  return write(relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

function read(relativePath: string): string {
  return readFileSync(join(repo, relativePath), "utf8");
}

function readJson(relativePath: string): Record<string, unknown> {
  return JSON.parse(read(relativePath)) as Record<string, unknown>;
}

function authorization(date: string, suffix = "main"): Authorization {
  const source = "authority.txt";
  const quote = `Human approves the ${suffix} knowledge decision.`;
  const scope = `${suffix} knowledge maintenance only`;
  write(source, `Human transcript: ${quote}\n`);
  const path = writeJson(`authorization-${suffix}.json`, {
    actor: "human",
    source,
    quote,
    scope,
    date,
  });
  return { path, source, quote, scope, date };
}

function frontmatter(content: string): Record<string, unknown> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(content);
  expect(match).not.toBeNull();
  const parsed = parseDocument(match?.[1] ?? "", { schema: "core", uniqueKeys: true });
  expect(parsed.errors).toHaveLength(0);
  const value: unknown = parsed.toJS();
  expect(value).toBeObject();
  return value as Record<string, unknown>;
}

function snapshot(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  function walk(directory: string, prefix: string): void {
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      const relativePath = join(prefix, entry.name);
      if (entry.isDirectory()) walk(path, relativePath);
      else if (entry.isFile()) result[relativePath] = readFileSync(path).toString("base64");
    }
  }
  walk(root, "");
  return result;
}

function withoutMutationLock(files: Record<string, string>): Record<string, string> {
  const copy = { ...files };
  delete copy[".forge/mutation.lock"];
  return copy;
}

function manifest(
  operationId: string,
  change: MemoryChange,
  proof: { status: "document-only" | "integrated"; source: string[]; evidence: string[]; acceptance: string[] },
): string {
  return writeJson(`.forge/prepared/${operationId}.json`, {
    version: 1,
    operation_id: operationId,
    authorization_file: "authorization-main.json",
    proof,
    changes: [change],
  });
}

function standingSpec(): string {
  return `---
id: 11111111-1111-4111-8111-111111111111
code: TASK-SPEC
type: standing-spec
title: Task behavior
status: stable
createdAt: 2001-01-01
updatedAt: 2001-01-01
---
# Task behavior

## Retention
- GIVEN an accepted task
- WHEN the task is archived
- THEN its decision history remains available
`;
}

function concept(): string {
  return `---
type: Queue process
title: Queue process
status: stable
sources:
  - resource: authority.txt
---
# Queue process

The queue retains its accepted decision history.
`;
}

afterEach(() => {
  if (repo) rmSync(repo, { recursive: true, force: true });
  repo = "";
});

describe("knowledge maintenance CLI", () => {
  test("records a standalone native decision with provenance and a frontmatter UUID identity", () => {
    repo = mkdtempSync(join(tmpdir(), "forge-knowledge-decision-"));
    const body = write("decision.md", "# Workspace auth\n\nRequire a human decision before access changes.\n");
    const badAuthorization = writeJson("bad-authorization.json", {
      actor: "agent",
      source: "authority.txt",
      quote: "invented permission",
      scope: "unbounded",
      date: "2001-01-01",
    });
    const before = snapshot(repo);
    expect(
      failed([
        "decision",
        "record",
        "--authorization-file",
        badAuthorization,
        "--body-file",
        body,
        "--title",
        "Workspace Auth",
      ]),
    ).toMatch(/human|agent|quote|authority/i);
    expect(withoutMutationLock(snapshot(repo))).toEqual(withoutMutationLock(before));

    const authority = authorization("2001-09-09");
    const decisionResult = ok([
      "decision",
      "record",
      "--authorization-file",
      authority.path,
      "--body-file",
      body,
      "--title",
      "Workspace Auth",
    ]);

    const relativePath = "docs/knowledge/decisions/workspace-auth.md";
    const id = String(decisionResult.decision);
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(decisionResult).toMatchObject({
      canonical_decision: {
        path: relativePath,
        title: "Workspace Auth",
        forge_identity: { id, type: "okf-concept" },
        accepted_on: "2001-09-09",
        supersedes: null,
      },
      index: "docs/knowledge/decisions/index.md",
      loop_reference: null,
      history: `.forge/memory/decision-${id}.json`,
    });
    const canonical = read(relativePath);
    const metadata = frontmatter(canonical);
    expect(metadata.id).toBe(id);
    expect(metadata.code).toBeUndefined();
    expect(metadata.type).toBe("Decision");
    expect(metadata.title).toBe("Workspace Auth");
    expect(metadata.status).toBe("stable");
    const decisionMetadata = metadata.decision as Record<string, unknown>;
    expect(decisionMetadata.code).toBeUndefined();
    expect(String(decisionMetadata.created_at)).not.toBe("");
    expect(String(decisionMetadata.accepted_on)).toBe(authority.date);
    expect(String(decisionMetadata.created_at)).not.toBe(String(decisionMetadata.accepted_on));
    for (const evidence of [authority.source, authority.quote, authority.scope]) {
      expect(canonical).toContain(evidence);
    }
    expect(canonical).toContain("# Workspace auth");
    expect(existsSync(join(repo, ".forge/identities.json"))).toBeFalse();

    const index = read("docs/knowledge/decisions/index.md");
    expect(index).not.toMatch(/\bD\d+\b/);
    expect(index).toMatch(/\]\(workspace-auth\.md\)/);
    const verified = ok(["kb", "verify"]);
    expect((verified.gaps as Array<Record<string, unknown>>).filter((gap) => gap.code === "missing-forge-identity")).toEqual([]);
  });

  test("supersession by UUID preserves prior decision bytes and appends a loop-local D code after legacy entries", () => {
    repo = mkdtempSync(join(tmpdir(), "forge-knowledge-supersession-"));
    const firstAuthority = authorization("2001-09-09", "first");
    const firstBody = write("first.md", "# Workspace auth\n\nRequire explicit authorization.\n");
    const firstResult = ok([
      "decision",
      "record",
      "--authorization-file",
      firstAuthority.path,
      "--body-file",
      firstBody,
      "--title",
      "Workspace Auth",
    ]);
    const firstId = String(firstResult.decision);
    const firstPath = join(repo, "docs/knowledge/decisions/workspace-auth.md");
    const firstBytes = readFileSync(firstPath);

    write("forge.yml", "loopsPath: .forge/loops\n");
    ok(["init", "review", "--title", "Review loop"]);
    const loopPath = join(repo, ".forge/loops/review/decisions.md");
    const legacy = "\n## LEGACY-ENTRY\n\nKeep this legacy loop decision readable.\n";
    writeFileSync(loopPath, Buffer.concat([readFileSync(loopPath), Buffer.from(legacy)]));
    const loopBefore = readFileSync(loopPath, "utf8");

    const secondAuthority = authorization("2001-10-10", "replacement");
    const secondBody = write("second.md", "# Workspace auth replacement\n\nUse the canonical decision.\n");
    const secondResult = ok([
      "decision",
      "record",
      ".forge/loops/review/decisions.md",
      "--authorization-file",
      secondAuthority.path,
      "--body-file",
      secondBody,
      "--title",
      "Workspace Auth Replacement",
      "--supersedes",
      firstId,
    ]);
    const secondId = String(secondResult.decision);
    expect(secondId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(secondId).not.toBe(firstId);
    const secondPath = "docs/knowledge/decisions/workspace-auth-replacement.md";
    expect(secondResult).toMatchObject({
      loop_code: "D1",
      canonical_decision: {
        path: secondPath,
        title: "Workspace Auth Replacement",
        accepted_on: "2001-10-10",
        supersedes: firstId,
      },
      index: "docs/knowledge/decisions/index.md",
      loop_reference: ".forge/loops/review/decisions.md",
      history: `.forge/memory/decision-${secondId}.json`,
    });
    expect(readFileSync(firstPath)).toEqual(firstBytes);
    const index = read("docs/knowledge/decisions/index.md");
    expect(index.indexOf("workspace-auth.md")).toBeGreaterThanOrEqual(0);
    expect(index.indexOf("workspace-auth-replacement.md")).toBeGreaterThan(index.indexOf("workspace-auth.md"));
    expect(index).toContain(`supersedes ${firstId}`);

    const loopAfter = readFileSync(loopPath, "utf8");
    expect(loopAfter).toContain("LEGACY-ENTRY");
    expect(loopAfter).toContain("Keep this legacy loop decision readable.");
    expect(loopAfter).toContain("## D1 — 2001-10-10");
    expect(loopAfter).toContain(`Decision id: ${secondId}`);
    expect(loopAfter).toContain("workspace-auth-replacement.md");
    expect(loopAfter.indexOf("LEGACY-ENTRY")).toBeLessThan(loopAfter.indexOf("workspace-auth-replacement.md"));
    expect(ok(["docs", "validate", ".forge/loops/review/decisions.md"])).toMatchObject({
      checked: [".forge/loops/review/decisions.md"],
    });

    const beforeRejectedSupersession = snapshot(repo);
    for (const unknown of ["D99", randomUUID()]) {
      expect(
        failed([
          "decision",
          "record",
          ".forge/loops/review/decisions.md",
          "--authorization-file",
          secondAuthority.path,
          "--body-file",
          secondBody,
          "--title",
          "Invalid Replacement",
          "--supersedes",
          unknown,
        ]),
      ).toMatch(/supersed|absent|unknown/i);
    }
    expect(snapshot(repo)).toEqual(beforeRejectedSupersession);
    expect(existsSync(join(repo, "docs/knowledge/decisions/invalid-replacement.md"))).toBeFalse();
    expect(existsSync(join(repo, secondPath))).toBeTrue();
    expect(loopAfter).toContain(loopBefore.trimEnd());

    const legacyBody = write("legacy-replacement.md", "# Legacy replacement\n\nReplace the legacy loop decision.\n");
    const legacyResult = ok([
      "decision",
      "record",
      ".forge/loops/review/decisions.md",
      "--authorization-file",
      secondAuthority.path,
      "--body-file",
      legacyBody,
      "--title",
      "Legacy Replacement",
      "--supersedes",
      "LEGACY-ENTRY",
    ]);
    expect(legacyResult).toMatchObject({
      loop_code: "D2",
      canonical_decision: { supersedes: "LEGACY-ENTRY" },
    });
    expect(read("docs/knowledge/decisions/index.md")).toContain("supersedes LEGACY-ENTRY");
  });

  test("decision paths come from titles, legacy D-number decisions stay supersedable, and identities.json is ignored", () => {
    repo = mkdtempSync(join(tmpdir(), "forge-knowledge-allocation-"));
    write(".forge/identities.json", "deliberately invalid legacy registry");
    write(
      "docs/knowledge/decisions/D4-existing.md",
      "---\ntype: Decision\ntitle: Existing\nstatus: stable\ndecision:\n  code: D4\n---\n# Existing\n",
    );
    const firstAuthority = authorization("2001-09-09", "same-first");
    const firstBody = write("first.md", "# Same title\n\nFirst decision.\n");
    const first = ok(["decision", "record", "--authorization-file", firstAuthority.path, "--body-file", firstBody, "--title", "Same Title", "--supersedes", "D4"]);
    expect(first.canonical_decision).toMatchObject({ path: "docs/knowledge/decisions/same-title.md", supersedes: "D4" });

    const secondAuthority = authorization("2001-10-10", "same-second");
    const secondBody = write("second.md", "# Same title\n\nSecond decision.\n");
    const second = ok(["decision", "record", "--authorization-file", secondAuthority.path, "--body-file", secondBody, "--title", "Same Title"]);
    const secondId = String(second.decision);
    expect(second.canonical_decision).toMatchObject({ path: `docs/knowledge/decisions/same-title-${secondId.slice(0, 8)}.md` });
    expect(frontmatter(read(`docs/knowledge/decisions/same-title-${secondId.slice(0, 8)}.md`)).id).toBe(secondId);
    expect(read(".forge/identities.json")).toBe("deliberately invalid legacy registry");
    expect(ok(["kb", "verify", "--scope", "kb-decision"]).valid).toBeTrue();
  });

  test("serializes concurrent standalone records as unique UUID decisions", async () => {
    repo = mkdtempSync(join(tmpdir(), "forge-knowledge-concurrent-"));
    const authority = authorization("2001-09-09", "concurrent");
    const requests = Array.from({ length: 8 }, (_, index) => {
      const title = `Concurrent Decision ${index + 1}`;
      const body = write(`concurrent-${index + 1}.md`, `# ${title}\n\nDecision ${index + 1}.\n`);
      return [
        "decision",
        "record",
        "--authorization-file",
        authority.path,
        "--body-file",
        body,
        "--title",
        title,
      ];
    });
    const results = await Promise.all(requests.map((args) => runAsync(args)));
    for (const result of results) {
      expect(result.error, result.stderr).toBeUndefined();
      expect(result.status, result.stderr).toBe(0);
    }

    const index = read("docs/knowledge/decisions/index.md");
    const decisionNames = readdirSync(join(repo, "docs/knowledge/decisions"))
      .filter((name) => /^concurrent-decision-\d+\.md$/.test(name));
    expect(decisionNames).toHaveLength(requests.length);
    for (const name of decisionNames) expect(index).toContain(name);
    const ids = decisionNames.map((name) => String(frontmatter(read(`docs/knowledge/decisions/${name}`)).id));
    for (const id of ids) expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(new Set(ids).size).toBe(requests.length);
    expect(new Set(results.map((result) => JSON.parse(result.stdout).decision))).toEqual(new Set(ids));
    expect(existsSync(join(repo, ".forge/identities.json"))).toBeFalse();
  });

  test("history derives successful decision, Spec, and KB receipts without mutating or claiming deployment", () => {
    repo = mkdtempSync(join(tmpdir(), "forge-knowledge-history-"));
    const authority = authorization("2001-09-09");
    const decisionBody = write("decision.md", "# History decision\n\nKeep the decision discoverable.\n");
    const decisionId = String(ok([
      "decision",
      "record",
      "--authorization-file",
      authority.path,
      "--body-file",
      decisionBody,
      "--title",
      "History Decision",
    ]).decision);

    const evidence = write("evidence.txt", "Acceptance evidence for the integrated knowledge update.\n");
    const acceptance = write("acceptance.txt", "Clean acceptance record for the integrated knowledge update.\n");
    const specFile = write(".forge/prepared/spec.md", standingSpec());
    const specManifest = manifest(
      "OP-spec-document-only",
      {
        path: "docs/specs/tasks/SPEC.md",
        kind: "standing-spec",
        action: "add",
        base_sha256: null,
        proposed_file: ".forge/prepared/spec.md",
        metadata_changes: [],
      },
      { status: "document-only", source: ["authority.txt"], evidence: [], acceptance: [] },
    );
    expect(specFile).toContain(".forge/prepared/spec.md");
    ok(["memory", "apply", specManifest]);

    const conceptFile = write(".forge/prepared/concept.md", concept());
    const kbManifest = manifest(
      "OP-kb-integrated",
      {
        path: "docs/knowledge/domain/queue.md",
        kind: "concept",
        action: "add",
        base_sha256: null,
        proposed_file: ".forge/prepared/concept.md",
        metadata_changes: [],
      },
      {
        status: "integrated",
        source: ["authority.txt"],
        evidence: [evidence],
        acceptance: [acceptance],
      },
    );
    expect(conceptFile).toContain(".forge/prepared/concept.md");
    ok(["memory", "apply", kbManifest]);

    writeJson(".forge/memory/OP-failed.json", {
      version: 1,
      operation_id: "OP-failed",
      applied_at: "2026-09-10T16:00:00Z",
      status: "failed",
      error: "operation failed and was rolled back",
      proof: { status: "integrated", source: [], evidence: [], acceptance: [] },
      result: {
        changes: [{ path: "docs/specs/service/SPEC.md", kind: "standing-spec", action: "update" }],
      },
    });
    writeJson(".forge/memory/OP-not-a-receipt.json", {
      operation_id: "OP-not-a-receipt",
      note: "not a successful memory receipt",
    });
    write(".forge/memory/OP-invalid.json", "{not valid JSON\n");

    const before = snapshot(repo);
    const historyResult = run(["kb", "history"]);
    expect(historyResult.error, historyResult.stderr).toBeUndefined();
    expect(historyResult.status, historyResult.stderr).toBe(0);
    const history = JSON.parse(historyResult.stdout) as Record<string, unknown>;
    expect(Array.isArray(history.entries)).toBeTrue();
    const entries = history.entries as unknown[];
    expect(entries.length).toBeGreaterThanOrEqual(3);
    const entryText = entries.map((entry) => JSON.stringify(entry)).join("\n");
    expect(entryText).toContain("history-decision.md");
    expect(entryText).toContain("OP-spec-document-only");
    expect(entryText).toContain("docs/specs/tasks/SPEC.md");
    expect(entryText).toContain("OP-kb-integrated");
    expect(entryText).toContain("docs/knowledge/domain/queue.md");
    expect(entryText).toContain("document-only");
    expect(entryText).toContain("integrated");
    expect(entryText).not.toContain("OP-failed");
    expect(entryText).not.toContain("OP-not-a-receipt");
    expect(entryText).not.toContain("OP-invalid");
    expect(history.valid).toBe(false);
    const issueText = JSON.stringify(history.issues);
    expect(issueText).toContain("OP-failed.json");
    expect(issueText).toContain("successful applied operation");
    expect(issueText).toContain("OP-not-a-receipt.json");
    expect(issueText).toContain("OP-invalid.json");
    const byOperation = Object.fromEntries(
      (entries as Array<Record<string, unknown>>).map((entry) => [entry.operation_id, entry]),
    );
    expect(byOperation["OP-spec-document-only"]?.categories).toEqual(["spec-maintenance"]);
    expect(byOperation["OP-kb-integrated"]?.categories).toEqual([
      "evidenced-system-delivery",
      "knowledge-maintenance",
    ]);
    expect((byOperation[`decision-${decisionId}`]?.categories as string[])).toContain("decision-maintenance");
    const claim = String(history.claim ?? "").toLowerCase();
    expect(claim).toMatch(/deploy/);
    expect(claim).not.toMatch(/\b(deployed|published)\b/);
    expect(snapshot(repo)).toEqual(before);
  });

  test("records an authorized integrated delivery with no canonical delta and keeps KB verbs non-vacuous", () => {
    repo = mkdtempSync(join(tmpdir(), "forge-delivery-history-"));
    authorization("2001-09-09");
    const evidence = write("evidence.txt", "Focused regression checks passed for the completed refactor.\n");
    const acceptance = write("acceptance.txt", "Acceptance exercised the affected existing behavior.\n");
    const deliveryManifest = writeJson(".forge/prepared/delivery-only.json", {
      version: 1,
      operation_id: "OP-delivery-only",
      authorization_file: "authorization-main.json",
      proof: {
        status: "integrated",
        source: ["authority.txt"],
        evidence: [evidence],
        acceptance: [acceptance],
      },
      changes: [],
    });

    const beforeVerify = snapshot(repo);
    const verified = ok(["memory", "verify", deliveryManifest]);
    expect(verified.valid).toBe(true);
    expect(verified.changes).toEqual([]);
    expect(String(verified.claim)).toContain("deployment");
    expect(String(verified.claim)).not.toContain("deployed");
    expect(snapshot(repo)).toEqual(beforeVerify);

    for (const operation of ["add", "update", "remove"]) {
      expect(failed(["kb", operation, deliveryManifest])).toContain(
        "KB operations require at least one canonical knowledge change",
      );
    }
    expect(failed(["memory", "verify", writeJson(".forge/prepared/document-only-empty.json", {
      version: 1,
      operation_id: "OP-document-only-empty",
      authorization_file: "authorization-main.json",
      proof: { status: "document-only", source: ["authority.txt"], evidence: [], acceptance: [] },
      changes: [],
    })])).toContain("empty change list requires integrated delivery proof");
    expect(failed(["memory", "verify", writeJson(".forge/prepared/incomplete-delivery.json", {
      version: 1,
      operation_id: "OP-incomplete-delivery",
      authorization_file: "authorization-main.json",
      proof: { status: "integrated", source: ["authority.txt"], evidence: [], acceptance: [] },
      changes: [],
    })])).toContain("integrated proof requires evidence and acceptance references");
    const agentAuthorization = writeJson("authorization-agent.json", {
      actor: "agent",
      source: "authority.txt",
      quote: "Human approves the main knowledge decision.",
      scope: "delivery history",
      date: "2001-09-09",
    });
    expect(failed(["memory", "verify", writeJson(".forge/prepared/agent-delivery.json", {
      version: 1,
      operation_id: "OP-agent-delivery",
      authorization_file: agentAuthorization,
      proof: {
        status: "integrated",
        source: ["authority.txt"],
        evidence: [evidence],
        acceptance: [acceptance],
      },
      changes: [],
    })])).toContain("agent proposals cannot be recorded as human decisions");

    const applied = ok(["memory", "apply", deliveryManifest]);
    expect(applied.applied).toBe(true);
    expect(applied.changes).toEqual([]);
    expect(readJson(".forge/memory/OP-delivery-only.json").result).toMatchObject({ changes: [] });
    expect(existsSync(join(repo, "docs/knowledge"))).toBe(false);

    const history = ok(["kb", "history"]);
    expect(history.valid).toBe(true);
    const entries = history.entries as Array<Record<string, unknown>>;
    expect(entries).toHaveLength(1);
    expect(entries[0]?.operation_id).toBe("OP-delivery-only");
    expect(entries[0]?.categories).toEqual(["evidenced-system-delivery"]);
    expect(entries[0]?.changes).toEqual([]);
  });
});
