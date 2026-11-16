import {
  chmodSync,
  closeSync,
  existsSync,
  fsyncSync,
  linkSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { ForgeError } from "./errors.ts";
import { withMutationLock } from "./lock.ts";
import {
  IDENTITY_FIELDS,
  _write_atomic,
  assert_unique_identity,
  authorization_context,
  check_identity,
  contained_path,
  document_path,
  with_document_lock,
  input_path,
  isIsoDateTime,
  isUuid,
  parse_document,
  read_utf8,
  validate_document_content,
  type Identity,
  type Metadata,
} from "./records.ts";
import { inspect_okf_document, okf_local_links, serialize_okf_concept, validate_okf_document, type OkfDocument } from "./okf.ts";

const MEMORY_KINDS = new Set([
  "standing-spec",
  "kb-decision",
  "concept",
  "process",
  "interface",
  "kb-index",
  "kb-log",
]);
const KB_KINDS = new Set([...MEMORY_KINDS].filter((kind) => kind !== "standing-spec"));
const ACTIONS = new Set(["add", "update", "remove", "move"]);
const IMMUTABLE_METADATA = new Set([...IDENTITY_FIELDS, "createdAt"]);
const TOP_LEVEL_FIELDS = new Set([
  "version",
  "operation_id",
  "authorization_file",
  "application",
  "proof",
  "changes",
  "retained_inputs",
]);
const PROOF_FIELDS = new Set(["status", "source", "evidence", "acceptance"]);
const CHANGE_FIELDS = new Set([
  "path",
  "kind",
  "action",
  "base_sha256",
  "proposed_file",
  "proposed_sha256",
  "from_path",
  "metadata_changes",
]);
const OPTIONAL_TOP_LEVEL_FIELDS = new Set(["application", "retained_inputs"]);
const OPTIONAL_CHANGE_FIELDS = new Set(["proposed_sha256", "from_path"]);
const RETAINED_INPUT_FIELDS = new Set(["role", "source", "sha256"]);
const RETAINED_INPUT_ROLES = new Set(["accepted-baseline", "approved-change", "context"]);

type Action = "add" | "update" | "remove" | "move";
type JsonObject = Record<string, unknown>;

interface SourceSnapshot {
  role?: string;
  source: string;
  sha256: string | null;
  content: string | null;
  provenance: "local-snapshot" | "remote-reference";
  evidentiary_limit: string;
}

interface PreparedChange {
  relative: string;
  target: string;
  kind: string;
  action: Action;
  base_sha256: string | null;
  move_from: string | null;
  move_from_relative: string | null;
  proposed_path: string | null;
  proposed_bytes: Buffer | null;
  proposed_sha256: string | null;
  proposed_metadata: Metadata | null;
  forge_identity: Identity | null;
  removed_content: string | null;
  previous_content: string | null;
  metadata_changes: string[];
}

interface Prepared {
  repo: string;
  loop?: string;
  manifest_path: string;
  manifest: JsonObject;
  manifest_sha256: string;
  operation_id: string;
  authorization: JsonObject;
  proof: JsonObject;
  application: "spec" | null;
  retained_inputs: SourceSnapshot[];
  authorization_snapshot: SourceSnapshot;
  human_source_snapshot: SourceSnapshot;
  changes: PreparedChange[];
  history: string;
}

interface HistoricalReceipt {
  raw: JsonObject;
  operation_id: string;
  applied_at: string;
  authorization: JsonObject;
  proof: JsonObject;
  changes: JsonObject[];
}

interface FileState {
  content: Buffer | null;
  mode: number | null;
}

// Narrow failure/interleaving seam for ownership-aware rollback regressions.
export const _memory_test_hooks: {
  check_current_state?: (changes: PreparedChange[]) => void;
  check_one_current_state?: (change: PreparedChange) => void;
  after_install?: (change: PreparedChange) => void;
} = {};

export function verify_prepared(repo: string, manifest: string, loop?: string): JsonObject {
  return verificationResult(prepare(repo, manifest, { loop }));
}

export function apply_prepared(repo: string, manifest: string, loop?: string): JsonObject {
  return withMutationLock(repo, () => existingSpecApplication(repo, manifest, loop) ?? applyOwned(repo, manifest, { loop }));
}

export function apply_kb(repo: string, manifest: string, operation: string, loop?: string): JsonObject {
  if (!ACTIONS.has(operation)) throw new ForgeError(`unsupported KB operation: ${operation}`);
  if (operation === "move") throw new ForgeError(`unsupported KB operation: ${operation}`);
  return apply(repo, manifest, { requiredAction: operation as Action, kbOnly: true, loop });
}

export function record_kb_decision(
  repo: string,
  loopPath: string | undefined,
  authorizationFile: string,
  bodyFile: string,
  options: { title?: string; supersedes?: string; loop?: string } = {},
): JsonObject {
  return with_document_lock(repo, loopPath ?? "docs/knowledge/decisions", loopPath ? options.loop : undefined, () => {
    const root = realRepo(repo);
    const context = authorization_context(root, authorizationFile, options.loop);
    const body = read_utf8(input_path(root, bodyFile, options.loop)).trim();
    if (!body || body.startsWith("---")) {
      throw new ForgeError("decision body must be nonempty Markdown without frontmatter");
    }
    const title = decisionTitle(options.title, body);
    // The UUID is the decision's identity; readable D-numbers exist only inside a loop's decisions.md.
    const id = randomUUID();
    let relativeTarget = `docs/knowledge/decisions/${decisionSlug(title)}.md`;
    if (existsSync(contained_path(root, relativeTarget))) relativeTarget = relativeTarget.replace(/\.md$/, `-${id.slice(0, 8)}.md`);
    const target = contained_path(root, relativeTarget);
    if (existsSync(target)) throw new ForgeError(`decision target already exists: ${relativeTarget}`);
    const createdAt = new Date().toISOString().replace("Z", "+00:00");
    const acceptedOn = mustString(context.date);
    const source = options.loop && !/^https?:\/\//.test(mustString(context.source))
      ? sourceReference(root, input_path(root, mustString(context.source), options.loop))
      : mustString(context.source);
    const supersedes = options.supersedes;
    const loop = loopPath
      ? prepareLoopDecisionReference(root, loopPath, id, title, relativeTarget, context, supersedes, options.loop)
      : null;
    if (supersedes) assertSupersededDecision(root, supersedes, loop?.old);

    const decisionContent = serialize_okf_concept(
      {
        id,
        type: "Decision",
        title,
        status: "stable",
        sources: [{ resource: source, note: "Human authorization source" }],
        verified: { by: "human:authorization" },
        decision: {
          created_at: createdAt,
          accepted_on: acceptedOn,
          scope: mustString(context.scope),
          authorization_quote: mustString(context.quote),
          ...(supersedes ? { supersedes } : {}),
        },
      },
      `# ${title}\n\n## Decision\n\n${body}\n\n## Human authority\n\n- Accepted: ${acceptedOn}\n- Source: ${source}\n- Authorization quote: ${JSON.stringify(context.quote)}\n- Scope: ${context.scope}\n${supersedes ? `- Supersedes: ${supersedes}\n` : ""}`,
    );
    validate_okf_document(relativeTarget, decisionContent);

    const indexRelative = "docs/knowledge/decisions/index.md";
    const indexTarget = contained_path(root, indexRelative);
    const indexBefore = existsSync(indexTarget) ? readManaged(root, indexTarget) : null;
    if (indexBefore !== null) validate_okf_document(indexRelative, indexBefore);
    const indexLine = `* [${title}](${basename(relativeTarget)}) — accepted ${acceptedOn}${supersedes ? `; supersedes ${supersedes}` : ""}.`;
    const indexContent = indexBefore === null
      ? `# Decisions\n\nAccepted human decisions in recorded order.\n\n${indexLine}\n`
      : `${indexBefore.trimEnd()}\n\n${indexLine}\n`;
    validate_okf_document(indexRelative, indexContent);

    const preparedRoot = contained_path(root, ".forge/prepared");
    mkdirSync(preparedRoot, { recursive: true });
    const decisionDraft = join(preparedRoot, `.decision-${id}.md`);
    const indexDraft = join(preparedRoot, `.decision-index-${id}.md`);
    const manifestPath = join(preparedRoot, `.decision-${id}.json`);
    const identity: Identity = { id, type: "okf-concept" };
    const manifest = {
      version: 1,
      operation_id: `decision-${id}`,
      authorization_file: input_path(root, authorizationFile, options.loop),
      proof: {
        status: "document-only",
        source: [input_path(root, authorizationFile, options.loop)],
        evidence: [],
        acceptance: [],
      },
      changes: [
        {
          path: relativeTarget,
          kind: "kb-decision",
          action: "add",
          base_sha256: null,
          proposed_file: decisionDraft,
          metadata_changes: [],
        },
        {
          path: indexRelative,
          kind: "kb-index",
          action: indexBefore === null ? "add" : "update",
          base_sha256: indexBefore === null ? null : digest(indexBefore),
          proposed_file: indexDraft,
          metadata_changes: [],
        },
      ],
    };

    let loopWritten = false;
    try {
      _write_atomic(decisionDraft, decisionContent);
      _write_atomic(indexDraft, indexContent);
      _write_atomic(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
      if (loop) {
        _write_atomic(loop.target, loop.next);
        loopWritten = true;
      }
      const result = applyOwned(root, manifestPath, { loop: options.loop });
      return {
        ...result,
        decision: id,
        ...(loop ? { loop_code: loop.code } : {}),
        canonical_decision: { path: relativeTarget, title, forge_identity: identity, accepted_on: acceptedOn, supersedes: supersedes ?? null },
        index: indexRelative,
        loop_reference: loop ? repoRelative(root, loop.target) : null,
      };
    } catch (error) {
      if (loop && loopWritten) {
        const actual = read_utf8(loop.target);
        if (actual !== loop.next) {
          throw new ForgeError(`decision operation failed: ${errorMessage(error)}; preserved intervening loop decision change`);
        }
        _write_atomic(loop.target, loop.old);
      }
      throw error;
    } finally {
      for (const path of [decisionDraft, indexDraft, manifestPath]) {
        try {
          unlinkSync(path);
        } catch (error) {
          if (!isMissing(error)) throw error;
        }
      }
    }
  });
}

export function knowledge_history(repo: string): JsonObject {
  const root = realRepo(repo);
  const entries: JsonObject[] = [];
  const receipts = readHistoricalReceipts(root);
  for (const { path, receipt } of receipts.valid) {
    const categories = new Set<string>();
    for (const change of receipt.changes) {
      if (change.kind === "standing-spec") categories.add("spec-maintenance");
      else if (typeof change.path === "string" && change.path.startsWith("docs/knowledge/decisions/")) categories.add("decision-maintenance");
      else categories.add("knowledge-maintenance");
    }
    if (receipt.proof.status === "integrated") categories.add("evidenced-system-delivery");
    entries.push({
      operation_id: receipt.operation_id,
      applied_at: receipt.applied_at,
      receipt: path,
      ...(receipt.raw.application === "spec" ? { application: "spec" } : {}),
      categories: [...categories].sort(),
      proof_status: receipt.proof.status,
      authorization_source: receipt.authorization.source,
      changes: receipt.changes.map((change) => ({ path: change.path, kind: change.kind, action: change.action })),
    });
  }
  entries.sort((left, right) => `${left.applied_at}\0${left.operation_id}`.localeCompare(`${right.applied_at}\0${right.operation_id}`));
  return historyResult(entries, receipts.issues.map((issue) => ({ ...issue, code: "invalid-receipt" })));
}

function readHistoricalReceipts(root: string): {
  valid: Array<{ path: string; receipt: HistoricalReceipt }>;
  issues: Array<{ path: string; message: string }>;
} {
  const directory = contained_path(root, ".forge/memory");
  if (!existsSync(directory)) return { valid: [], issues: [] };
  if (!statSync(directory).isDirectory()) throw new ForgeError("memory history path must be a directory");
  const valid: Array<{ path: string; receipt: HistoricalReceipt }> = [];
  const issues: Array<{ path: string; message: string }> = [];
  for (const child of readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
    if (!child.isFile() || !child.name.endsWith(".json")) continue;
    const path = `.forge/memory/${child.name}`;
    try {
      valid.push({ path, receipt: historicalReceipt(JSON.parse(read_utf8(join(directory, child.name)))) });
    } catch (error) {
      issues.push({ path, message: errorMessage(error) });
    }
  }
  return { valid, issues };
}

export function scaffold_okf(
  repo: string,
  path: string,
  type: string,
  title: string,
  code: string,
  bodyFile?: string,
): JsonObject {
  return withMutationLock(repo, () => {
    const root = realRepo(repo);
    const target = contained_path(root, path);
    const relativePath = repoRelative(root, target);
    if (!relativePath.startsWith(".forge/prepared/") || !relativePath.endsWith(".md")) {
      throw new ForgeError("OKF scaffolds must be Markdown files under .forge/prepared/");
    }
    if (existsSync(target)) throw new ForgeError(`target already exists: ${relativePath}`);
    if (!type.trim() || !title.trim() || /[\r\n]/.test(type) || /[\r\n]/.test(title)) {
      throw new ForgeError("OKF scaffold requires single-line non-empty type and title");
    }
    const body = bodyFile
      ? read_utf8(contained_path(root, bodyFile, { must_exist: true }))
      : `# ${title.trim()}\n`;
    const forgeIdentity: Identity = { id: randomUUID(), code, type: "okf-concept" };
    const content = serialize_okf_concept(
      { id: forgeIdentity.id, code: forgeIdentity.code, type: type.trim(), title: title.trim() },
      body,
    );
    validate_okf_document("docs/knowledge/scaffold.md", content);
    assert_unique_identity(root, target, forgeIdentity);
    _write_atomic(target, content);
    return {
      path: relativePath,
      forge_identity: forgeIdentity,
      okf_type: type.trim(),
      claim: "prepared OKF concept only; canonical memory is unchanged until an authorized manifest is applied",
    };
  });
}

export function verify_knowledge(repo: string, scopes?: string[]): JsonObject {
  const root = realRepo(repo);
  const selected = selectScopes(scopes, true);
  const documents = managedDocuments(root, selected);
  const issues: Array<{ path: string; code: string; message: string }> = [];
  const gaps: Array<{ path: string | null; code: string; message: string }> = [];
  const seenIds = new Map<unknown, string>();
  const seenCodes = new Map<unknown, string>();
  const records: JsonObject[] = [];
  let okfFormatFailures = 0;

  for (const [kind, path] of documents) {
    const relativePath = repoRelative(root, path);
    let content: string;
    let metadata: Metadata;
    try {
      content = readManaged(root, path);
      const parsed = readCanonical(kind, relativePath, content);
      metadata = parsed.metadata;
      const identity = identityOf(kind, metadata);
      if (!identity) {
        // Reserved OKF index/log files carry no identity by design, so only concepts and Specs report the gap.
        if (kind !== "kb-index" && kind !== "kb-log") {
          gaps.push({ path: relativePath, code: "missing-forge-identity", message: "No Forge identity: frontmatter has no UUID id." });
        }
      } else {
        for (const [field, seen] of [["id", seenIds], ["code", seenCodes]] as const) {
          const value = identity[field];
          if (value === undefined) continue;
          const previous = seen.get(value);
          if (previous !== undefined) issues.push({ path: relativePath, code: `duplicate-${field}`, message: `${field} also belongs to ${previous}` });
          else seen.set(value, relativePath);
        }
      }
      records.push({
        path: relativePath,
        okf_id: kind === "standing-spec" ? null : okfConceptId(relativePath),
        forge_identity: identity,
        kind,
        ...(parsed.type ? { concept_type: parsed.type } : {}),
        ...(parsed.trust_tier ? { trust_tier: parsed.trust_tier } : {}),
        ...(parsed.lifecycle_status ? { lifecycle_status: parsed.lifecycle_status } : {}),
        ...(parsed.stale !== null ? { stale: parsed.stale } : {}),
        format: parsed.legacy ? "forge-legacy" : kind === "standing-spec" ? "forge" : "okf-0.2",
      });
      for (const finding of parsed.health) gaps.push({ path: relativePath, ...finding });
      if (parsed.legacy) {
        issues.push({
          path: relativePath,
          code: "legacy-reserved-document",
          message: "Forge-frontmatter index/log bytes are inspectable but require an explicit prepared conversion to conform to OKF v0.2.",
        });
        okfFormatFailures += 1;
      }
    } catch (error) {
      issues.push({ path: relativePath, code: "invalid-document", message: errorMessage(error) });
      if (kind !== "standing-spec") okfFormatFailures += 1;
      continue;
    }

    if (["kb-decision", "concept", "process", "interface"].includes(kind) && !hasProvenance(metadata, content)) {
      gaps.push({
        path: relativePath,
        code: "missing-provenance",
        message: "No sources or provenance metadata is visible.",
      });
    }
    for (const target of canonicalLinks(kind, content)) {
      try {
        const linked = kind === "standing-spec"
          ? contained_path(root, resolve(dirname(path), target))
          : resolveKnowledgeLink(root, path, target);
        contained_path(root, linked, { must_exist: true });
        if (!statSync(linked).isFile()) throw new ForgeError("link target is not a file");
      } catch (error) {
        const finding = {
          path: relativePath,
          code: "broken-local-link",
          message: `${target}: ${errorMessage(error)}`,
        };
        if (kind === "standing-spec") issues.push(finding);
        else gaps.push(finding);
      }
    }
  }

  if (!documents.length) {
    gaps.push({ path: null, code: "empty-corpus", message: "No managed documents exist in the selected scopes." });
  }
  if (selected.has("kb-index") && !isFile(join(root, "docs/knowledge/index.md"))) {
    gaps.push({
      path: "docs/knowledge/index.md",
      code: "missing-index",
      message: "The optional knowledge entry point is absent.",
    });
  }
  if (selected.has("kb-log") && !isFile(join(root, "docs/knowledge/log.md"))) {
    gaps.push({
      path: "docs/knowledge/log.md",
      code: "missing-log",
      message: "The optional knowledge history is absent.",
    });
  }
  const fullOkfScan = ["concept", "kb-index", "kb-log"].every((scope) => selected.has(scope));
  const anyOkfScan = [...selected].some((scope) => scope !== "standing-spec");
  return {
    valid: issues.length === 0,
    healthy: gaps.length === 0,
    okf: {
      version: "0.2",
      bundle: "docs/knowledge",
      scan: fullOkfScan ? "full" : anyOkfScan ? "partial" : "not-scanned",
      conformant: fullOkfScan ? okfFormatFailures === 0 : null,
      selected_format_valid: anyOkfScan ? okfFormatFailures === 0 : null,
      consumer: "best-effort parse and preservation; references and computations are never executed",
      producer: "exact-byte prepared memory apply with authorization and stale-base checks",
    },
    scopes: [...selected].sort(),
    documents: documents.map(([, path]) => repoRelative(root, path)),
    records,
    issues,
    gaps,
    claim:
      "format conformance and separate health signals only; contradictions, faithful meaning, authority, and implementation were not established",
  };
}

interface ApplyOptions {
  requiredAction?: Action;
  kbOnly?: boolean;
  loop?: string;
}

function existingSpecApplication(repo: string, manifest: string, loop?: string): JsonObject | null {
  const root = realRepo(repo);
  const manifestPath = input_path(root, manifest, loop);
  if (!isFile(manifestPath)) throw new ForgeError("prepared manifest must be a regular file");
  const manifestBytes = readFileSync(manifestPath);
  let value: unknown;
  try {
    value = JSON.parse(decodeUtf8(manifestBytes, "prepared manifest"));
  } catch (error) {
    throw new ForgeError(`prepared manifest must be UTF-8 JSON: ${errorMessage(error)}`, { cause: error });
  }
  if (!isObject(value) || value.application !== "spec" || typeof value.operation_id !== "string") return null;
  const receiptPath = contained_path(root, `.forge/memory/${value.operation_id}.json`);
  if (!existsSync(receiptPath)) return null;
  let raw: unknown;
  try {
    raw = JSON.parse(read_utf8(receiptPath));
  } catch (error) {
    throw new ForgeError(`existing spec application receipt is unreadable: ${errorMessage(error)}`);
  }
  const receipt = historicalReceipt(raw);
  if (receipt.raw.application !== "spec") {
    throw new ForgeError(`memory operation already applied by a different operation: ${receipt.operation_id}`);
  }
  const manifestHash = Bun.CryptoHasher.hash("sha256", manifestBytes, "hex");
  if (receipt.raw.manifest_sha256 !== manifestHash) {
    throw new ForgeError(`existing spec application manifest changed: ${receipt.operation_id}`);
  }

  const divergences: string[] = [];
  for (const change of receipt.changes) {
    const path = mustString(change.path);
    const target = contained_path(root, path);
    if (change.action === "remove") {
      if (existsSync(target)) divergences.push(`${path} exists after recorded removal`);
      continue;
    }
    if (!isFile(target)) {
      divergences.push(`${path} is missing`);
      continue;
    }
    const expected = change.proposed_sha256;
    const current = Bun.CryptoHasher.hash("sha256", readFileSync(target), "hex");
    if (typeof expected !== "string" || expected !== current) {
      divergences.push(`${path} expected ${String(expected)}, found ${current}`);
    }
    if (change.action === "move" && typeof change.from_path === "string" && existsSync(contained_path(root, change.from_path))) {
      divergences.push(`${change.from_path} still exists after recorded move`);
    }
  }
  if (divergences.length) {
    throw new ForgeError(`existing spec application diverged: ${divergences.join("; ")}`);
  }
  return {
    valid: true,
    operation_id: receipt.operation_id,
    application: "spec",
    applied: false,
    already_applied: true,
    result_match: "matching",
    receipt: repoRelative(root, receiptPath),
    proof: receipt.proof,
    claim: "recorded document-only result still matches working-copy bytes; semantic fidelity, implementation, Review, Verify, and publication were not established",
  };
}

function apply(repo: string, manifest: string, options: ApplyOptions = {}): JsonObject {
  return withMutationLock(repo, () => applyOwned(repo, manifest, options));
}

function applyOwned(repo: string, manifest: string, options: ApplyOptions = {}): JsonObject {
  const prepared = prepare(repo, manifest, options);
  const { repo: root, history } = prepared;
  const snapshots = new Map<string, FileState>();
  for (const change of prepared.changes) {
    snapshots.set(change.target, fileState(change.target));
    if (change.move_from) snapshots.set(change.move_from, fileState(change.move_from));
  }
  const staged = new Map<string, string>();
  const installed = new Map<string, FileState>();

  try {
    for (const change of prepared.changes) {
      if (change.proposed_bytes === null || change.action === "move") continue;
      mkdirSync(dirname(change.target), { recursive: true });
      const stage = writeStage(dirname(change.target), ".forge-memory-", change.proposed_bytes);
      const snapshot = mustGet(snapshots, change.target);
      chmodSync(stage, snapshot.mode ?? 0o644);
      staged.set(change.target, stage);
    }

    checkPreparedInputs(prepared);
    checkCurrentState(prepared.changes);
    for (const change of prepared.changes) {
      checkOneCurrentState(change);
      if (change.action === "move") {
        mkdirSync(dirname(change.target), { recursive: true });
        renameSync(mustString(change.move_from), change.target);
        installed.set(mustString(change.move_from), { content: null, mode: null });
      } else if (change.action === "remove") unlinkSync(change.target);
      else if (change.action === "add") linkSync(mustGet(staged, change.target), change.target);
      else renameSync(mustGet(staged, change.target), change.target);
      installed.set(change.target, {
        content: change.proposed_bytes,
        mode: change.action === "move"
          ? mustGet(snapshots, mustString(change.move_from)).mode
          : mustGet(snapshots, change.target).mode ?? 0o644,
      });
    }

    for (const change of prepared.changes) _memory_test_hooks.after_install?.(change);

    mkdirSync(dirname(history), { recursive: true });
    const historyBytes = Buffer.from(`${JSON.stringify(sortJson(historyPayload(prepared)), null, 2)}\n`, "utf8");
    const historyStage = writeStage(dirname(history), ".forge-history-", historyBytes);
    chmodSync(historyStage, 0o644);
    staged.set(history, historyStage);
    linkSync(historyStage, history);
    snapshots.set(history, { content: null, mode: null });
    installed.set(history, { content: historyBytes, mode: 0o644 });
  } catch (error) {
    const rollbackErrors = rollback(snapshots, installed);
    const detail = rollbackErrors.length ? `; rollback incomplete: ${rollbackErrors.join("; ")}` : "";
    throw new ForgeError(`memory apply failed: ${errorMessage(error)}${detail}`, { cause: error });
  } finally {
    for (const stage of staged.values()) {
      try {
        unlinkSync(stage);
      } catch (error) {
        if (!isMissing(error)) throw error;
      }
    }
  }

  return {
    ...verificationResult(prepared),
    applied: true,
    history: repoRelative(root, history),
  };
}

function prepare(repo: string, manifest: string, options: ApplyOptions = {}): Prepared {
  const root = realRepo(repo);
  const manifestPath = input_path(root, manifest, options.loop);
  if (!isFile(manifestPath)) throw new ForgeError("prepared manifest must be a regular file");
  const manifestBytes = readFileSync(manifestPath);
  let value: unknown;
  try {
    value = JSON.parse(decodeUtf8(manifestBytes, "prepared manifest"));
  } catch (error) {
    throw new ForgeError(`prepared manifest must be UTF-8 JSON: ${errorMessage(error)}`, { cause: error });
  }
  if (!isObject(value)) throw new ForgeError("prepared manifest must be a JSON object");
  onlyFields(value, TOP_LEVEL_FIELDS, "manifest", OPTIONAL_TOP_LEVEL_FIELDS);
  if (value.version !== 1 || typeof value.version !== "number") throw new ForgeError("manifest version must be 1");
  const operationId = value.operation_id;
  if (typeof operationId !== "string" || !/^[A-Za-z0-9](?:[A-Za-z0-9._-]{0,127})$/.test(operationId)) {
    throw new ForgeError("operation_id must be a path-safe identifier");
  }
  const history = contained_path(root, `.forge/memory/${operationId}.json`);
  if (existsSync(history)) throw new ForgeError(`memory operation already applied: ${operationId}`);

  const authorizationFile = value.authorization_file;
  if (typeof authorizationFile !== "string" || !authorizationFile.trim()) {
    throw new ForgeError("manifest requires authorization_file");
  }
  const authorization = authorization_context(root, authorizationFile, options.loop);
  const authorizationDate = authorization.date;
  if (typeof authorizationDate !== "string" || !validIsoDate(authorizationDate)) {
    throw new ForgeError("memory authorization date must be an ISO date");
  }
  if (value.application !== undefined && value.application !== "spec") {
    throw new ForgeError("manifest application must be spec when present");
  }
  const specApply = value.application === "spec";
  if (specApply && (!isObject(value.proof) || value.proof.status !== "document-only")) {
    throw new ForgeError("spec apply requires document-only proof");
  }
  const proof = prepareProof(root, value.proof, options.loop);
  const retainedInputs = prepareRetainedInputs(root, value.retained_inputs, specApply, options.loop);
  const rawChanges = value.changes;
  if (!Array.isArray(rawChanges)) {
    throw new ForgeError("manifest changes must be a list");
  }
  if (!rawChanges.length && (proof.status !== "integrated" || options.requiredAction || options.kbOnly || specApply)) {
    throw new ForgeError(
      options.requiredAction || options.kbOnly
        ? "KB operations require at least one canonical knowledge change"
        : specApply
          ? "spec apply requires at least one standing specification change"
          : "an empty change list requires integrated delivery proof",
    );
  }

  const changes: PreparedChange[] = [];
  const targets = new Set<string>();
  const proposedPaths = new Set<string>();
  for (const [index, rawChange] of rawChanges.entries()) {
    const change = prepareChange(root, rawChange, index, specApply, options.loop);
    if (targets.has(change.target)) throw new ForgeError(`duplicate manifest target: ${change.relative}`);
    targets.add(change.target);
    if (change.proposed_path !== null) proposedPaths.add(change.proposed_path);
    if (options.requiredAction && change.action !== options.requiredAction) {
      throw new ForgeError(`KB ${options.requiredAction} manifest contains ${change.action}: ${change.relative}`);
    }
    if (options.kbOnly && change.kind === "standing-spec") {
      throw new ForgeError("KB mutations cannot change standing specifications; use memory apply");
    }
    if (specApply && change.kind === "kb-decision") {
      throw new ForgeError("spec apply cannot create or change protected canonical decisions; use decision record");
    }
    changes.push(change);
  }
  if (proposedPaths.size !== changes.filter((change) => change.proposed_path !== null).length) {
    throw new ForgeError("each manifest change requires its own proposed_file");
  }
  const overlap = [...targets].filter((target) => proposedPaths.has(target)).sort();
  if (overlap[0]) throw new ForgeError(`proposed files cannot also be targets: ${overlap[0]}`);
  const moveSources = new Set(changes.flatMap((change) => change.move_from ? [change.move_from] : []));
  const pathConflict = [...moveSources].find((path) => targets.has(path) || proposedPaths.has(path));
  if (pathConflict) throw new ForgeError(`move source cannot also be another manifest path: ${repoRelative(root, pathConflict)}`);
  if (moveSources.size !== changes.filter((change) => change.move_from !== null).length) {
    throw new ForgeError("each move requires its own from_path");
  }
  if (specApply && !changes.some((change) => change.kind === "standing-spec")) {
    throw new ForgeError("spec apply requires at least one standing specification change");
  }

  checkManifestIdentities(changes);
  checkCurrentState(changes);
  checkOverlayLinks(root, changes);
  const authorizationSnapshot = localSnapshot(root, input_path(root, authorizationFile, options.loop), undefined, options.loop);
  if (!sameJson(JSON.parse(mustString(authorizationSnapshot.content)), authorization)) {
    throw new ForgeError("authorization context changed while preparing the operation");
  }
  const humanSourceSnapshot = referenceSnapshot(root, mustString(authorization.source), options.loop);
  if (humanSourceSnapshot.content !== null && !humanSourceSnapshot.content.includes(mustString(authorization.quote))) {
    throw new ForgeError("authorization source changed while preparing the operation");
  }
  return {
    repo: root,
    loop: options.loop,
    manifest_path: manifestPath,
    manifest: value,
    manifest_sha256: Bun.CryptoHasher.hash("sha256", manifestBytes, "hex"),
    operation_id: operationId,
    authorization,
    proof,
    application: specApply ? "spec" : null,
    retained_inputs: retainedInputs,
    authorization_snapshot: authorizationSnapshot,
    human_source_snapshot: humanSourceSnapshot,
    changes,
    history,
  };
}

function prepareChange(root: string, raw: unknown, index: number, specApply: boolean, loop?: string): PreparedChange {
  const label = `change ${index + 1}`;
  if (!isObject(raw)) throw new ForgeError(`${label} must be an object`);
  onlyFields(raw, CHANGE_FIELDS, label, OPTIONAL_CHANGE_FIELDS);
  for (const field of ["path", "kind", "action"] as const) {
    if (typeof raw[field] !== "string" || !raw[field].trim()) throw new ForgeError(`${label} requires ${field}`);
  }
  const kind = raw.kind as string;
  const action = raw.action as string;
  if (!MEMORY_KINDS.has(kind)) throw new ForgeError(`unsupported memory kind: ${kind}`);
  if (!ACTIONS.has(action)) throw new ForgeError(`unsupported memory action: ${action}`);
  if (action === "move" && !specApply) throw new ForgeError("move is supported only by spec apply");
  const target = contained_path(root, raw.path as string);
  const relativePath = repoRelative(root, target);
  if (!pathAllowsKind(relativePath, kind)) throw new ForgeError(`${relativePath} is not the canonical path for ${kind}`);

  const baseHash = raw.base_sha256;
  const proposedFile = raw.proposed_file;
  if (action === "add") {
    if (baseHash !== null) throw new ForgeError(`add requires null base_sha256: ${relativePath}`);
  } else if (typeof baseHash !== "string" || !/^[0-9a-f]{64}$/.test(baseHash)) {
    throw new ForgeError(`${action} requires a lowercase SHA-256 base hash: ${relativePath}`);
  }

  let moveFrom: string | null = null;
  let moveFromRelative: string | null = null;
  if (action === "move") {
    if (typeof raw.from_path !== "string" || !raw.from_path.trim()) {
      throw new ForgeError(`move requires from_path: ${relativePath}`);
    }
    moveFrom = contained_path(root, raw.from_path, { must_exist: true });
    moveFromRelative = repoRelative(root, moveFrom);
    if (moveFrom === target) throw new ForgeError(`move requires distinct old and new paths: ${relativePath}`);
    if (!pathAllowsKind(moveFromRelative, kind)) {
      throw new ForgeError(`${moveFromRelative} is not the canonical path for ${kind}`);
    }
    if (existsSync(target)) throw new ForgeError(`move target already exists: ${relativePath}`);
    if (!isFile(moveFrom)) throw new ForgeError(`move source does not exist: ${moveFromRelative}`);
  } else if (raw.from_path !== undefined) {
    throw new ForgeError(`from_path is only valid for moves: ${relativePath}`);
  }

  let proposedPath: string | null = null;
  let proposedBytes: Buffer | null = null;
  let proposedMetadata: Metadata | null = null;
  let proposedContent: string | null = null;
  if (action === "remove" || action === "move") {
    if (proposedFile !== null) throw new ForgeError(`${action} requires null proposed_file: ${relativePath}`);
    if (action === "move") {
      proposedBytes = readFileSync(mustString(moveFrom));
      proposedContent = decodeUtf8(proposedBytes, `move source: ${moveFromRelative}`);
      proposedMetadata = kind === "standing-spec"
        ? validate_document_content(proposedContent, kind)
        : validate_okf_document(relativePath, proposedContent).metadata;
    }
  } else {
    if (typeof proposedFile !== "string" || !proposedFile.trim()) {
      throw new ForgeError(`${action} requires proposed_file: ${relativePath}`);
    }
    proposedPath = input_path(root, proposedFile, loop);
    if (!isFile(proposedPath)) throw new ForgeError(`proposed_file must be a regular file: ${proposedFile}`);
    proposedBytes = readFileSync(proposedPath);
    proposedContent = decodeUtf8(proposedBytes, `proposed document: ${proposedFile}`);
    proposedMetadata = kind === "standing-spec"
      ? validate_document_content(proposedContent, kind)
      : validate_okf_document(relativePath, proposedContent).metadata;
  }

  const proposedHash = raw.proposed_sha256;
  if (specApply) {
    if (action === "remove") {
      if (proposedHash !== null) throw new ForgeError(`remove requires null proposed_sha256: ${relativePath}`);
    } else if (typeof proposedHash !== "string" || !/^[0-9a-f]{64}$/.test(proposedHash)) {
      throw new ForgeError(`${action} requires a lowercase SHA-256 proposed hash: ${relativePath}`);
    }
  } else if (proposedHash !== undefined && proposedHash !== null && (
    typeof proposedHash !== "string" || !/^[0-9a-f]{64}$/.test(proposedHash)
  )) {
    throw new ForgeError(`proposed_sha256 must be a lowercase SHA-256 hash or null: ${relativePath}`);
  }
  const actualProposedHash = proposedBytes === null ? null : Bun.CryptoHasher.hash("sha256", proposedBytes, "hex");
  if (proposedHash !== undefined && proposedHash !== actualProposedHash) {
    throw new ForgeError(`stale proposed file for ${relativePath}: expected ${proposedHash}, found ${actualProposedHash}`);
  }
  if (action === "move" && actualProposedHash !== baseHash) {
    throw new ForgeError(`move requires identical checked source and result bytes: ${relativePath}`);
  }

  const metadataChanges = raw.metadata_changes ?? [];
  if (
    !Array.isArray(metadataChanges) ||
    metadataChanges.some((field) =>
      typeof field !== "string" ||
      (kind === "standing-spec" && !/^[A-Za-z][A-Za-z0-9_-]*$/.test(field))
    )
  ) {
    throw new ForgeError(`metadata_changes must be a list of field names: ${relativePath}`);
  }
  const metadataNames = metadataChanges as string[];
  if (new Set(metadataNames).size !== metadataNames.length) {
    throw new ForgeError(`metadata_changes contains duplicates: ${relativePath}`);
  }
  const currentContent = action === "update" && existsSync(target)
    ? decodeUtf8(readFileSync(target), "current document")
    : null;
  const adoptingLegacySpec = specApply && kind === "standing-spec" && currentContent !== null &&
    !currentContent.trimStart().startsWith("---");
  const forbidden = kind === "standing-spec" && !adoptingLegacySpec
    ? metadataNames.filter((field) => IMMUTABLE_METADATA.has(field)).sort()
    : [];
  if (forbidden.length) throw new ForgeError(`immutable metadata cannot be changed: ${forbidden.join(", ")}`);
  if (action !== "update" && metadataNames.length) {
    throw new ForgeError(`metadata_changes is only valid for updates: ${relativePath}`);
  }

  let removedContent: string | null = null;
  let previousContent: string | null = null;
  if (action === "add") {
    if (kind === "standing-spec") check_identity(root, target, mustMetadata(proposedMetadata));
  } else if (action === "update" && currentContent !== null) {
    previousContent = currentContent;
    if (adoptingLegacySpec) {
      assert_unique_identity(root, target, identityOf(kind, mustMetadata(proposedMetadata)) as Identity);
      // Reuse the same title/scenario validation for the old plain Markdown body.
      const [, proposedBody] = parse_document(mustString(proposedContent));
      const header = mustString(proposedContent).slice(0, mustString(proposedContent).length - proposedBody.length);
      validate_document_content(header + currentContent, kind);
    }
    const currentMetadata = adoptingLegacySpec ? {} : kind === "standing-spec"
      ? validate_document_content(currentContent, kind)
      : readCanonical(kind, relativePath, currentContent).metadata;
    if (kind === "standing-spec" && !adoptingLegacySpec) {
      check_identity(root, target, currentMetadata);
      if ([...IDENTITY_FIELDS].some((field) => currentMetadata[field] !== mustMetadata(proposedMetadata)[field])) {
        throw new ForgeError(`immutable identity changed: ${relativePath}`);
      }
    }
    // Reserved OKF index/log files carry no native identity, so converting a legacy one may drop it.
    const currentIdentity = ["standing-spec", "kb-index", "kb-log"].includes(kind) ? null : identityOf(kind, currentMetadata);
    const proposedIdentity = identityOf(kind, mustMetadata(proposedMetadata));
    if (currentIdentity && (proposedIdentity?.id !== currentIdentity.id || proposedIdentity.code !== currentIdentity.code)) {
      throw new ForgeError(`immutable identity changed: ${relativePath}`);
    }
    const rawDifferences = adoptingLegacySpec ? new Set(Object.keys(mustMetadata(proposedMetadata))) : metadataDifferences(
      currentContent,
      mustString(proposedContent),
      kind,
      currentMetadata,
      mustMetadata(proposedMetadata),
    );
    const immutableRaw = kind === "standing-spec" && !adoptingLegacySpec
      ? [...rawDifferences].filter((field) => IMMUTABLE_METADATA.has(field)).sort()
      : [];
    if (immutableRaw.length) {
      throw new ForgeError(`immutable metadata representation changed: ${immutableRaw.join(", ")}`);
    }
    const declared = new Set(metadataNames);
    if (!setEqual(rawDifferences, declared)) {
      const undeclared = [...rawDifferences].filter((field) => !declared.has(field)).sort();
      const unused = [...declared].filter((field) => !rawDifferences.has(field)).sort();
      const details: string[] = [];
      if (undeclared.length) details.push(`undeclared changes: ${undeclared.join(", ")}`);
      if (unused.length) details.push(`declared but unchanged: ${unused.join(", ")}`);
      throw new ForgeError(`metadata change declaration mismatch for ${relativePath}: ${details.join("; ")}`);
    }
  } else if (action === "remove" && existsSync(target)) {
    removedContent = decodeUtf8(readFileSync(target), "removed document");
    if (kind === "standing-spec") check_identity(root, target, validate_document_content(removedContent, kind));
    else readCanonical(kind, relativePath, removedContent);
  }

  let forgeIdentity: Identity | null;
  if (action === "remove") {
    forgeIdentity = removedContent === null ? null : identityOf(kind, readCanonical(kind, relativePath, removedContent).metadata);
  } else {
    forgeIdentity = identityOf(kind, mustMetadata(proposedMetadata));
    if (action === "move") {
      if (!forgeIdentity) throw new ForgeError(`move source requires a Forge identity in frontmatter: ${moveFromRelative}`);
      if (kind === "standing-spec") check_identity(root, mustString(moveFrom), mustMetadata(proposedMetadata));
      else assert_unique_identity(root, target, forgeIdentity, [mustString(moveFrom)]);
    } else if (forgeIdentity && kind !== "standing-spec") {
      assert_unique_identity(root, target, forgeIdentity);
    }
  }

  return {
    relative: relativePath,
    target,
    kind,
    action: action as Action,
    base_sha256: typeof baseHash === "string" ? baseHash : null,
    move_from: moveFrom,
    move_from_relative: moveFromRelative,
    proposed_path: proposedPath,
    proposed_bytes: proposedBytes,
    proposed_sha256: actualProposedHash,
    proposed_metadata: proposedMetadata,
    forge_identity: forgeIdentity,
    removed_content: removedContent,
    previous_content: previousContent,
    metadata_changes: metadataNames,
  };
}

function prepareProof(root: string, raw: unknown, loop?: string): JsonObject {
  if (!isObject(raw)) throw new ForgeError("manifest requires a proof object");
  onlyFields(raw, PROOF_FIELDS, "proof");
  const status = raw.status;
  if (status !== "document-only" && status !== "integrated") {
    throw new ForgeError("proof status must be document-only or integrated");
  }
  const result: JsonObject = { status };
  for (const field of ["source", "evidence", "acceptance"] as const) {
    const values = raw[field];
    if (!Array.isArray(values) || values.some((value) => typeof value !== "string" || !value.trim())) {
      throw new ForgeError(`proof ${field} must be a list of references`);
    }
    result[field] = values.map((value) => proofReference(root, value as string, loop));
  }
  if (!(result.source as string[]).length) throw new ForgeError("proof requires at least one source reference");
  if (status === "integrated" && (!(result.evidence as string[]).length || !(result.acceptance as string[]).length)) {
    throw new ForgeError("integrated proof requires evidence and acceptance references");
  }
  return result;
}

function prepareRetainedInputs(root: string, raw: unknown, required: boolean, loop?: string): SourceSnapshot[] {
  if (raw === undefined && !required) return [];
  if (!Array.isArray(raw)) throw new ForgeError("retained_inputs must be a list");
  const snapshots = raw.map((item, index) => {
    const label = `retained input ${index + 1}`;
    if (!isObject(item)) throw new ForgeError(`${label} must be an object`);
    onlyFields(item, RETAINED_INPUT_FIELDS, label);
    const role = item.role;
    const source = item.source;
    if (typeof role !== "string" || !RETAINED_INPUT_ROLES.has(role)) {
      throw new ForgeError(`${label} has an unsupported role`);
    }
    if (typeof source !== "string" || !source.trim()) throw new ForgeError(`${label} requires source`);
    if (/^https?:\/\/[^/]+/i.test(source)) {
      if (role !== "context") throw new ForgeError(`${role} must be retained as an exact local snapshot`);
      if (item.sha256 !== null) throw new ForgeError(`remote retained input requires null sha256: ${source}`);
      return remoteSnapshot(source, role);
    }
    if (typeof item.sha256 !== "string" || !/^[0-9a-f]{64}$/.test(item.sha256)) {
      throw new ForgeError(`local retained input requires a lowercase SHA-256 hash: ${source}`);
    }
    const snapshot = localSnapshot(root, source, role, loop);
    if (snapshot.sha256 !== item.sha256) {
      throw new ForgeError(`stale retained input ${source}: expected ${item.sha256}, found ${snapshot.sha256}`);
    }
    const inputRelative = repoRelative(root, input_path(root, source, loop));
    if (
      (role === "accepted-baseline" || role === "approved-change") &&
      (inputRelative.startsWith("docs/specs/") || inputRelative.startsWith("docs/knowledge/"))
    ) {
      throw new ForgeError(`${role} must be retained independently of canonical files`);
    }
    return snapshot;
  });
  if (required) {
    for (const role of ["accepted-baseline", "approved-change"]) {
      if (!snapshots.some((snapshot) => snapshot.role === role)) {
        throw new ForgeError(`spec apply requires a retained ${role}`);
      }
    }
    const baselineSources = new Set(snapshots.filter((item) => item.role === "accepted-baseline").map((item) => item.source));
    if (snapshots.some((item) => item.role === "approved-change" && baselineSources.has(item.source))) {
      throw new ForgeError("accepted baseline and approved change must be retained separately");
    }
  }
  return snapshots;
}

function localSnapshot(root: string, source: string, role?: string, loop?: string): SourceSnapshot {
  const path = input_path(root, source, loop);
  if (!isFile(path)) throw new ForgeError(`retained source must be a regular file: ${source}`);
  const bytes = readFileSync(path);
  return {
    ...(role ? { role } : {}),
    source: loop ? path : sourceReference(root, path),
    sha256: Bun.CryptoHasher.hash("sha256", bytes, "hex"),
    content: decodeUtf8(bytes, `retained source: ${source}`),
    provenance: "local-snapshot",
    evidentiary_limit: "exact bytes retained; source meaning, authorship, and human authenticity were not established",
  };
}

function remoteSnapshot(source: string, role?: string): SourceSnapshot {
  return {
    ...(role ? { role } : {}),
    source,
    sha256: null,
    content: null,
    provenance: "remote-reference",
    evidentiary_limit: "reference retained without fetching or authenticating remote content",
  };
}

function referenceSnapshot(root: string, source: string, loop?: string): SourceSnapshot {
  return /^https?:\/\/[^/]+/i.test(source) ? remoteSnapshot(source) : localSnapshot(root, source, undefined, loop);
}

function checkPreparedInputs(prepared: Prepared): void {
  for (const snapshot of [
    ...prepared.retained_inputs,
    prepared.authorization_snapshot,
    prepared.human_source_snapshot,
  ]) {
    if (snapshot.provenance === "remote-reference") continue;
    const path = input_path(prepared.repo, snapshot.source, prepared.loop);
    if (!isFile(path)) throw new ForgeError(`prepared source changed before apply: ${snapshot.source}`);
    const current = Bun.CryptoHasher.hash("sha256", readFileSync(path), "hex");
    if (current !== snapshot.sha256) throw new ForgeError(`prepared source changed before apply: ${snapshot.source}`);
  }
}

function proofReference(root: string, value: string, loop?: string): string {
  if (/^https?:\/\/[^/]+/i.test(value)) return value;
  const path = input_path(root, value, loop);
  if (!isFile(path)) throw new ForgeError(`proof reference must be a file: ${value}`);
  return loop ? path : sourceReference(root, path);
}

function sourceReference(root: string, path: string): string {
  const relativePath = repoRelative(root, path);
  return relativePath === '..' || relativePath.startsWith('../') ? path : relativePath;
}

function checkCurrentState(changes: PreparedChange[]): void {
  _memory_test_hooks.check_current_state?.(changes);
  for (const change of changes) checkOneCurrentState(change);
}

function checkOneCurrentState(change: PreparedChange): void {
  _memory_test_hooks.check_one_current_state?.(change);
  if (change.action === "move") {
    if (existsSync(change.target)) throw new ForgeError(`move target already exists: ${change.relative}`);
    const source = mustString(change.move_from);
    if (!isFile(source)) throw new ForgeError(`move source does not exist: ${change.move_from_relative}`);
    const sourceHash = Bun.CryptoHasher.hash("sha256", readFileSync(source), "hex");
    if (sourceHash !== change.base_sha256 || sourceHash !== change.proposed_sha256) {
      throw new ForgeError(`stale move source for ${change.move_from_relative}: expected ${change.base_sha256}, found ${sourceHash}`);
    }
    return;
  }
  if (change.action === "add") {
    if (existsSync(change.target)) throw new ForgeError(`add target already exists: ${change.relative}`);
    return;
  }
  if (!isFile(change.target)) throw new ForgeError(`${change.action} target does not exist: ${change.relative}`);
  const currentHash = Bun.CryptoHasher.hash("sha256", readFileSync(change.target), "hex");
  if (currentHash !== change.base_sha256) {
    throw new ForgeError(`stale base for ${change.relative}: expected ${change.base_sha256}, found ${currentHash}`);
  }
  if (change.action === "update" && currentHash === change.proposed_sha256) {
    throw new ForgeError(`no-op update: ${change.relative}`);
  }
}

function checkManifestIdentities(changes: PreparedChange[]): void {
  const seenIds = new Map<unknown, string>();
  const seenCodes = new Map<unknown, string>();
  for (const change of changes) {
    if (change.forge_identity === null) continue;
    for (const [field, seen] of [
      ["id", seenIds],
      ["code", seenCodes],
    ] as const) {
      const value = change.forge_identity[field];
      if (value === undefined) continue;
      const previous = seen.get(value);
      if (previous && previous !== change.relative) {
        throw new ForgeError(`duplicate proposed ${field} in ${previous} and ${change.relative}`);
      }
      seen.set(value, change.relative);
    }
  }
}

function checkOverlayLinks(root: string, changes: PreparedChange[]): void {
  const overlay = new Map<string, Buffer | null>();
  for (const change of changes) {
    overlay.set(change.target, change.proposed_bytes);
    if (change.move_from) overlay.set(change.move_from, null);
  }
  const removed = new Set([...overlay].filter(([, content]) => content === null).map(([path]) => path));
  for (const change of changes) {
    if (change.proposed_bytes === null || change.kind !== "standing-spec") continue;
    const content = decodeUtf8(change.proposed_bytes, "proposed document");
    for (const target of localLinks(content)) {
      const linked = contained_path(root, resolve(dirname(change.target), target));
      const existsAfter = overlay.has(linked) ? overlay.get(linked) !== null : isFile(linked);
      if (!existsAfter) {
        throw new ForgeError(`prepared document has a broken local link: ${change.relative} -> ${target}`);
      }
    }
  }
  if (!removed.size) return;
  for (const [kind, path] of managedDocuments(root, MEMORY_KINDS)) {
    if (kind !== "standing-spec") continue;
    const contentBytes = overlay.get(path);
    if (overlay.has(path) && contentBytes == null) continue;
    const content = contentBytes == null ? readManaged(root, path) : decodeUtf8(contentBytes, "managed document");
    for (const target of localLinks(content)) {
      const linked = contained_path(root, resolve(dirname(path), target));
      if (removed.has(linked)) {
        throw new ForgeError(`removal would break an inbound local link: ${repoRelative(root, path)} -> ${target}`);
      }
    }
  }
}

function verificationResult(prepared: Prepared): JsonObject {
  const claim = prepared.application === "spec"
    ? "installed or validated document-only target bytes; semantic fidelity, human authenticity, implementation, Review, Verify, and publication were not established"
    : prepared.changes.length
    ? "structurally validated prepared files; semantic preservation, human authenticity, implementation, and PR merge were not established"
    : "structurally validated authorized integrated delivery references; evidence meaning, human authenticity, deployment, publication, and compliance were not established";
  return {
    valid: true,
    operation_id: prepared.operation_id,
    ...(prepared.application ? { application: prepared.application } : {}),
    authorization: {
      actor: prepared.authorization.actor,
      source: prepared.authorization.source,
      quote: prepared.authorization.quote,
      scope: prepared.authorization.scope,
      date: prepared.authorization.date,
      context: "retained; not independently authenticated",
    },
    proof: prepared.proof,
    changes: prepared.changes.map((change) => ({
      path: change.relative,
      kind: change.kind,
      action: change.action,
      ...(change.move_from_relative ? { from_path: change.move_from_relative } : {}),
      base_sha256: change.base_sha256,
      proposed_sha256: change.proposed_sha256,
      forge_identity: change.forge_identity,
      metadata_changes: change.metadata_changes,
    })),
    claim,
  };
}

function historyPayload(prepared: Prepared): JsonObject {
  const payload = structuredClone(prepared.manifest);
  const verifiedChanges = verificationResult(prepared).changes as JsonObject[];
  for (const [index, change] of prepared.changes.entries()) {
    const result = verifiedChanges[index];
    if (!result) throw new ForgeError("missing verified change");
    if (change.action === "remove") result.removed_content = change.removed_content;
    else if (change.action === "update") result.previous_content = change.previous_content;
    else if (change.action === "move") result.previous_content = change.proposed_bytes === null
      ? null
      : decodeUtf8(change.proposed_bytes, "moved document");
    if (change.proposed_bytes !== null) {
      result.proposed_content = decodeUtf8(change.proposed_bytes, "proposed document");
    }
  }
  return {
    ...payload,
    ...(prepared.application ? { application: prepared.application } : {}),
    manifest_sha256: prepared.manifest_sha256,
    applied_at: new Date().toISOString().replace("Z", "+00:00"),
    authorization_context: prepared.authorization,
    authority_snapshots: {
      authorization_file: prepared.authorization_snapshot,
      human_source: prepared.human_source_snapshot,
    },
    retained_input_snapshots: prepared.retained_inputs,
    result: {
      changes: verifiedChanges,
      claim: verificationResult(prepared).claim,
    },
  };
}

function rollback(snapshots: Map<string, FileState>, installed: Map<string, FileState>): string[] {
  const errors: string[] = [];
  for (const [target, expected] of [...installed].reverse()) {
    const original = mustGet(snapshots, target);
    try {
      if (matchesState(target, original)) continue;
      if (!matchesState(target, expected)) {
        errors.push(`preserved intervening change: ${target}`);
        continue;
      }
      if (original.content === null) unlinkSync(target);
      else replaceBytes(target, original.content, original.mode ?? 0o644);
    } catch (error) {
      errors.push(`${target}: ${errorMessage(error)}`);
    }
  }
  return errors;
}

function fileState(path: string): FileState {
  if (!existsSync(path)) return { content: null, mode: null };
  const stats = statSync(path);
  return { content: readFileSync(path), mode: stats.mode & 0o7777 };
}

function matchesState(path: string, state: FileState): boolean {
  const stats = lstatSync(path, { throwIfNoEntry: false });
  if (stats?.isSymbolicLink()) return false;
  if (state.content === null) return stats === undefined;
  if (!stats?.isFile() || (stats.mode & 0o7777) !== state.mode) return false;
  return readFileSync(path).equals(state.content);
}

function replaceBytes(path: string, content: Buffer, mode: number): void {
  mkdirSync(dirname(path), { recursive: true });
  const stage = writeStage(dirname(path), ".forge-rollback-", content);
  try {
    chmodSync(stage, mode);
    renameSync(stage, path);
  } finally {
    try {
      unlinkSync(stage);
    } catch (error) {
      if (!isMissing(error)) throw error;
    }
  }
}

function writeStage(directory: string, prefix: string, content: Buffer): string {
  const path = join(directory, `${prefix}${randomUUID()}`);
  const descriptor = openSync(path, "wx", 0o600);
  try {
    writeFileSync(descriptor, content);
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
  return path;
}

/** A canonical document's Forge identity comes from its own frontmatter; OKF documents without a UUID `id` have none. */
function identityOf(kind: string, metadata: Metadata): Identity | null {
  if (typeof metadata.id !== "string" || !isUuid(metadata.id)) return null;
  const forge = kind === "standing-spec" || metadata.type === kind;
  return {
    id: metadata.id,
    type: forge ? String(metadata.type) : okfIdentityType(kind),
    ...(typeof metadata.code === "string" ? { code: metadata.code } : {}),
  };
}

function okfIdentityType(kind: string): string {
  if (kind === "kb-index") return "okf-index";
  if (kind === "kb-log") return "okf-log";
  return "okf-concept";
}

function readCanonical(
  kind: string,
  relativePath: string,
  content: string,
): {
  metadata: Metadata;
  body: string;
  title: string | null;
  type: string | null;
  trust_tier: OkfDocument["trust_tier"];
  lifecycle_status: OkfDocument["lifecycle_status"];
  stale: boolean | null;
  health: Array<{ code: string; message: string }>;
  legacy: boolean;
} {
  if (kind === "standing-spec") {
    const metadata = validate_document_content(content, kind);
    const [, body] = parse_document(content);
    return { metadata, body, title: typeof metadata.title === "string" ? metadata.title : null, type: null, trust_tier: null, lifecycle_status: null, stale: null, health: [], legacy: false };
  }
  try {
    return { ...inspect_okf_document(relativePath, content), legacy: false };
  } catch (error) {
    if (!["kb-index", "kb-log"].includes(kind)) throw error;
    let metadata: Metadata;
    try {
      metadata = validate_document_content(content, kind);
    } catch {
      throw error;
    }
    const [, body] = parse_document(content);
    return {
      metadata,
      body,
      title: typeof metadata.title === "string" ? metadata.title : null,
      type: null,
      trust_tier: null,
      lifecycle_status: null,
      stale: null,
      health: [{
        code: "legacy-reserved-format",
        message: "Forge frontmatter is preserved for inspection until an authorized OKF conversion is applied.",
      }],
      legacy: true,
    };
  }
}

function okfConceptId(relativePath: string): string | null {
  const path = relativePath.replace(/^docs\/knowledge\//, "");
  if (path.endsWith("/index.md") || path === "index.md" || path.endsWith("/log.md") || path === "log.md") return null;
  return path.endsWith(".md") ? path.slice(0, -3) : path;
}

function canonicalLinks(kind: string, content: string): string[] {
  return kind === "standing-spec" ? localLinks(content) : okf_local_links(content);
}

function resolveKnowledgeLink(root: string, sourcePath: string, target: string): string {
  const linked = target.startsWith("/")
    ? resolve(root, "docs/knowledge", target.slice(1))
    : resolve(dirname(sourcePath), target);
  const knowledge = join(root, "docs/knowledge");
  const within = relative(knowledge, linked);
  if (within === ".." || within.startsWith("../") || resolve(within) === within) {
    throw new ForgeError("OKF link leaves the bundle");
  }
  return linked;
}

function kindForPath(path: string): string | null {
  const parts = path.split("/");
  if (
    parts.length === 4 &&
    parts[0] === "docs" &&
    parts[1] === "specs" &&
    parts[3] === "SPEC.md" &&
    slug(parts[2] ?? "")
  ) {
    return "standing-spec";
  }
  if (parts[0] !== "docs" || parts[1] !== "knowledge" || parts.length < 3) return null;
  const filename = parts.at(-1) ?? "";
  if (filename === "index.md") return "kb-index";
  if (filename === "log.md") return "kb-log";
  if (!filename.endsWith(".md")) return null;
  const roots: Record<string, string> = {
    decisions: "kb-decision",
    domain: "concept",
    processes: "process",
    interfaces: "interface",
  };
  if (parts.length === 4 && parts[2] === "decisions" && /^D[1-9]\d*-[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.md$/.test(filename)) {
    return "kb-decision";
  }
  if (parts.length === 4 && roots[parts[2] ?? ""] && slug(filename.slice(0, -3))) {
    return roots[parts[2] ?? ""] ?? null;
  }
  return "concept";
}

function pathAllowsKind(path: string, kind: string): boolean {
  const actual = kindForPath(path);
  if (actual === kind) return true;
  return kind === "concept" && actual !== null && !["standing-spec", "kb-index", "kb-log"].includes(actual);
}

function slug(value: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(value);
}

function readManaged(root: string, path: string): string {
  contained_path(root, path, { must_exist: true });
  if (!lstatSync(path).isFile()) throw new ForgeError(`managed document must be a regular file: ${path}`);
  return read_utf8(path);
}

function managedDocuments(root: string, scopes: ReadonlySet<string>): Array<[string, string]> {
  const candidates: Array<[string, string]> = [];
  function entries(kind: string, directory: string) {
    try {
      contained_path(root, directory);
      const info = lstatSync(directory, { throwIfNoEntry: false });
      if (!info) return [];
      if (!info.isDirectory()) throw new ForgeError("unsupported canonical directory");
      return readdirSync(directory, { withFileTypes: true });
    } catch {
      candidates.push([kind, directory]);
      return [];
    }
  }
  const specs = join(root, "docs/specs");
  if (scopes.has("standing-spec")) {
    for (const entry of entries("standing-spec", specs)) {
      const path = join(specs, entry.name, "SPEC.md");
      const capability = entry.isDirectory() || (entry.isSymbolicLink() && statSync(join(specs, entry.name), { throwIfNoEntry: false })?.isDirectory());
      if (capability && lstatSync(path, { throwIfNoEntry: false })) {
        candidates.push(["standing-spec", path]);
      }
    }
  }
  const knowledge = join(root, "docs/knowledge");
  function walk(directory: string): void {
    let children: Array<{ name: string; isDirectory(): boolean }>;
    try {
      contained_path(root, directory);
      const info = lstatSync(directory, { throwIfNoEntry: false });
      if (!info) return;
      if (!info.isDirectory()) throw new ForgeError("unsupported canonical directory");
      children = readdirSync(directory, { withFileTypes: true });
    } catch {
      candidates.push(["concept", directory]);
      return;
    }
    for (const child of children) {
      const path = join(directory, child.name);
      if (child.isDirectory()) {
        if (child.name.endsWith(".md")) {
          const kind = kindForPath(repoRelative(root, path)) ?? "concept";
          const selected = scopes.has(kind) || (scopes.has("concept") && !["kb-index", "kb-log"].includes(kind));
          if (selected) candidates.push([kind, path]);
          continue;
        }
        walk(path);
        continue;
      }
      if (!child.name.endsWith(".md")) continue;
      const kind = kindForPath(repoRelative(root, path)) ?? "concept";
      const selected = scopes.has(kind) || (scopes.has("concept") && !["kb-index", "kb-log"].includes(kind));
      if (selected) candidates.push([kind, path]);
    }
  }
  if ([...scopes].some((scope) => scope !== "standing-spec")) walk(knowledge);
  return candidates.sort((left, right) => repoRelative(root, left[1]).localeCompare(repoRelative(root, right[1])));
}

function selectScopes(scopes: string[] | undefined, includeSpec: boolean): Set<string> {
  const allowed = includeSpec ? MEMORY_KINDS : KB_KINDS;
  if (scopes === undefined) return new Set(allowed);
  if (!Array.isArray(scopes) || !scopes.length) {
    throw new ForgeError("scope must name one or more managed document kinds");
  }
  const selected = new Set(scopes);
  const unknown = [...selected].filter((scope) => !allowed.has(scope)).sort();
  if (unknown.length) throw new ForgeError(`unknown memory scope: ${unknown.join(", ")}`);
  return selected;
}

function onlyFields(value: JsonObject, allowed: Set<string>, label: string, optional = new Set<string>()): void {
  const keys = new Set(Object.keys(value));
  const missing = [...allowed].filter((key) => !optional.has(key) && !keys.has(key)).sort();
  const extra = [...keys].filter((key) => !allowed.has(key)).sort();
  if (missing.length) throw new ForgeError(`${label} is missing fields: ${missing.join(", ")}`);
  if (extra.length) throw new ForgeError(`${label} has unsupported fields: ${extra.join(", ")}`);
}

function metadataDifferences(
  before: string,
  after: string,
  kind: string,
  beforeMetadata: Metadata,
  afterMetadata: Metadata,
): Set<string> {
  if (kind !== "standing-spec") {
    return new Set(
      [...new Set([...Object.keys(beforeMetadata), ...Object.keys(afterMetadata)])]
        .filter((key) => !sameJson(beforeMetadata[key], afterMetadata[key])),
    );
  }
  const left = rawMetadata(before);
  const right = rawMetadata(after);
  return new Set([...new Set([...Object.keys(left), ...Object.keys(right)])].filter((key) => left[key] !== right[key]));
}

function rawMetadata(content: string): Record<string, string> {
  const match = /^---\r?\n(.*?)\r?\n---(?:\r?\n|$)/s.exec(content);
  if (!match) throw new ForgeError("document requires YAML frontmatter");
  const fields: Record<string, string[]> = { $header: [] };
  let current = "$header";
  for (const line of (match[1] ?? "").match(/.*(?:\r?\n|$)/g) ?? []) {
    if (!line) continue;
    const key = /^([A-Za-z][A-Za-z0-9_-]*):/.exec(line)?.[1];
    if (key) {
      current = key;
      fields[current] ??= [];
    }
    fields[current]?.push(line);
  }
  return Object.fromEntries(Object.entries(fields).filter(([, lines]) => lines.length).map(([key, lines]) => [key, lines.join("")]));
}

function localLinks(content: string): string[] {
  const links: string[] = [];
  for (const match of content.matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+['"][^'"]*['"])?\)/g)) {
    const target = match[1];
    if (!target || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(target) || target.startsWith("#") || target.startsWith("/")) {
      continue;
    }
    links.push(target.split("#", 1)[0] ?? target);
  }
  return links;
}

function hasProvenance(metadata: Metadata, content: string): boolean {
  for (const key of ["sources", "source", "provenance"]) {
    const value = metadata[key];
    if (typeof value === "string" && value.trim()) return true;
    if (Array.isArray(value) && value.length) return true;
    if (isObject(value) && Object.keys(value).length) return true;
  }
  const raw = rawMetadata(content).sources ?? "";
  return raw.slice(raw.indexOf(":") + 1).trim().length > 0;
}

function realRepo(repo: string): string {
  return contained_path(repo, ".", { must_exist: true });
}

function repoRelative(root: string, path: string): string {
  return relative(root, path).split("\\").join("/");
}

function isFile(path: string): boolean {
  return statSync(path, { throwIfNoEntry: false })?.isFile() ?? false;
}

function decisionTitle(explicit: string | undefined, body: string): string {
  const inferred = body.match(/^#{1,6}\s+(.+?)\s*$/m)?.[1] ?? body.split(/\r?\n/, 1)[0] ?? "";
  const title = (explicit ?? inferred).trim();
  if (!title || /[\r\n]/.test(title)) throw new ForgeError("decision title must be one nonempty line");
  return title;
}

function decisionSlug(title: string): string {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64)
    .replace(/-$/, "");
  return slug || "decision";
}

/** Loop-local readable code: the next `D<n>` heading in this loop's decisions.md. */
function nextLoopDecisionCode(content: string): string {
  let highest = 0;
  for (const match of content.matchAll(/^## (?:Decision: )?D([1-9]\d*)\b/gm)) highest = Math.max(highest, Number(match[1]));
  return `D${highest + 1}`;
}

function prepareLoopDecisionReference(
  root: string,
  path: string,
  id: string,
  title: string,
  decisionPath: string,
  context: Metadata,
  supersedes?: string,
  loop?: string,
): { target: string; old: string; next: string; code: string } {
  const target = document_path(root, path, loop, true);
  const old = read_utf8(target);
  const metadata = validate_document_content(old, "decisions");
  check_identity(root, target, metadata);
  const code = nextLoopDecisionCode(old);
  const link = relative(dirname(target), join(root, decisionPath)).split("\\").join("/");
  const entry = [
    `## ${code} — ${context.date}`,
    "",
    `- Canonical decision: [${title}](${link})`,
    `- Decision id: ${id}`,
    `- Scope: ${context.scope}`,
    `- Human source: ${context.source}`,
    `- Authorization quote: ${JSON.stringify(context.quote)}`,
    ...(supersedes ? [`- Supersedes: ${supersedes}`] : []),
  ].join("\n");
  return { target, old, next: `${old.trimEnd()}\n\n${entry}\n`, code };
}

/** A superseded decision is a canonical decision UUID, a legacy canonical `decision.code`, or a code in this loop's decisions.md. */
function assertSupersededDecision(root: string, code: string, loopContent?: string): void {
  const canonical = managedDocuments(root, new Set(["kb-decision", "concept"])).some(([, path]) => {
    if (!repoRelative(root, path).startsWith("docs/knowledge/decisions/")) return false;
    try {
      const { metadata } = inspect_okf_document(repoRelative(root, path), readManaged(root, path));
      return metadata.id === code || (isObject(metadata.decision) && metadata.decision.code === code);
    } catch {
      return false;
    }
  });
  const escaped = code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const legacy = loopContent ? new RegExp(`^## (?:Decision: )?${escaped}(?:\\s|—|$)`, "m").test(loopContent) : false;
  if (!canonical && !legacy) throw new ForgeError(`superseded decision is absent: ${code}`);
}

function historicalReceipt(value: unknown): HistoricalReceipt {
  if (!isObject(value)) throw new ForgeError("receipt must be an object");
  if (value.status !== undefined) throw new ForgeError("receipt must represent a successful applied operation");
  if (value.version !== 1) throw new ForgeError("receipt version must be 1");
  const operationId = value.operation_id;
  if (typeof operationId !== "string" || !/^[A-Za-z0-9](?:[A-Za-z0-9._-]{0,127})$/.test(operationId)) {
    throw new ForgeError("receipt operation_id is invalid");
  }
  if (typeof value.manifest_sha256 !== "string" || !/^[0-9a-f]{64}$/.test(value.manifest_sha256)) {
    throw new ForgeError("receipt requires a lowercase manifest_sha256");
  }
  if (typeof value.applied_at !== "string" || !isIsoDateTime(value.applied_at)) {
    throw new ForgeError("receipt applied_at is invalid");
  }
  if (typeof value.authorization_file !== "string" || !value.authorization_file.trim()) {
    throw new ForgeError("receipt requires authorization_file");
  }
  const authorization = value.authorization_context;
  if (!isObject(authorization) || authorization.actor !== "human") {
    throw new ForgeError("receipt requires human authorization context");
  }
  for (const field of ["source", "quote", "scope", "date"] as const) {
    if (typeof authorization[field] !== "string" || !(authorization[field] as string).trim()) {
      throw new ForgeError(`receipt authorization requires ${field}`);
    }
  }
  if (!validIsoDate(authorization.date as string)) throw new ForgeError("receipt authorization date is invalid");

  const proof = value.proof;
  if (!isObject(proof) || (proof.status !== "document-only" && proof.status !== "integrated")) {
    throw new ForgeError("receipt proof status is invalid");
  }
  for (const field of ["source", "evidence", "acceptance"] as const) {
    const references = proof[field];
    if (!Array.isArray(references) || references.some((item) => typeof item !== "string" || !item.trim())) {
      throw new ForgeError(`receipt proof ${field} must be a list of references`);
    }
  }
  if (!(proof.source as string[]).length) throw new ForgeError("receipt proof requires a source reference");
  if (
    proof.status === "integrated" &&
    (!(proof.evidence as string[]).length || !(proof.acceptance as string[]).length)
  ) {
    throw new ForgeError("integrated receipt proof requires evidence and acceptance references");
  }
  if (value.application !== undefined && value.application !== "spec") {
    throw new ForgeError("receipt application is invalid");
  }
  if (value.application === "spec" && proof.status !== "document-only") {
    throw new ForgeError("spec apply receipt must remain document-only");
  }

  if (!Array.isArray(value.changes)) throw new ForgeError("receipt requires manifest changes");
  const result = value.result;
  if (!isObject(result) || typeof result.claim !== "string" || !result.claim.trim() || !Array.isArray(result.changes)) {
    throw new ForgeError("receipt requires a claimed result and changes");
  }
  if (value.changes.length !== result.changes.length) {
    throw new ForgeError("receipt manifest and result change counts differ");
  }
  const changes: JsonObject[] = [];
  for (const [index, rawChange] of result.changes.entries()) {
    const manifestChange = value.changes[index];
    if (!isObject(rawChange) || !isObject(manifestChange)) throw new ForgeError("receipt changes must be objects");
    for (const field of ["path", "kind", "action"] as const) {
      if (typeof rawChange[field] !== "string" || rawChange[field] !== manifestChange[field]) {
        throw new ForgeError(`receipt result change ${index + 1} has inconsistent ${field}`);
      }
    }
    if (!MEMORY_KINDS.has(rawChange.kind as string) || !ACTIONS.has(rawChange.action as string)) {
      throw new ForgeError(`receipt result change ${index + 1} has unsupported kind or action`);
    }
    if (rawChange.action === "move" && typeof rawChange.from_path !== "string") {
      throw new ForgeError(`receipt result change ${index + 1} requires from_path`);
    }
    if (value.application === "spec" && rawChange.action !== "remove") {
      if (typeof rawChange.proposed_content !== "string" || typeof rawChange.proposed_sha256 !== "string") {
        throw new ForgeError(`spec apply receipt result change ${index + 1} requires retained proposed bytes`);
      }
      if (digest(rawChange.proposed_content) !== rawChange.proposed_sha256) {
        throw new ForgeError(`spec apply receipt result change ${index + 1} has inconsistent proposed bytes`);
      }
    }
    changes.push(rawChange);
  }
  if (!changes.length && proof.status !== "integrated") {
    throw new ForgeError("an empty receipt requires integrated delivery proof");
  }
  if (value.application === "spec") {
    if (!changes.some((change) => change.kind === "standing-spec")) {
      throw new ForgeError("spec apply receipt requires a standing specification change");
    }
    if (!Array.isArray(value.retained_input_snapshots)) {
      throw new ForgeError("spec apply receipt requires retained input snapshots");
    }
    for (const snapshot of value.retained_input_snapshots) validateReceiptSnapshot(snapshot);
    const roles = new Set(value.retained_input_snapshots.filter(isObject).map((snapshot) => snapshot.role));
    if (!roles.has("accepted-baseline") || !roles.has("approved-change")) {
      throw new ForgeError("spec apply receipt is missing accepted baseline or approved change provenance");
    }
    if (!isObject(value.authority_snapshots)) throw new ForgeError("spec apply receipt requires authority snapshots");
    validateReceiptSnapshot(value.authority_snapshots.authorization_file);
    validateReceiptSnapshot(value.authority_snapshots.human_source);
  }
  return {
    raw: value,
    operation_id: operationId,
    applied_at: value.applied_at,
    authorization,
    proof,
    changes,
  };
}

function validateReceiptSnapshot(value: unknown): void {
  if (!isObject(value) || typeof value.source !== "string" || !value.source.trim()) {
    throw new ForgeError("receipt source snapshot is invalid");
  }
  if (value.provenance === "remote-reference") {
    if (value.sha256 !== null || value.content !== null) throw new ForgeError("remote receipt source snapshot is invalid");
    return;
  }
  if (
    value.provenance !== "local-snapshot" ||
    typeof value.sha256 !== "string" ||
    !/^[0-9a-f]{64}$/.test(value.sha256) ||
    typeof value.content !== "string" ||
    digest(value.content) !== value.sha256
  ) {
    throw new ForgeError("local receipt source snapshot is invalid");
  }
}

function historyResult(entries: JsonObject[], issues: JsonObject[]): JsonObject {
  return {
    valid: issues.length === 0,
    entries,
    issues,
    claim: "successful memory-operation receipts only; document maintenance, referenced integrated evidence, deployment, publication, and acceptance remain distinct",
  };
}

function digest(content: string): string {
  return Bun.CryptoHasher.hash("sha256", content, "hex");
}

function decodeUtf8(content: Uint8Array, label: string): string {
  try {
    return new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(content);
  } catch (error) {
    throw new ForgeError(`${label} must be UTF-8: ${errorMessage(error)}`, { cause: error });
  }
}

function validIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function sortJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJson);
  if (!isObject(value)) return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortJson(value[key])]));
}

function sameJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(sortJson(left)) === JSON.stringify(sortJson(right));
}

function setEqual(left: Set<string>, right: Set<string>): boolean {
  return left.size === right.size && [...left].every((value) => right.has(value));
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mustMetadata(value: Metadata | null): Metadata {
  if (value === null) throw new ForgeError("missing proposed metadata");
  return value;
}

function mustString(value: unknown): string {
  if (typeof value !== "string") throw new ForgeError("missing required value");
  return value;
}

function mustGet<T>(map: Map<string, T>, key: string): T {
  const value = map.get(key);
  if (value === undefined) throw new ForgeError(`missing apply state: ${key}`);
  return value;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isMissing(error: unknown): boolean {
  return isObject(error) && error.code === "ENOENT";
}
