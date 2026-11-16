import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, posix, resolve, sep } from "node:path";
import { ForgeError } from "./errors.ts";
import { contained_path } from "./records.ts";
import { version } from "../package.json";

export const SETUP_TOOLS = {
  agents: ".agents",
  claude: ".claude",
  cursor: ".cursor",
} as const;

export type SetupTool = keyof typeof SETUP_TOOLS;

const FORGE_PACK_REPO = "https://github.com/brightstack/forge";

const PACK_MARKER = join("skills", "forge", "SKILL.md");
const PHASES = ["spec", "plan", "build", "review", "simplify", "verify", "ship"] as const;
/** Forge's shared material: installed once per project under `.forge/`, never into a host's skills. */
const SHARED = ["references", "templates", "agents"] as const;
const PACK_PATHS = [
  PACK_MARKER,
  ...PHASES.map((phase) => join("skills", `forge-${phase}`, "SKILL.md")),
  join("skills", "forge-code-review", "SKILL.md"),
  ...["authority", "pragmatism", "severity", "repair", "target-harness", "okf"].map((name) => join("references", `${name}.md`)),
  join("templates", "standing-spec.md"),
  ...PHASES.map((phase) => join("commands", "claude", "forge", `${phase}.md`)),
  join("agents", "README.md"),
];

export function parse_setup_tools(value = "agents"): SetupTool[] {
  const tools: SetupTool[] = [];
  for (const raw of value.split(",")) {
    const tool = raw.trim().toLowerCase();
    if (!tool) continue;
    if (!(tool in SETUP_TOOLS)) {
      throw new ForgeError(`unknown setup tool '${tool}'; use agents, claude, or cursor`);
    }
    if (!tools.includes(tool as SetupTool)) tools.push(tool as SetupTool);
  }
  if (tools.length === 0) throw new ForgeError("setup requires at least one tool");
  return tools;
}

function require_pack(root: string): string {
  const missing = PACK_PATHS.filter((relative) => !existsSync(join(root, relative)));
  if (missing.length) {
    throw new ForgeError(`skill pack not found at ${root}; expected ${missing.join(", ")}`);
  }
  return root;
}

/** Where a pack-relative file lands, relative to the repository; undefined when setup does not install it. */
function placement(path: string, host: SetupTool): string | undefined {
  const shared = SHARED.find((folder) => path === folder || path.startsWith(`${folder}/`));
  if (shared) return posix.join(".forge", path);
  if (path === "skills/forge-eval" || path.startsWith("skills/forge-eval/")) return undefined;
  if (path === "skills" || path.startsWith("skills/")) return posix.join(SETUP_TOOLS[host], path);
  const commands = posix.join("commands", "claude", "forge");
  if (host === "claude" && (path === commands || path.startsWith(`${commands}/`))) {
    return posix.join(SETUP_TOOLS[host], "commands", "forge", posix.relative(commands, path));
  }
  return undefined;
}

/** Re-point relative links between pack files at their installed locations. */
function relink(content: string, source: string, destination: string, host: SetupTool): string {
  return content.replace(/\]\(([^)\s#]+)/g, (match, target: string) => {
    if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("/")) return match;
    const resolved = posix.normalize(posix.join(posix.dirname(source), target));
    if (resolved.startsWith("..")) return match;
    const installed = placement(resolved.replace(/\/$/, ""), host);
    if (installed === undefined) return match;
    const link = posix.relative(posix.dirname(destination), installed) + (target.endsWith("/") ? "/" : "");
    return `](${link}`;
  });
}

type SetupResult = {
  repo: string;
  pack: string;
  ref?: string;
  tools: SetupTool[];
  shared: string;
  hosts: Array<{ tool: SetupTool; dir: string; skill: string }>;
};

function install_from_pack(root: string, tools: SetupTool[], packRoot: string): SetupResult {
  const files: string[] = [];
  for (const directory of ["skills", ...SHARED, join("commands", "claude", "forge")]) {
    files.push(...readdirSync(join(packRoot, directory), { recursive: true, encoding: "utf8" })
      .map((path) => join(directory, path).split(sep).join("/"))
      .filter((path) => statSync(join(packRoot, path)).isFile()));
  }
  const plan = (host: SetupTool, select: (path: string) => boolean) => files.filter(select).flatMap((source) => {
    const destination = placement(source, host);
    return destination === undefined ? [] : [{ source, destination, host }];
  });
  const isShared = (path: string) => SHARED.some((folder) => path.startsWith(`${folder}/`));
  // Shared material is written once; its links into skills resolve to the first selected host.
  const copies = [
    ...plan(tools[0]!, isShared),
    ...tools.flatMap((tool) => plan(tool, (path) => !isShared(path))),
  ];
  const removals = [
    ...SHARED.map((folder) => posix.join(".forge", folder)),
    ...tools.flatMap((tool) => [
      ...["forge", "forge-code-review", "forge-shared", "forge-acceptance", ...PHASES.map((phase) => `forge-${phase}`)]
        .map((skill) => posix.join(SETUP_TOOLS[tool], "skills", skill)),
      ...(tool === "claude" ? [posix.join(SETUP_TOOLS[tool], "commands", "forge")] : []),
    ]),
  ];

  // Validate every destination before cleanup changes the project. Only Forge-owned folders are replaced;
  // loops, memory receipts, prepared drafts, and forge.yml are never touched.
  for (const path of [...removals, ...copies.map(({ destination }) => destination)]) contained_path(root, path);
  for (const path of removals) rmSync(join(root, path), { recursive: true, force: true });
  for (const { source, destination, host } of copies) {
    const target = join(root, destination);
    mkdirSync(dirname(target), { recursive: true });
    if (source.endsWith(".md")) {
      writeFileSync(target, relink(readFileSync(join(packRoot, source), "utf8"), source, destination, host));
    } else {
      copyFileSync(join(packRoot, source), target);
    }
  }
  const hosts = tools.map((tool) => {
    const dir = join(root, SETUP_TOOLS[tool]);
    const skill = join(dir, PACK_MARKER);
    if (!existsSync(skill)) throw new ForgeError(`setup did not write ${skill}`);
    return { tool, dir, skill };
  });
  return { repo: root, pack: packRoot, tools, shared: join(root, ".forge"), hosts };
}

type GitRun = (args: string[]) => { status: number | null; stdout?: string; stderr?: string; error?: Error };

// Narrow seam so tests can check the requested ref without network access.
export const _setup_test_hooks: { git?: GitRun } = {};

function run_git(args: string[]): ReturnType<GitRun> {
  return spawnSync("git", args, {
    encoding: "utf8",
    timeout: 60_000,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });
}

/** Fetch the public pack at the tag matching this CLI, so skills and mechanics stay one release. */
function fetch_github_pack(temp: string, ref: string): string {
  const dest = join(temp, "forge");
  const result = (_setup_test_hooks.git ?? run_git)(["clone", "--depth", "1", "--quiet", "--branch", ref, FORGE_PACK_REPO, dest]);
  const detail = result.error?.message ?? (result.stderr || result.stdout || "git clone failed").trim();
  if (result.error || result.status !== 0) {
    if (/not found in upstream|couldn't find remote ref|remote branch .* not found/i.test(detail)) {
      throw new ForgeError(`skill pack tag ${ref} does not exist at ${FORGE_PACK_REPO}; install a matching CLI or use --pack <path>`);
    }
    throw new ForgeError(`failed to fetch skill pack tag ${ref} from ${FORGE_PACK_REPO}: ${detail}; use --pack <path> to install from a local package`);
  }
  return require_pack(dest);
}

export function setup_project(repo: string, tools: SetupTool[], pack?: string): SetupResult {
  const root = contained_path(repo, ".");
  if (pack) return install_from_pack(root, tools, require_pack(resolve(pack)));
  const ref = `v${version}`;
  const temp = mkdtempSync(join(tmpdir(), "forge-pack-"));
  try {
    const installed = install_from_pack(root, tools, fetch_github_pack(temp, ref));
    return { ...installed, pack: FORGE_PACK_REPO, ref };
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}
