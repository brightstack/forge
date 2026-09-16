import { expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { validate_document_content } from "../src/records.ts";

const behavioral = resolve(import.meta.dir, "../evals/behavioral");
const setup = join(behavioral, "setup_case.py");
const oracle = join(behavioral, "oracle.py");
function stage(...args: string[]) {
  return spawnSync("python3", [setup, ...args], { encoding: "utf8" });
}

test("RC1 fixture inventory includes the approval-gated lifecycle", () => {
  expect(readdirSync(behavioral).filter(name => /^rc1-.*-v1$/.test(name)).sort()).toEqual([
    "rc1-bounded-work-v1", "rc1-bug-hypothesis-v1", "rc1-design-study-v1", "rc1-lifecycle-approval-v1",
    "rc1-memory-reconcile-v1", "rc1-project-ui-v1", "rc1-review-repair-v1", "rc1-small-issue-v1",
    "rc1-spec-stop-resume-v1",
  ]);
});

test("staging excludes evaluator and future response, and reveals resume once", () => {
  const root = mkdtempSync(join(tmpdir(), "forge-fixture-")), workspace = join(root, "trial");
  try {
    const staged = stage("rc1-memory-reconcile-v1", workspace, "--no-git");
    expect(staged.status).toBe(0);
    expect(JSON.parse(staged.stdout).behavioral_status).toBe("NOT RUN");
    expect(JSON.parse(readFileSync(join(workspace, ".eval/fixture.json"), "utf8")).case_id).toBe("rc1-memory-reconcile-v1");
    for (const absent of ["evaluator.md", "oracle", ".eval/resume.md"]) expect(existsSync(join(workspace, absent))).toBe(false);
    expect(stage("rc1-memory-reconcile-v1", workspace, "--reveal-resume").status).toBe(0);
    expect(existsSync(join(workspace, ".eval/resume.md"))).toBe(true);
    expect(stage("rc1-memory-reconcile-v1", workspace, "--reveal-resume").status).not.toBe(0);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("staging refuses an existing workspace", () => {
  const root = mkdtempSync(join(tmpdir(), "forge-fixture-"));
  try { expect(stage("rc1-bounded-work-v1", root, "--no-git").status).not.toBe(0); }
  finally { rmSync(root, { recursive: true, force: true }); }
});

test("approval-gate oracle rejects untracked implementation files", () => {
  const root = mkdtempSync(join(tmpdir(), "forge-fixture-")), workspace = join(root, "trial");
  try {
    expect(stage("rc1-lifecycle-approval-v1", workspace).status).toBe(0);
    writeFileSync(join(workspace, "unapproved.css"), "body { display: none; }\n");
    const result = spawnSync("python3", [oracle, "rc1-lifecycle-approval-v1", workspace, "--mode", "candidate"], { encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("unapproved.css");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("managed fixture documents validate under the current metadata contract", () => {
  for (const relative of [
    "rc1-project-ui-v1/fixture/authority/design.md",
    "rc1-review-repair-v1/fixture/authority/spec.md",
    "rc1-lifecycle-approval-v1/fixture/docs/specs/notes/SPEC.md",
    "rc1-spec-stop-resume-v1/fixture/docs/specs/notes/SPEC.md",
    "rc1-spec-stop-resume-v1/fixture/docs/knowledge/decisions/storage.md",
    "rc1-memory-reconcile-v1/fixture/proposal.md",
    "rc1-memory-reconcile-v1/fixture/docs/specs/tasks/SPEC.md",
    "rc1-memory-reconcile-v1/fixture/docs/knowledge/decisions/task-retention.md",
  ]) expect(() => validate_document_content(readFileSync(join(behavioral, relative), "utf8"))).not.toThrow();
});
