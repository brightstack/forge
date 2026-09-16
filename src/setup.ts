import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { ForgeError } from "./errors.ts";
import { contained_path } from "./records.ts";

export const SETUP_TOOLS = {
  agents: ".agents",
  claude: ".claude",
  cursor: ".cursor",
} as const;

export type SetupTool = keyof typeof SETUP_TOOLS;

const FORGE_PACK_REPO = "https://github.com/brightstack/forge";

const PACK_MARKER = join("skills", "forge", "SKILL.md");
const PACK_PATHS = [PACK_MARKER, join("skills", "forge-code-review", "SKILL.md"), join("agents", "README.md"), "OKF.md"] as const;

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

function copy_into(source: string, destination: string): void {
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination, { recursive: true });
}

function install_from_pack(root: string, tools: SetupTool[], packRoot: string): {
  repo: string;
  pack: string;
  tools: SetupTool[];
  hosts: Array<{ tool: SetupTool; dir: string; skill: string }>;
} {
  const hosts = tools.map((tool) => {
    const dir = contained_path(root, SETUP_TOOLS[tool]);
    mkdirSync(join(dir, "skills"), { recursive: true });
    copy_into(join(packRoot, "skills", "forge"), join(dir, "skills", "forge"));
    copy_into(join(packRoot, "skills", "forge-code-review"), join(dir, "skills", "forge-code-review"));
    copy_into(join(packRoot, "agents"), join(dir, "agents"));
    copy_into(join(packRoot, "OKF.md"), join(dir, "OKF.md"));
    const skill = join(dir, PACK_MARKER);
    if (!existsSync(skill)) throw new ForgeError(`setup did not write ${skill}`);
    return { tool, dir, skill };
  });
  return { repo: root, pack: packRoot, tools, hosts };
}

function fetch_github_pack(temp: string): string {
  const dest = join(temp, "forge");
  const result = spawnSync("git", ["clone", "--depth", "1", "--quiet", FORGE_PACK_REPO, dest], {
    encoding: "utf8",
    timeout: 60_000,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });
  if (result.error) {
    throw new ForgeError(`failed to fetch skill pack from ${FORGE_PACK_REPO}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new ForgeError(
      `failed to fetch skill pack from ${FORGE_PACK_REPO}: ${(result.stderr || result.stdout || "git clone failed").trim()}`,
    );
  }
  return require_pack(dest);
}

export function setup_project(repo: string, tools: SetupTool[], pack?: string): {
  repo: string;
  pack: string;
  tools: SetupTool[];
  hosts: Array<{ tool: SetupTool; dir: string; skill: string }>;
} {
  const root = contained_path(repo, ".");
  if (pack) return install_from_pack(root, tools, require_pack(resolve(pack)));
  const temp = mkdtempSync(join(tmpdir(), "forge-pack-"));
  try {
    const installed = install_from_pack(root, tools, fetch_github_pack(temp));
    return { ...installed, pack: FORGE_PACK_REPO };
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}
