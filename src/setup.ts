import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";
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
const PHASES = ["spec", "plan", "build", "review", "simplify", "verify", "ship"] as const;
const PACK_PATHS = [
  PACK_MARKER,
  ...PHASES.map((phase) => join("skills", `forge-${phase}`, "SKILL.md")),
  join("skills", "forge-code-review", "SKILL.md"),
  ...["authority", "pragmatism", "severity", "repair", "target-harness"].map((name) => join("skills", "forge-shared", "references", `${name}.md`)),
  ...PHASES.map((phase) => join("commands", "claude", "forge", `${phase}.md`)),
  join("agents", "README.md"),
  "OKF.md",
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
  const destinations = ["OKF.md", join("skills", "forge-acceptance")];
  for (const directory of ["skills", "agents"]) {
    destinations.push(directory, ...readdirSync(join(packRoot, directory), { recursive: true, encoding: "utf8" })
      .filter((path) => directory !== "skills" || (path !== "forge-eval" && !path.startsWith(`forge-eval${sep}`)))
      .map((path) => join(directory, path)));
  }
  const commands = tools.includes("claude")
    ? [join("commands", "forge"), ...readdirSync(join(packRoot, "commands", "claude", "forge"), { recursive: true, encoding: "utf8" })
      .map((path) => join("commands", "forge", path))]
    : [];

  // Validate every selected destination before cleanup changes any host.
  const hosts = tools.map((tool) => {
    const dir = contained_path(root, SETUP_TOOLS[tool]);
    for (const path of tool === "claude" ? [...destinations, ...commands] : destinations) {
      contained_path(root, join(dir, path));
    }
    return { tool, dir, skill: join(dir, PACK_MARKER) };
  });
  for (const { tool, dir, skill } of hosts) {
    mkdirSync(join(dir, "skills"), { recursive: true });
    for (const skill of ["forge", "forge-code-review", "forge-shared", "forge-acceptance", ...PHASES.map((phase) => `forge-${phase}`)]) {
      rmSync(join(dir, "skills", skill), { recursive: true, force: true });
    }
    cpSync(join(packRoot, "skills"), join(dir, "skills"), {
      recursive: true,
      filter: (source) => source !== join(packRoot, "skills", "forge-eval"),
    });
    copy_into(join(packRoot, "agents"), join(dir, "agents"));
    copy_into(join(packRoot, "OKF.md"), join(dir, "OKF.md"));
    if (tool === "claude") {
      rmSync(join(dir, "commands", "forge"), { recursive: true, force: true });
      copy_into(join(packRoot, "commands", "claude", "forge"), join(dir, "commands", "forge"));
    }
    if (!existsSync(skill)) throw new ForgeError(`setup did not write ${skill}`);
  }
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
