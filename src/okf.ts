import { basename, extname } from "node:path";
import { parseDocument, stringify } from "yaml";
import { ForgeError } from "./errors.ts";

export const OKF_VERSION = "0.2";

export type OkfMetadata = Record<string, unknown>;

export interface OkfFinding {
  code: string;
  message: string;
}

export interface OkfDocument {
  kind: "concept" | "index" | "log";
  metadata: OkfMetadata;
  body: string;
  title: string;
  type: string | null;
  trust_tier: "unverified" | "machine-confirmed" | "human-reviewed" | null;
  lifecycle_status: "draft" | "stable" | "deprecated" | null;
  stale: boolean | null;
  health: OkfFinding[];
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
const OFFSET_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/;

export function inspect_okf_document(
  relativePath: string,
  content: string,
  now = new Date(),
): OkfDocument {
  const filename = basename(relativePath);
  if (filename === "index.md") return inspectIndex(relativePath, content);
  if (filename === "log.md") return inspectLog(content);
  return inspectConcept(relativePath, content, now);
}

export function validate_okf_document(relativePath: string, content: string): OkfDocument {
  return inspect_okf_document(relativePath, content);
}

export function serialize_okf_concept(metadata: OkfMetadata, body: string): string {
  const header = stringify(metadata, { lineWidth: 0 }).trimEnd();
  return `---\n${header}\n---\n${body.replace(/^\n+/, "")}`;
}

export function okf_local_links(content: string): string[] {
  const links: string[] = [];
  for (const match of content.matchAll(/!?(?:\[[^\]]*\])\(([^)\s]+)(?:\s+['"][^'"]*['"])?\)/g)) {
    const target = match[1];
    if (!target || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(target) || target.startsWith("#")) continue;
    const path = target.split(/[?#]/, 1)[0];
    if (path) links.push(path);
  }
  return links;
}

function inspectConcept(relativePath: string, content: string, now: Date): OkfDocument {
  const [metadata, body] = parseFrontmatter(content, "concept");
  const type = metadata.type;
  if (typeof type !== "string" || !type.trim()) {
    throw new ForgeError("OKF concept requires a non-empty type string");
  }
  const health: OkfFinding[] = [];
  const verified = verificationEvents(metadata.verified, health);
  checkGenerated(metadata.generated, health);
  checkSources(metadata.sources, metadata.usage_window, health);
  checkLifecycle(metadata, health);
  if (type === "Attested Computation") checkComputation(metadata, health);

  let stale: boolean | null = null;
  if (metadata.stale_after !== undefined && validOffsetDateTime(metadata.stale_after)) {
    stale = now.getTime() >= Date.parse(metadata.stale_after as string);
    if (stale) health.push({ code: "stale", message: "stale_after has passed." });
  }
  const trustTier = verified.some((event) => event.by.startsWith("human:"))
    ? "human-reviewed"
    : verified.length
      ? "machine-confirmed"
      : "unverified";
  const lifecycleStatus = metadata.status === undefined
    ? "stable"
    : ["draft", "stable", "deprecated"].includes(String(metadata.status))
      ? metadata.status as "draft" | "stable" | "deprecated"
      : null;

  return {
    kind: "concept",
    metadata,
    body,
    title: typeof metadata.title === "string" && metadata.title.trim()
      ? metadata.title
      : basename(relativePath, extname(relativePath)),
    type,
    trust_tier: trustTier,
    lifecycle_status: lifecycleStatus,
    stale,
    health,
  };
}

function inspectIndex(relativePath: string, content: string): OkfDocument {
  const root = relativePath === "docs/knowledge/index.md";
  let metadata: OkfMetadata = {};
  let body = content;
  if (content.startsWith("---\n") || content.startsWith("---\r\n")) {
    if (!root) throw new ForgeError("only the bundle-root index.md may contain frontmatter");
    [metadata, body] = parseFrontmatter(content, "bundle-root index");
    const fields = Object.keys(metadata);
    if (fields.some((field) => field !== "okf_version")) {
      throw new ForgeError("bundle-root index.md frontmatter may contain only okf_version");
    }
    if (typeof metadata.okf_version !== "string" || !metadata.okf_version.trim()) {
      throw new ForgeError("okf_version must be a non-empty string");
    }
  }
  if (!/^#\s+\S/m.test(body)) throw new ForgeError("OKF index.md requires a section heading");
  const health: OkfFinding[] = [];
  if (root && metadata.okf_version !== undefined && metadata.okf_version !== OKF_VERSION) {
    health.push({
      code: "unsupported-version",
      message: `Bundle declares OKF ${String(metadata.okf_version)}; Forge implements best-effort consumption and produces ${OKF_VERSION}.`,
    });
  }
  return {
    kind: "index",
    metadata,
    body,
    title: "index",
    type: null,
    trust_tier: null,
    lifecycle_status: null,
    stale: null,
    health,
  };
}

function inspectLog(content: string): OkfDocument {
  if (content.startsWith("---\n") || content.startsWith("---\r\n")) {
    throw new ForgeError("OKF log.md must not contain frontmatter");
  }
  if (!/^#\s+\S/m.test(content)) throw new ForgeError("OKF log.md requires a title heading");
  const headings = [...content.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => match[1] ?? "");
  if (headings.some((heading) => !validDate(heading))) {
    throw new ForgeError("OKF log.md level-two headings must use valid YYYY-MM-DD dates");
  }
  if (headings.some((heading, index) => index > 0 && heading > (headings[index - 1] ?? heading))) {
    throw new ForgeError("OKF log.md date groups must be newest first");
  }
  return {
    kind: "log",
    metadata: {},
    body: content,
    title: "log",
    type: null,
    trust_tier: null,
    lifecycle_status: null,
    stale: null,
    health: [],
  };
}

function parseFrontmatter(content: string, label: string): [OkfMetadata, string] {
  const match = FRONTMATTER.exec(content);
  if (!match || match[1] === undefined) throw new ForgeError(`${label} requires YAML frontmatter`);
  const document = parseDocument(match[1], { schema: "core", uniqueKeys: true });
  if (document.errors.length) {
    throw new ForgeError(`${label} has invalid YAML: ${document.errors.map((error) => error.message).join("; ")}`);
  }
  let value: unknown;
  try {
    value = document.toJS({ maxAliasCount: 100 });
  } catch (error) {
    throw new ForgeError(`${label} has invalid YAML: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (!isObject(value)) throw new ForgeError(`${label} frontmatter must be a YAML mapping`);
  return [value, content.slice(match[0].length)];
}

function verificationEvents(value: unknown, health: OkfFinding[]): Array<{ by: string; at?: string }> {
  if (value === undefined) return [];
  const entries = Array.isArray(value) ? value : [value];
  const result: Array<{ by: string; at?: string }> = [];
  for (const entry of entries) {
    if (!isObject(entry) || typeof entry.by !== "string" || !entry.by.trim()) {
      health.push({ code: "invalid-verified", message: "verified entries should contain a non-empty by actor." });
      continue;
    }
    if (entry.at !== undefined && !validOffsetDateTime(entry.at)) {
      health.push({ code: "invalid-verified-at", message: "verified.at should be an ISO 8601 datetime with a UTC offset." });
    }
    result.push({ by: entry.by, ...(typeof entry.at === "string" ? { at: entry.at } : {}) });
  }
  return result;
}

function checkGenerated(value: unknown, health: OkfFinding[]): void {
  if (value === undefined) return;
  if (!isObject(value) || typeof value.by !== "string" || !value.by.trim()) {
    health.push({ code: "invalid-generated", message: "generated should contain a non-empty by actor." });
    return;
  }
  if (value.at !== undefined && !validOffsetDateTime(value.at)) {
    health.push({ code: "invalid-generated-at", message: "generated.at should be an ISO 8601 datetime with a UTC offset." });
  }
}

function checkSources(sources: unknown, usageWindow: unknown, health: OkfFinding[]): void {
  if (sources !== undefined) {
    if (!Array.isArray(sources)) {
      health.push({ code: "invalid-sources", message: "sources should be a list." });
    } else {
      for (const source of sources) {
        if (!isObject(source) || typeof source.resource !== "string" || !source.resource.trim()) {
          health.push({ code: "invalid-source", message: "each source should contain a non-empty resource." });
        }
        if (isObject(source) && source.last_modified !== undefined && !validOffsetDateTime(source.last_modified)) {
          health.push({ code: "invalid-source-date", message: "sources[].last_modified should include a UTC offset." });
        }
      }
    }
  }
  if (usageWindow !== undefined) checkWindow(usageWindow, "usage_window", health);
}

function checkLifecycle(metadata: OkfMetadata, health: OkfFinding[]): void {
  if (metadata.status !== undefined && !["draft", "stable", "deprecated"].includes(String(metadata.status))) {
    health.push({ code: "unknown-status", message: "status should be draft, stable, or deprecated." });
  }
  if (metadata.stale_after !== undefined && !validOffsetDateTime(metadata.stale_after)) {
    health.push({ code: "invalid-stale-after", message: "stale_after should be an ISO 8601 datetime with a UTC offset." });
  }
}

function checkComputation(metadata: OkfMetadata, health: OkfFinding[]): void {
  if (typeof metadata.runtime !== "string" || !metadata.runtime.trim()) {
    health.push({ code: "missing-runtime", message: "Attested Computation should declare runtime." });
  }
  if (metadata.parameters !== undefined && !Array.isArray(metadata.parameters)) {
    health.push({ code: "invalid-parameters", message: "parameters should be a list." });
  }
  for (const field of ["executor", "attester"] as const) {
    const value = metadata[field];
    if (value !== undefined && (!isObject(value) || typeof value.resource !== "string" || !value.resource.trim())) {
      health.push({ code: `invalid-${field}`, message: `${field} should contain a non-empty resource.` });
    }
  }
}

function checkWindow(value: unknown, label: string, health: OkfFinding[]): void {
  if (!isObject(value) || !validOffsetDateTime(value.from) || !validOffsetDateTime(value.to)) {
    health.push({ code: `invalid-${label.replaceAll("_", "-")}`, message: `${label} should contain from/to datetimes with UTC offsets.` });
  }
}

function validOffsetDateTime(value: unknown): boolean {
  if (typeof value !== "string" || !OFFSET_DATETIME.test(value) || Number.isNaN(Date.parse(value))) return false;
  const date = value.slice(0, 10);
  return validDate(date);
}

function validDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= (days[month - 1] ?? 0);
}

function isObject(value: unknown): value is OkfMetadata {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
