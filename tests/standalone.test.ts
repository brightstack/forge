import { expect, test } from "bun:test";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const suppliedBinary = process.env.FORGE_TEST_BINARY;
const pack = resolve(import.meta.dir, "..");

function gitBinaryDir(): string {
  const result = spawnSync("/bin/sh", ["-c", "command -v git"], { encoding: "utf8" });
  expect(result.status, result.stderr).toBe(0);
  return dirname(result.stdout.trim());
}

(suppliedBinary ? test : test.skip)("copied executable embeds templates without Python, Bun or source files", () => {
  const root = mkdtempSync(join(tmpdir(), "forge-standalone-"));
  const binary = join(root, "forge");
  copyFileSync(resolve(suppliedBinary!), binary);
  function cli(args: string[]) {
    const result = spawnSync(binary, args, { cwd: root, env: { ...process.env, PATH: "/nonexistent", TMPDIR: root }, encoding: "utf8", timeout: 10_000 });
    expect(result.status, result.stderr).toBe(0);
    return JSON.parse(result.stdout);
  }
  try {
    writeFileSync(join(root, "forge.yml"), "loopsPath: ./work-records\n");
    const removedAgentCommand = spawnSync(binary, ["agent", "status", "missing"], {
      cwd: root,
      env: { ...process.env, PATH: "/nonexistent", TMPDIR: root },
      encoding: "utf8",
      timeout: 10_000,
    });
    expect(removedAgentCommand.status).not.toBe(0);
    expect(removedAgentCommand.stderr).toContain("unknown command 'agent'");
    cli(["init", "standalone", "--repo", root, "--title", "Standalone"]);
    for (const kind of ["issue", "bug", "design", "standing-spec", "concept", "review", "build-log", "acceptance"]) {
      const created = cli(["docs", "create", kind, `${kind}.md`, "--repo", root, "--title", kind]);
      expect(created.status).toBe("draft");
      expect(readFileSync(join(root, `${kind}.md`), "utf8").length).toBeGreaterThan(200);
    }
    const buildLog = readFileSync(join(root, "build-log.md"), "utf8");
    const owningAsset = readFileSync(join(pack, "skills/forge-build/assets/build-log.md"), "utf8");
    expect(buildLog.endsWith(owningAsset)).toBe(true);
    const acceptance = readFileSync(join(root, "acceptance.md"), "utf8");
    const acceptanceAsset = readFileSync(join(pack, "skills/forge-verify/assets/acceptance.md"), "utf8");
    expect(acceptance.endsWith(acceptanceAsset)).toBe(true);
    cli(["docs", "validate", "--repo", root]);
    expect(existsSync(join(root, "src"))).toBe(false);
    expect(existsSync(join(root, "skills"))).toBe(false);
  } finally { rmSync(root, { recursive: true, force: true }); }
}, 15_000);

(suppliedBinary ? test : test.skip)("installed binary setups, inits, and snapshots from a fake ~/.local/bin", () => {
  const work = mkdtempSync(join(tmpdir(), "forge-installed-"));
  const binDir = join(work, "local", "bin");
  const project = join(work, "project");
  mkdirSync(binDir, { recursive: true });
  mkdirSync(project, { recursive: true });
  const binary = join(binDir, "forge");
  copyFileSync(resolve(suppliedBinary!), binary);
  const isolated = { ...process.env, PATH: "/nonexistent", TMPDIR: work };
  function run(args: string[], env = isolated) {
    const result = spawnSync(binary, args, { cwd: project, env, encoding: "utf8", timeout: 15_000 });
    expect(result.status, result.stderr).toBe(0);
    return JSON.parse(result.stdout);
  }
  try {
    writeFileSync(join(project, "forge.yml"), "loopsPath: ./work-records\n");
    const git = spawnSync("git", ["init", "-q"], { cwd: project, encoding: "utf8" });
    expect(git.status, git.stderr).toBe(0);
    writeFileSync(join(project, "README.md"), "project\n");
    const commit = spawnSync("git", ["-c", "user.name=Test", "-c", "user.email=test@example.com", "add", "README.md"], { cwd: project, encoding: "utf8" });
    expect(commit.status, commit.stderr).toBe(0);
    const committed = spawnSync("git", ["-c", "user.name=Test", "-c", "user.email=test@example.com", "commit", "-qm", "baseline"], { cwd: project, encoding: "utf8" });
    expect(committed.status, committed.stderr).toBe(0);
    const setup = run(["setup", "--pack", pack]);
    expect(setup.tools).toEqual(["agents"]);
    expect(existsSync(join(project, ".agents/skills/forge/SKILL.md"))).toBe(true);
    expect(existsSync(join(project, ".agents/skills/forge-simplify/SKILL.md"))).toBe(true);
    expect(existsSync(resolve(project, ".agents/skills/forge/../../agents/README.md"))).toBe(true);
    run(["init", "standalone", "--title", "Standalone"]);
    const created = run(["docs", "create", "issue", "issue.md", "--title", "issue"]);
    expect(created.status).toBe("draft");
    run(["docs", "validate"]);
    const snapshot = run(["candidate"], { ...isolated, PATH: gitBinaryDir() });
    expect(String(snapshot.candidate)).toMatch(/^git:/);
    expect(readdirSync(binDir)).toEqual(["forge"]);
    expect(existsSync(join(binDir, "skills"))).toBe(false);
    expect(existsSync(join(binDir, "agents"))).toBe(false);
  } finally { rmSync(work, { recursive: true, force: true }); }
}, 20_000);

(suppliedBinary ? test : test.skip)("copied executable keeps selected external loops separate from target files", () => {
  const work = mkdtempSync(join(tmpdir(), "forge-external-cli-"));
  const project = join(work, "project");
  const records = join(work, "records");
  mkdirSync(project);
  const binary = join(work, "forge");
  copyFileSync(resolve(suppliedBinary!), binary);
  writeFileSync(join(project, "forge.yml"), `loopsPath: ${JSON.stringify(records)}\n`);
  function run(args: string[], succeeds = true) {
    const result = spawnSync(binary, args, {
      cwd: project,
      env: { ...process.env, PATH: "/nonexistent", TMPDIR: work },
      encoding: "utf8",
      timeout: 15_000,
    });
    expect(result.status, result.stderr).toBe(succeeds ? 0 : 1);
    return result;
  }
  try {
    for (const loop of ["one", "two"]) {
      run(["init", loop, "--title", loop]);
      run(["docs", "create", "issue", "spec/issue.md", "--loop", loop, "--title", "Issue", "--code", "ISSUE-1"]);
      run(["docs", "validate", "--loop", loop]);
    }
    run(["docs", "update", "spec/issue.md", "--loop", "one", "--set", "status=active"]);
    const one = readFileSync(join(records, "one/spec/issue.md"), "utf8");
    const two = readFileSync(join(records, "two/spec/issue.md"), "utf8");
    expect(one).toContain('status: "active"');
    expect(two).toContain('status: "draft"');
    expect(one).not.toBe(two);
    const entry = join(project, "entry.md");
    writeFileSync(entry, "Compiled CLI appended this entry.\n");
    run(["docs", "append", "log.md", "--loop", "one", "--heading", "CLI proof", "--body-file", entry]);
    expect(readFileSync(join(records, "one/log.md"), "utf8")).toContain("Compiled CLI appended this entry.");
    run(["docs", "update", "spec/issue.md", "--loop", "one", "--set", "code=OTHER"], false);
    run(["docs", "create", "issue", "../outside.md", "--loop", "one", "--title", "Escape"], false);
    expect(existsSync(join(project, "spec"))).toBe(false);
    expect(existsSync(join(project, ".forge/identities.json"))).toBe(false);
    for (const loop of ["one", "two"]) {
      expect(existsSync(join(records, loop, "identities.json"))).toBe(false);
      expect(existsSync(join(records, loop, ".forge/identities.json"))).toBe(false);
    }
  } finally { rmSync(work, { recursive: true, force: true }); }
}, 30_000);
