import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import { ForgeError } from "../src/errors.ts";
import {
  _memory_test_hooks,
  apply_kb,
  apply_prepared,
  ask,
  verify_knowledge,
  verify_prepared,
} from "../src/memory.ts";
import { create_document, register_document } from "../src/records.ts";

const CREATED = "2026-09-09T00:00:00+00:00";
const UPDATED = "2026-09-09T01:00:00+00:00";
const sourceCli = fileURLToPath(new URL("../src/cli.ts", import.meta.url));
const forgeInvocation = process.env.FORGE_TEST_BINARY
  ? [process.env.FORGE_TEST_BINARY]
  : [process.execPath, sourceCli];

interface Change {
  path: string;
  kind: string;
  action: string;
  base_sha256: string | null;
  proposed_file: string | null;
  metadata_changes: string[];
}

let repo: string;

function document(
  kind: string,
  identifier: string,
  code: string,
  title: string,
  body: string,
  options: { updated?: string; extra?: string } = {},
): string {
  return `---
id: ${identifier}
code: ${code}
type: ${kind}
title: ${title}
status: stable
createdAt: ${CREATED}
updatedAt: ${options.updated ?? CREATED}
${options.extra ?? ""}---
${body}
`;
}

function digest(content: string): string {
  return Bun.CryptoHasher.hash("sha256", content, "hex");
}

function manifest(
  operationId: string,
  changes: Change[],
  proof: Record<string, unknown> = {
    status: "document-only",
    source: ["authority.txt"],
    evidence: [],
    acceptance: [],
  },
): string {
  const path = join(repo, ".forge/prepared", `${operationId}.json`);
  writeFileSync(
    path,
    `${JSON.stringify(
      {
        version: 1,
        operation_id: operationId,
        authorization_file: "authorization.json",
        proof,
        changes,
      },
      null,
      2,
    )}\n`,
  );
  return path;
}

function writeRegistered(path: string, content: string): string {
  const absolute = join(repo, path);
  mkdirSync(join(absolute, ".."), { recursive: true });
  writeFileSync(absolute, content);
  register_document(repo, absolute, content);
  return absolute;
}

function readJson(path: string): Record<string, unknown> {
  return JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
}

function record(value: unknown): Record<string, unknown> {
  expect(value).toBeObject();
  return value as Record<string, unknown>;
}

function list(value: unknown): unknown[] {
  expect(Array.isArray(value)).toBe(true);
  return value as unknown[];
}

beforeEach(() => {
  repo = mkdtempSync(join(tmpdir(), "forge-memory-test-"));
  mkdirSync(join(repo, ".forge/prepared"), { recursive: true });
  writeFileSync(join(repo, "authority.txt"), "Human approves OP scope — café.\n");
  writeFileSync(
    join(repo, "authorization.json"),
    JSON.stringify({
      actor: "human",
      source: "authority.txt",
      quote: "Human approves OP scope — café.",
      scope: "the prepared canonical memory changes",
      date: "2026-09-09",
    }),
  );
});

afterEach(() => {
  delete _memory_test_hooks.check_current_state;
  delete _memory_test_hooks.check_one_current_state;
  delete _memory_test_hooks.register_document;
  rmSync(repo, { recursive: true, force: true });
});

describe("prepared canonical memory", () => {
  test("knowledge verification reports unsupported canonical entries without reading through them", () => {
    const paths = ["docs/knowledge/domain/linked.md", "docs/knowledge/domain/dangling.md", "docs/specs/linked/SPEC.md", "docs/knowledge/index.md", "docs/knowledge/domain/directory.md", "docs/knowledge/domain/pipe.md", "docs/specs/aliased/SPEC.md"];
    for (const path of paths.slice(0, 6)) mkdirSync(join(repo, path, ".."), { recursive: true });
    writeFileSync(join(repo, "outside.md"), "external content must not be read");
    symlinkSync(join(repo, "outside.md"), join(repo, paths[0]!));
    symlinkSync(join(repo, "missing.md"), join(repo, paths[1]!));
    symlinkSync(join(repo, "outside.md"), join(repo, paths[2]!));
    symlinkSync(join(repo, "outside.md"), join(repo, paths[3]!));
    mkdirSync(join(repo, paths[4]!));
    mkdirSync(join(repo, "outside-spec"));
    writeFileSync(join(repo, "outside-spec/SPEC.md"), "external spec");
    symlinkSync(join(repo, "outside-spec"), join(repo, "docs/specs/aliased"));
    symlinkSync(join(repo, "outside.md"), join(repo, "docs/specs/README.md"));
    expect(spawnSync("mkfifo", [join(repo, paths[5]!) ]).status).toBe(0);
    const result = spawnSync(forgeInvocation[0]!, [...forgeInvocation.slice(1), "kb", "verify", "--repo", repo], { encoding: "utf8", timeout: 3000 });
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(1);
    const checked = JSON.parse(result.stdout);
    expect(checked.valid).toBe(false);
    expect(checked.issues.map((issue: { path: string; code: string }) => [issue.path, issue.code]).sort()).toEqual(paths.map(path => [path, "invalid-document"]).sort());
  });

  test("update applies exact UTF-8 bytes and retains raw context without a semantic claim", () => {
    const old = document(
      "standing-spec",
      "11111111-1111-4111-8111-111111111111",
      "ACCESS-SPEC",
      "Access",
      "# Access\n\n- GIVEN an approved member\n- WHEN they enter\n- THEN access is granted — café",
      { extra: "sources:\n  - resource: https://example.test/base\ncustom:\n  nested: keep-me\n" },
    );
    const next = old
      .replace(`updatedAt: ${CREATED}`, `updatedAt: ${UPDATED}`)
      .replace("THEN access is granted", "THEN scoped access is granted");
    const target = writeRegistered("docs/specs/access/SPEC.md", old);
    const proposed = join(repo, ".forge/prepared/access.md");
    writeFileSync(proposed, next);
    const invalidFieldManifest = manifest("OP-update-invalid-field", [
      {
        path: "docs/specs/access/SPEC.md",
        kind: "standing-spec",
        action: "update",
        base_sha256: digest(old),
        proposed_file: ".forge/prepared/access.md",
        metadata_changes: ["vendor.field"],
      },
    ]);
    expect(() => verify_prepared(repo, invalidFieldManifest)).toThrow("metadata_changes must be a list of field names");
    const preparedManifest = manifest("OP-update", [
      {
        path: "docs/specs/access/SPEC.md",
        kind: "standing-spec",
        action: "update",
        base_sha256: digest(old),
        proposed_file: ".forge/prepared/access.md",
        metadata_changes: ["updatedAt"],
      },
    ]);

    const verified = verify_prepared(repo, preparedManifest);
    expect(verified.valid).toBe(true);
    expect(String(verified.claim)).toContain("not established");
    const result = apply_prepared(repo, preparedManifest);

    expect(result.applied).toBe(true);
    expect(readFileSync(target)).toEqual(Buffer.from(next));
    const history = readJson(join(repo, ".forge/memory/OP-update.json"));
    expect(record(history.authorization_context).quote).toBe("Human approves OP scope — café.");
    expect(record(history.proof).status).toBe("document-only");
    expect(record(list(record(history.result).changes)[0]).previous_content).toBe(old);
    expect(() => apply_prepared(repo, preparedManifest)).toThrow("already applied");
  });

  test("a stale multi-file manifest writes nothing", () => {
    const first = document("concept", "22222222-2222-4222-8222-222222222222", "TERM-A", "Term A", "# Term A");
    const second = document("concept", "33333333-3333-4333-8333-333333333333", "TERM-B", "Term B", "# Term B");
    writeRegistered("docs/knowledge/domain/a.md", first);
    writeRegistered("docs/knowledge/domain/b.md", second);
    writeFileSync(join(repo, ".forge/prepared/a.md"), first.replace("# Term A", "# Term A\n\nChanged"));
    writeFileSync(join(repo, ".forge/prepared/b.md"), second.replace("# Term B", "# Term B\n\nChanged"));
    const preparedManifest = manifest("OP-stale", [
      {
        path: "docs/knowledge/domain/a.md",
        kind: "concept",
        action: "update",
        base_sha256: digest(first),
        proposed_file: ".forge/prepared/a.md",
        metadata_changes: [],
      },
      {
        path: "docs/knowledge/domain/b.md",
        kind: "concept",
        action: "update",
        base_sha256: "0".repeat(64),
        proposed_file: ".forge/prepared/b.md",
        metadata_changes: [],
      },
    ]);

    expect(() => apply_prepared(repo, preparedManifest)).toThrow("stale base");
    expect(readFileSync(join(repo, "docs/knowledge/domain/a.md"), "utf8")).toBe(first);
    expect(readFileSync(join(repo, "docs/knowledge/domain/b.md"), "utf8")).toBe(second);
    expect(existsSync(join(repo, ".forge/memory/OP-stale.json"))).toBe(false);
  });

  test("CLI add transfers a registered draft identity to its canonical path", () => {
    const prepared = join(repo, ".forge/prepared/workspace.md");
    create_document(repo, "concept", prepared, "Workspace", "WORKSPACE");
    const preparedManifest = manifest("OP-add", [
      {
        path: "docs/knowledge/domain/workspace.md",
        kind: "concept",
        action: "add",
        base_sha256: null,
        proposed_file: ".forge/prepared/workspace.md",
        metadata_changes: [],
      },
    ]);

    const completed = spawnSync(forgeInvocation[0]!, [...forgeInvocation.slice(1), "kb", "add", preparedManifest, "--repo", repo], {
      encoding: "utf8",
    });
    expect(completed.status, completed.stderr).toBe(0);
    const canonical = join(repo, "docs/knowledge/domain/workspace.md");
    expect(readFileSync(canonical)).toEqual(readFileSync(prepared));
    const registry = readJson(join(repo, ".forge/identities.json"));
    expect(registry["docs/knowledge/domain/workspace.md"]).toBeDefined();
    expect(registry[".forge/prepared/workspace.md"]).toBeUndefined();
  });

  test("native OKF scaffold keeps its Forge identity when adopted under an arbitrary hierarchy", () => {
    const scaffolded = spawnSync(forgeInvocation[0]!, [
      ...forgeInvocation.slice(1),
      "kb", "scaffold", ".forge/prepared/runbook.md",
      "--repo", repo,
      "--type", "Operational Runbook",
      "--title", "Recover the queue",
      "--code", "QUEUE-RUNBOOK",
    ], { encoding: "utf8" });
    expect(scaffolded.status, scaffolded.stderr).toBe(0);
    const drafted = JSON.parse(scaffolded.stdout) as Record<string, unknown>;
    const prepared = readFileSync(join(repo, ".forge/prepared/runbook.md"), "utf8");
    expect(prepared).toContain("type: Operational Runbook");
    expect(prepared).toContain(`id: ${record(drafted.forge_identity).id}`);
    const preparedManifest = manifest("OP-native-add", [{
      path: "docs/knowledge/teams/platform/recover-queue.md",
      kind: "concept",
      action: "add",
      base_sha256: null,
      proposed_file: ".forge/prepared/runbook.md",
      metadata_changes: [],
    }]);

    apply_kb(repo, preparedManifest, "add");
    const canonical = "docs/knowledge/teams/platform/recover-queue.md";
    expect(readFileSync(join(repo, canonical), "utf8")).toBe(prepared);
    const registry = readJson(join(repo, ".forge/identities.json"));
    expect(registry[canonical]).toEqual(drafted.forge_identity);
    expect(registry[".forge/prepared/runbook.md"]).toBeUndefined();

    const checked = verify_knowledge(repo, ["concept"]);
    const stored = record(list(checked.records)[0]);
    expect(stored.okf_id).toBe("teams/platform/recover-queue");
    expect(stored.forge_identity).toEqual(drafted.forge_identity);
    expect(stored.concept_type).toBe("Operational Runbook");
    expect(record(checked.okf).scan).toBe("partial");
    expect(record(checked.okf).conformant).toBeNull();
    expect(record(checked.okf).selected_format_valid).toBe(true);

    const revised = prepared.replace("type: Operational Runbook", "type: Recovery Playbook");
    writeFileSync(join(repo, ".forge/prepared/runbook-v2.md"), revised);
    apply_kb(repo, manifest("OP-native-update", [{
      path: canonical,
      kind: "concept",
      action: "update",
      base_sha256: digest(prepared),
      proposed_file: ".forge/prepared/runbook-v2.md",
      metadata_changes: ["type"],
    }]), "update");
    expect(readJson(join(repo, ".forge/identities.json"))[canonical]).toEqual(drafted.forge_identity);
    expect(record(list(verify_knowledge(repo, ["concept"]).records)[0]).concept_type).toBe("Recovery Playbook");
  });

  test("external OKF bytes are preserved while Forge adopts a distinct authoritative identity", () => {
    const external = `---
type: Custom Asset
id: external-record
code: EXTERNAL
details:
  owners: [platform, data]
---
# External asset
`;
    writeFileSync(join(repo, ".forge/prepared/external.md"), external);
    const target = "docs/knowledge/catalog/deep/assets/external.md";
    const externalManifest = manifest("OP-external", [{
      path: target,
      kind: "concept",
      action: "add",
      base_sha256: null,
      proposed_file: ".forge/prepared/external.md",
      metadata_changes: [],
    }]);
    const preview = record(list(verify_prepared(repo, externalManifest).changes)[0]);
    expect(preview.forge_identity).toBeNull();
    expect(preview.forge_identity_status).toBe("assigned-on-apply");
    const applied = apply_kb(repo, externalManifest, "add");

    expect(readFileSync(join(repo, target), "utf8")).toBe(external);
    const identity = record(readJson(join(repo, ".forge/identities.json"))[target]);
    expect(record(list(applied.changes)[0]).forge_identity).toEqual(identity);
    expect(record(list(applied.changes)[0]).forge_identity_status).toBe("assigned");
    expect(identity.id).not.toBe("external-record");
    expect(identity.code).not.toBe("EXTERNAL");
    const checked = verify_knowledge(repo, ["concept"]);
    expect(record(list(checked.gaps)[0]).code).toBe("non-authoritative-identity-extension");
    expect(record(list(checked.records)[0]).forge_identity).toEqual(identity);
  });

  test("reserved OKF files use native structure and sidecar identities", () => {
    const files = {
      ".forge/prepared/index.md": `---\nokf_version: "0.2"\n---\n# Knowledge\n\n* [Operations](operations/) - operating knowledge\n`,
      ".forge/prepared/nested-index.md": "# Operations\n\n* [Runbook](runbook.md) - queue recovery\n",
      ".forge/prepared/log.md": "# Knowledge log\n\n## 2026-09-10\n\n* **Creation**: Established the bundle.\n",
      ".forge/prepared/minimal.md": "---\ntype: Unregistered Kind\n---\n",
    };
    for (const [path, content] of Object.entries(files)) writeFileSync(join(repo, path), content);
    apply_prepared(repo, manifest("OP-bundle", [
      { path: "docs/knowledge/index.md", kind: "kb-index", action: "add", base_sha256: null, proposed_file: ".forge/prepared/index.md", metadata_changes: [] },
      { path: "docs/knowledge/operations/index.md", kind: "kb-index", action: "add", base_sha256: null, proposed_file: ".forge/prepared/nested-index.md", metadata_changes: [] },
      { path: "docs/knowledge/log.md", kind: "kb-log", action: "add", base_sha256: null, proposed_file: ".forge/prepared/log.md", metadata_changes: [] },
      { path: "docs/knowledge/operations/runbook.md", kind: "concept", action: "add", base_sha256: null, proposed_file: ".forge/prepared/minimal.md", metadata_changes: [] },
    ]));

    const checked = verify_knowledge(repo);
    expect(checked.valid).toBe(true);
    expect(record(checked.okf).scan).toBe("full");
    expect(record(checked.okf).conformant).toBe(true);
    const registry = readJson(join(repo, ".forge/identities.json"));
    expect(record(registry["docs/knowledge/index.md"]).type).toBe("okf-index");
    expect(record(registry["docs/knowledge/log.md"]).type).toBe("okf-log");
    expect(record(registry["docs/knowledge/operations/runbook.md"]).type).toBe("okf-concept");
  });

  test("native root and nested indexes plus logs update without frontmatter metadata", () => {
    const files = {
      rootIndex: "# Knowledge\n\n* [Operations](operations/) - operating knowledge.\n",
      nestedIndex: "# Operations\n\n* [Runbook](runbook.md) - queue recovery.\n",
      log: "# Knowledge log\n\n## 2026-09-10\n\n* **Creation**: Established the bundle.\n",
    };
    const targets = [
      ["docs/knowledge/index.md", "kb-index", "rootIndex"] as const,
      ["docs/knowledge/operations/index.md", "kb-index", "nestedIndex"] as const,
      ["docs/knowledge/log.md", "kb-log", "log"] as const,
    ];
    for (const [, , name] of targets) {
      writeFileSync(join(repo, `.forge/prepared/${name}.md`), files[name]);
    }
    apply_kb(
      repo,
      manifest(
        "OP-native-reserved-add",
        targets.map(([path, kind, name]) => ({
          path,
          kind,
          action: "add",
          base_sha256: null,
          proposed_file: `.forge/prepared/${name}.md`,
          metadata_changes: [],
        })),
      ),
      "add",
    );
    const registryBefore = readFileSync(join(repo, ".forge/identities.json"));

    const revised = {
      rootIndex: `${files.rootIndex}\n* [Recovery](operations/recovery.md) - recovery guidance.\n`,
      nestedIndex: `${files.nestedIndex}\n* [Recovery](recovery.md) - recovery guidance.\n`,
      log: `${files.log}\nAdditional documentation for the native bundle.\n`,
    };
    for (const [, , name] of targets) {
      writeFileSync(join(repo, `.forge/prepared/${name}-update.md`), revised[name]);
    }
    const updateManifest = manifest(
      "OP-native-reserved-update",
      targets.map(([path, kind, name]) => ({
        path,
        kind,
        action: "update",
        base_sha256: digest(files[name]),
        proposed_file: `.forge/prepared/${name}-update.md`,
        metadata_changes: [],
      })),
    );
    const preview = verify_prepared(repo, updateManifest);
    expect(list(preview.changes).map((change) => record(change).metadata_changes)).toEqual([[], [], []]);
    const applied = apply_kb(repo, updateManifest, "update");
    expect(applied.applied).toBe(true);
    for (const [path, , name] of targets) {
      expect(readFileSync(join(repo, path), "utf8")).toBe(revised[name]);
    }
    expect(readFileSync(join(repo, ".forge/identities.json"))).toEqual(registryBefore);
  });

  test("native concept updates compare quoted, nested, flow, and extension YAML fields", () => {
    const old = `---
"type": Operational Runbook
title: Queue recovery
status: stable
sources:
  - resource: https://example.test/runbooks/queue
nested:
  owner:
    team: platform
  limits:
    attempts: 2
flow: {mode: safe, retries: 2}
extension:
  nested:
    field: old
  flow: {enabled: true, labels: [queue, recovery]}
"vendor.field": old
"vendor field": {state: old}
"vendor/field": [old, value]
---
# Queue recovery

The queue can be recovered from a paused worker.
`;
    const next = `---
"type": Recovery Playbook
title: Queue recovery
status: stable
sources:
  - resource: https://example.test/runbooks/queue
nested:
  owner:
    team: reliability
  limits:
    attempts: 3
flow: {mode: guarded, retries: 4}
extension:
  nested:
    field: new
  flow: {enabled: false, labels: [queue, reliability]}
"vendor.field": new
"vendor field": {state: new}
"vendor/field": [new, value]
---
# Queue recovery

The queue can be recovered from a paused worker.
`;
    writeFileSync(join(repo, ".forge/prepared/queue-recovery.md"), old);
    const target = "docs/knowledge/domain/queue-recovery.md";
    apply_kb(
      repo,
      manifest("OP-native-concept-add", [{
        path: target,
        kind: "concept",
        action: "add",
        base_sha256: null,
        proposed_file: ".forge/prepared/queue-recovery.md",
        metadata_changes: [],
      }]),
      "add",
    );
    const identityBefore = record(readJson(join(repo, ".forge/identities.json"))[target]);

    writeFileSync(join(repo, ".forge/prepared/queue-recovery-next.md"), next);
    const updateManifest = manifest("OP-native-concept-update", [{
      path: target,
      kind: "concept",
      action: "update",
      base_sha256: digest(old),
      proposed_file: ".forge/prepared/queue-recovery-next.md",
      metadata_changes: ["type", "nested", "flow", "extension", "vendor.field", "vendor field", "vendor/field"],
    }]);
    const preview = verify_prepared(repo, updateManifest);
    expect(record(list(preview.changes)[0]).metadata_changes).toEqual([
      "type",
      "nested",
      "flow",
      "extension",
      "vendor.field",
      "vendor field",
      "vendor/field",
    ]);
    const applied = apply_kb(repo, updateManifest, "update");
    expect(applied.applied).toBe(true);
    expect(readFileSync(join(repo, target), "utf8")).toBe(next);
    expect(readJson(join(repo, ".forge/identities.json"))[target]).toEqual(identityBefore);
    const checked = verify_knowledge(repo, ["concept"]);
    const stored = record(list(checked.records)[0]);
    expect(stored.concept_type).toBe("Recovery Playbook");
    expect(stored.forge_identity).toEqual(identityBefore);
  });

  test("registered legacy reserved records stay inspectable until explicit authorized conversion", () => {
    const legacyIndex = document(
      "kb-index",
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "LEGACY-INDEX",
      "Legacy index",
      "# Legacy index\n\n* [Queue](queue.md) - queue operations.\n",
    );
    const legacyLog = document(
      "kb-log",
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      "LEGACY-LOG",
      "Legacy log",
      "# Legacy log\n\n## 2026-09-10\n\n* **Creation**: Recorded the legacy bundle.\n",
    );
    const indexPath = "docs/knowledge/legacy/index.md";
    const logPath = "docs/knowledge/legacy/log.md";
    writeRegistered(indexPath, legacyIndex);
    writeRegistered(logPath, legacyLog);
    const registryBefore = readJson(join(repo, ".forge/identities.json"));
    const indexIdentity = record(registryBefore[indexPath]);
    const logIdentity = record(registryBefore[logPath]);

    const asked = ask(repo, "legacy", ["kb-index", "kb-log"]);
    const references = list(asked.references).map((reference) => record(reference));
    expect(references.map((reference) => [reference.path, reference.format])).toEqual([
      [indexPath, "forge-legacy"],
      [logPath, "forge-legacy"],
    ]);
    expect(references.map((reference) => reference.forge_identity)).toEqual([indexIdentity, logIdentity]);
    const inspected = verify_knowledge(repo);
    expect(inspected.valid).toBe(false);
    expect(record(inspected.okf).conformant).toBe(false);
    expect(list(inspected.issues).map((issue) => record(issue).code)).toEqual([
      "legacy-reserved-document",
      "legacy-reserved-document",
    ]);
    expect(list(inspected.records).map((recordValue) => record(recordValue).format)).toEqual([
      "forge-legacy",
      "forge-legacy",
    ]);

    const convertedIndex = "# Legacy index\n\n* [Queue](queue.md) - queue operations.\n\nConverted to native OKF index bytes.\n";
    writeFileSync(join(repo, ".forge/prepared/legacy-index-converted.md"), convertedIndex);
    const staleUpdate = manifest("OP-legacy-index-stale", [{
      path: indexPath,
      kind: "kb-index",
      action: "update",
      base_sha256: "0".repeat(64),
      proposed_file: ".forge/prepared/legacy-index-converted.md",
      metadata_changes: ["id", "code", "type", "title", "status", "createdAt", "updatedAt"],
    }]);
    expect(() => apply_kb(repo, staleUpdate, "update")).toThrow("stale base");
    expect(readFileSync(join(repo, indexPath), "utf8")).toBe(legacyIndex);
    expect(readJson(join(repo, ".forge/identities.json"))).toEqual(registryBefore);

    const updateManifest = manifest("OP-legacy-index-convert", [{
      path: indexPath,
      kind: "kb-index",
      action: "update",
      base_sha256: digest(legacyIndex),
      proposed_file: ".forge/prepared/legacy-index-converted.md",
      metadata_changes: ["id", "code", "type", "title", "status", "createdAt", "updatedAt"],
    }]);
    const updated = apply_kb(repo, updateManifest, "update");
    expect(updated.applied).toBe(true);
    expect(readFileSync(join(repo, indexPath), "utf8")).toBe(convertedIndex);
    expect(readJson(join(repo, ".forge/identities.json"))[indexPath]).toEqual(indexIdentity);

    const staleRemove = manifest("OP-legacy-log-stale", [{
      path: logPath,
      kind: "kb-log",
      action: "remove",
      base_sha256: "0".repeat(64),
      proposed_file: null,
      metadata_changes: [],
    }]);
    expect(() => apply_kb(repo, staleRemove, "remove")).toThrow("stale base");
    expect(readFileSync(join(repo, logPath), "utf8")).toBe(legacyLog);
    expect(readJson(join(repo, ".forge/identities.json"))[logPath]).toEqual(logIdentity);

    const removeManifest = manifest("OP-legacy-log-remove", [{
      path: logPath,
      kind: "kb-log",
      action: "remove",
      base_sha256: digest(legacyLog),
      proposed_file: null,
      metadata_changes: [],
    }]);
    const removed = apply_kb(repo, removeManifest, "remove");
    expect(removed.applied).toBe(true);
    expect(existsSync(join(repo, logPath))).toBe(false);
    expect(readJson(join(repo, ".forge/identities.json"))[logPath]).toBeUndefined();
    const history = readJson(join(repo, ".forge/memory/OP-legacy-log-remove.json"));
    expect(record(list(record(history.result).changes)[0]).removed_content).toBe(legacyLog);
  });

  test("KB add assigns fresh identities when a registered Spec or canonical KB is proposed", () => {
    const standingSpec = document(
      "standing-spec",
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      "ACCESS-SPEC",
      "Access",
      "# Access\n\n## Entry\n\n- GIVEN an approved member\n- WHEN they enter\n- THEN access is granted\n",
    );
    const standingPath = "docs/specs/access/SPEC.md";
    writeRegistered(standingPath, standingSpec);
    const standingIdentity = record(readJson(join(repo, ".forge/identities.json"))[standingPath]);

    const canonicalKnowledge = "---\ntype: Existing Runbook\n---\n# Existing runbook\n";
    const canonicalPath = "docs/knowledge/domain/existing.md";
    writeFileSync(join(repo, ".forge/prepared/existing.md"), canonicalKnowledge);
    apply_kb(
      repo,
      manifest("OP-existing-knowledge-add", [{
        path: canonicalPath,
        kind: "concept",
        action: "add",
        base_sha256: null,
        proposed_file: ".forge/prepared/existing.md",
        metadata_changes: [],
      }]),
      "add",
    );
    const registryBefore = readJson(join(repo, ".forge/identities.json"));
    const canonicalIdentity = record(registryBefore[canonicalPath]);

    const proposals = [
      ["OP-proposed-spec", "docs/knowledge/domain/from-spec.md", standingPath, standingIdentity] as const,
      ["OP-proposed-canonical", "docs/knowledge/domain/from-canonical.md", canonicalPath, canonicalIdentity] as const,
    ];
    for (const [operation, target, proposedFile, sourceIdentity] of proposals) {
      const sourceBytes = readFileSync(join(repo, proposedFile), { encoding: "utf8" });
      const preparedManifest = manifest(operation, [{
        path: target,
        kind: "concept",
        action: "add",
        base_sha256: null,
        proposed_file: proposedFile,
        metadata_changes: [],
      }]);
      const applied = apply_kb(repo, preparedManifest, "add");
      expect(applied.applied).toBe(true);
      expect(readFileSync(join(repo, proposedFile), "utf8")).toBe(sourceBytes);
      expect(readJson(join(repo, ".forge/identities.json"))[proposedFile]).toEqual(sourceIdentity);
      const adopted = record(readJson(join(repo, ".forge/identities.json"))[target]);
      expect(adopted.id).not.toBe(sourceIdentity.id);
      expect(adopted.code).not.toBe(sourceIdentity.code);
    }
    expect(readJson(join(repo, ".forge/identities.json"))[standingPath]).toEqual(standingIdentity);
    expect(readJson(join(repo, ".forge/identities.json"))[canonicalPath]).toEqual(canonicalIdentity);
  });

  test("remove preserves history while broken OKF links remain a health signal", () => {
    const concept = document("concept", "44444444-4444-4444-8444-444444444444", "WIDGET", "Widget", "# Widget\n\nnaïve");
    const process = document(
      "process",
      "55555555-5555-4555-8555-555555555555",
      "USE-WIDGET",
      "Use widget",
      "# Use widget\n\nSee [Widget](../domain/widget.md).",
    );
    const target = writeRegistered("docs/knowledge/domain/widget.md", concept);
    writeRegistered("docs/knowledge/processes/use-widget.md", process);
    const removal: Change = {
      path: "docs/knowledge/domain/widget.md",
      kind: "concept",
      action: "remove",
      base_sha256: digest(concept),
      proposed_file: null,
      metadata_changes: [],
    };
    apply_kb(repo, manifest("OP-remove", [removal]), "remove");
    expect(existsSync(target)).toBe(false);
    const history = readJson(join(repo, ".forge/memory/OP-remove.json"));
    expect(record(list(record(history.result).changes)[0]).removed_content).toBe(concept);
    expect(readJson(join(repo, ".forge/identities.json"))["docs/knowledge/domain/widget.md"]).toBeUndefined();
    const checked = verify_knowledge(repo, ["process"]);
    expect(checked.valid).toBe(true);
    expect(list(checked.gaps).map((gap) => record(gap).code)).toContain("broken-local-link");
  });

  test("integrated proof requires existing evidence and acceptance", () => {
    const proposed = document("concept", "66666666-6666-4666-8666-666666666666", "TERM-C", "Term C", "# Term C");
    writeFileSync(join(repo, ".forge/prepared/c.md"), proposed);
    const preparedManifest = manifest(
      "OP-proof",
      [
        {
          path: "docs/knowledge/domain/c.md",
          kind: "concept",
          action: "add",
          base_sha256: null,
          proposed_file: ".forge/prepared/c.md",
          metadata_changes: [],
        },
      ],
      { status: "integrated", source: ["authority.txt"], evidence: [], acceptance: [] },
    );
    expect(() => verify_prepared(repo, preparedManifest)).toThrow("requires evidence and acceptance");
  });

  test("a post-write failure rolls back document, registry, and history", () => {
    const old = document("concept", "99999999-9999-4999-8999-999999999999", "TERM-E", "Term E", "# Term E");
    const next = old.replace("# Term E", "# Term E\n\nChanged");
    const target = writeRegistered("docs/knowledge/domain/e.md", old);
    const registryBefore = readFileSync(join(repo, ".forge/identities.json"));
    writeFileSync(join(repo, ".forge/prepared/e.md"), next);
    const preparedManifest = manifest("OP-rollback", [
      {
        path: "docs/knowledge/domain/e.md",
        kind: "concept",
        action: "update",
        base_sha256: digest(old),
        proposed_file: ".forge/prepared/e.md",
        metadata_changes: [],
      },
    ]);
    _memory_test_hooks.register_document = () => {
      throw new ForgeError("registry write failed");
    };

    expect(() => apply_prepared(repo, preparedManifest)).toThrow("registry write failed");
    expect(readFileSync(target, "utf8")).toBe(old);
    expect(readFileSync(join(repo, ".forge/identities.json"))).toEqual(registryBefore);
    expect(existsSync(join(repo, ".forge/memory/OP-rollback.json"))).toBe(false);
  });

  test("registry rollback restores transfers while preserving an unrelated registration", () => {
    const prepared = join(repo, ".forge/prepared/new.md");
    create_document(repo, "concept", prepared, "New", "CONCEPT-NEW");
    const old = document("concept", "88888888-8888-4888-8888-888888888888", "CONCEPT-OTHER", "Other", "# Other");
    const target = writeRegistered("docs/knowledge/domain/other.md", old);
    const proposed = join(repo, ".forge/prepared/other.md");
    writeFileSync(proposed, old.replace("# Other", "# Other\n\nApproved detail."));
    const preparedManifest = manifest("OP-registry-ownership", [
      {
        path: "docs/knowledge/domain/new.md",
        kind: "concept",
        action: "add",
        base_sha256: null,
        proposed_file: ".forge/prepared/new.md",
        metadata_changes: [],
      },
      {
        path: relative(repo, target),
        kind: "concept",
        action: "update",
        base_sha256: digest(old),
        proposed_file: relative(repo, proposed),
        metadata_changes: [],
      },
    ]);
    _memory_test_hooks.register_document = () => {
      create_document(repo, "issue", "unrelated.md", "Unrelated", "ISSUE-UNRELATED");
      throw new ForgeError("registry write failed");
    };

    expect(() => apply_prepared(repo, preparedManifest)).toThrow("registry write failed");
    expect(Object.keys(readJson(join(repo, ".forge/identities.json"))).sort()).toEqual([
      ".forge/prepared/new.md",
      "docs/knowledge/domain/other.md",
      "unrelated.md",
    ]);
    expect(existsSync(join(repo, "docs/knowledge/domain/new.md"))).toBe(false);
    expect(readFileSync(target, "utf8")).toBe(old);
    expect(existsSync(join(repo, "unrelated.md"))).toBe(true);
    expect(existsSync(join(repo, ".forge/memory/OP-registry-ownership.json"))).toBe(false);
  });

  test("an undeclared nested raw metadata change is rejected", () => {
    const old = document("concept", "77777777-7777-4777-8777-777777777777", "TERM-D", "Term D", "# Term D", {
      extra: "custom:\n  owner: first\n",
    });
    writeRegistered("docs/knowledge/domain/d.md", old);
    writeFileSync(join(repo, ".forge/prepared/d.md"), old.replace("owner: first", "owner: second"));
    const preparedManifest = manifest("OP-metadata", [
      {
        path: "docs/knowledge/domain/d.md",
        kind: "concept",
        action: "update",
        base_sha256: digest(old),
        proposed_file: ".forge/prepared/d.md",
        metadata_changes: [],
      },
    ]);
    expect(() => verify_prepared(repo, preparedManifest)).toThrow("undeclared changes: custom");
  });

  test("ask returns lexical references and gaps while verification reports broken links", () => {
    const concept = document(
      "concept",
      "88888888-8888-4888-8888-888888888888",
      "WORKSPACE",
      "Workspace",
      "# Workspace\n\nA workspace contains projects. See ![missing](missing.png).",
      { extra: 'sources: [{"resource":"https://example.test/glossary"}]\n' },
    );
    writeRegistered("docs/knowledge/domain/workspace.md", concept);

    const result = ask(repo, "workspace unicorn", ["concept"]);
    expect(record(list(result.references)[0]).path).toBe("docs/knowledge/domain/workspace.md");
    expect((result.gaps as string[]).some((gap) => gap.includes("unicorn"))).toBe(true);
    expect(result.claim).toBe("lexical references only; semantic coverage was not established");
    const checked = verify_knowledge(repo, ["concept"]);
    expect(checked.valid).toBe(true);
    expect(checked.healthy).toBe(false);
    expect(checked.issues).toEqual([]);
    expect(record(list(checked.gaps)[0]).code).toBe("broken-local-link");
    expect(String(checked.claim)).toContain("contradictions");
  });

  test("a stale recheck preserves a newer untouched target", () => {
    const old = document(
      "concept",
      "00000000-0000-4000-8000-000000000009",
      "CONCEPT-STALE",
      "Stale",
      "# Stale\n\nOld meaning.",
    );
    const target = writeRegistered("docs/knowledge/domain/stale.md", old);
    const proposed = join(repo, ".forge/prepared/stale.md");
    writeFileSync(proposed, old.replace("Old meaning.", "Approved meaning."));
    const preparedManifest = manifest("OP-stale-recheck", [
      {
        path: relative(repo, target),
        kind: "concept",
        action: "update",
        base_sha256: digest(old),
        proposed_file: relative(repo, proposed),
        metadata_changes: [],
      },
    ]);
    const registry = readFileSync(join(repo, ".forge/identities.json"));
    const fresh = old.replace("Old meaning.", "New human meaning.");
    let calls = 0;
    _memory_test_hooks.check_current_state = () => {
      calls += 1;
      if (calls === 2) writeFileSync(target, fresh);
    };

    expect(() => apply_prepared(repo, preparedManifest)).toThrow(ForgeError);
    expect(readFileSync(target, "utf8")).toBe(fresh);
    expect(readFileSync(join(repo, ".forge/identities.json"))).toEqual(registry);
    expect(existsSync(join(repo, ".forge/memory/OP-stale-recheck.json"))).toBe(false);
  });

  test("partial apply undoes only still-owned add, update, and remove writes", () => {
    for (const action of ["add", "update", "remove"] as const) {
      for (const conflict of [false, true]) {
        const name = `${action}-${String(conflict)}`;
        const old = document("concept", randomUUID(), `CONCEPT-${name}`, name, `# ${name}\n\nOld meaning.`);
        const target = join(repo, `docs/knowledge/domain/${name}.md`);
        if (action !== "add") writeRegistered(relative(repo, target), old);
        const proposed = join(repo, `.forge/prepared/${name}.md`);
        writeFileSync(proposed, old.replace("Old meaning.", "Approved meaning."));
        const first: Change = {
          path: relative(repo, target),
          kind: "concept",
          action,
          base_sha256: action === "add" ? null : digest(old),
          proposed_file: action === "remove" ? null : relative(repo, proposed),
          metadata_changes: [],
        };
        const laterOld = document(
          "concept",
          randomUUID(),
          `CONCEPT-LATER-${name}`,
          "Later",
          "# Later\n\nOld later meaning.",
        );
        const later = writeRegistered(`docs/knowledge/domain/later-${name}.md`, laterOld);
        const laterProposed = join(repo, `.forge/prepared/later-${name}.md`);
        writeFileSync(laterProposed, laterOld.replace("Old later meaning.", "Approved later meaning."));
        const preparedManifest = manifest(`OP-${name}`, [
          first,
          {
            path: relative(repo, later),
            kind: "concept",
            action: "update",
            base_sha256: digest(laterOld),
            proposed_file: relative(repo, laterProposed),
            metadata_changes: [],
          },
        ]);
        const registry = readFileSync(join(repo, ".forge/identities.json"));
        const fresh = old.replace("Old meaning.", "Intervening target meaning.");
        const laterFresh = laterOld.replace("Old later meaning.", "Intervening later meaning.");
        let calls = 0;
        _memory_test_hooks.check_one_current_state = (change) => {
          if (change.relative !== relative(repo, later)) return;
          calls += 1;
          if (calls === 3) {
            writeFileSync(later, laterFresh);
            if (conflict) writeFileSync(target, fresh);
          }
        };

        let raised: unknown;
        try {
          apply_prepared(repo, preparedManifest);
        } catch (error) {
          raised = error;
        } finally {
          delete _memory_test_hooks.check_one_current_state;
        }
        expect(raised, `${action}/${String(conflict)}`).toBeInstanceOf(ForgeError);
        expect(calls, String(raised)).toBe(3);
        expect(readFileSync(later, "utf8")).toBe(laterFresh);
        if (conflict) {
          expect(readFileSync(target, "utf8")).toBe(fresh);
          expect(String(raised)).toContain("rollback incomplete");
          expect(String(raised)).toContain("preserved intervening change");
        } else if (action === "add") {
          expect(existsSync(target)).toBe(false);
        } else {
          expect(readFileSync(target, "utf8")).toBe(old);
        }
        expect(readFileSync(join(repo, ".forge/identities.json"))).toEqual(registry);
        expect(existsSync(join(repo, `.forge/memory/OP-${name}.json`))).toBe(false);
      }
    }
  });
});
