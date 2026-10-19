import { expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { validate_document_content } from "../src/records.ts";

const behavioral = resolve(import.meta.dir, "../evals/behavioral");
const setup = join(behavioral, "setup_case.ts");
const oracle = join(behavioral, "oracle.ts");
// `evals/` stays in the Bright monorepo and is not copied into the published
// package (see PUBLISH.md), while `tests/` is. A public clone therefore has no
// fixtures to stage, so these cases skip there instead of failing the suite.
const fixtures = test.skipIf(!existsSync(behavioral));
function stage(...args: string[]) {
  return spawnSync("bun", [setup, ...args], { encoding: "utf8" });
}

fixtures("RC1 fixture inventory includes the approval-gated lifecycle", () => {
  expect(readdirSync(behavioral).filter(name => /^rc1-.*-v1$/.test(name)).sort()).toEqual([
    "rc1-bounded-work-v1", "rc1-bug-hypothesis-v1", "rc1-design-study-v1",
    "rc1-findings-authority-v1", "rc1-findings-feedback-v1", "rc1-findings-remedies-v1", "rc1-findings-tactics-v1",
    "rc1-lifecycle-approval-v1",
    "rc1-memory-reconcile-v1", "rc1-project-ui-v1", "rc1-review-repair-v1", "rc1-small-issue-v1",
    "rc1-spec-stop-resume-v1",
  ]);
});

fixtures("staging excludes evaluator and future response, and reveals resume once", () => {
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

fixtures("staging refuses an existing workspace", () => {
  const root = mkdtempSync(join(tmpdir(), "forge-fixture-"));
  try { expect(stage("rc1-bounded-work-v1", root, "--no-git").status).not.toBe(0); }
  finally { rmSync(root, { recursive: true, force: true }); }
});

fixtures("corpus wrappers preserve their roots and the active v2 fixture identity", () => {
  const root = mkdtempSync(join(tmpdir(), "forge-fixture-"));
  try {
    for (const [corpus, names] of [
      ["knowledge-preservation-v1", ["rc1-knowledge-bug-v1", "rc1-knowledge-cross-component-v1", "rc1-knowledge-feature-v1"]],
      ["spec-apply-v1", ["rc1-spec-apply-feature-v1", "rc1-spec-apply-restorative-v1"]],
    ] as const) {
      const script = join(behavioral, corpus, "setup.ts");
      const listed = spawnSync("bun", [script, "--list"], { encoding: "utf8" });
      expect(listed.status).toBe(0);
      expect(listed.stdout.trim().split("\n")).toEqual([...names]);
      const result = spawnSync("bun", [script, names[0], join(root, corpus), "--no-git"], { encoding: "utf8" });
      expect(result.status).toBe(0);
      expect(JSON.parse(result.stdout).case_id).toBe(names[0]);
    }
    const workspace = join(root, "v2"), script = join(behavioral, "spec-apply-v1/rc1-spec-apply-feature-v2/setup.ts");
    const result = spawnSync("bun", [script, workspace], { encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      case_id: "rc1-spec-apply-feature-v2", case_version: "v2",
      fixture_sha256: "a13069dadfbf7126e5f7386d9020f135a4a7dc9fb378a539180de4dc0ed3cc7e",
      public_task_sha256: "ca8a00a928a42fcef8b7b9dc679eac132e0c07b2652cdf8d3f52ce295ab9334f",
    });
    const committed = spawnSync("git", ["show", "HEAD:.eval/fixture.json"], { cwd: workspace, encoding: "utf8" });
    expect(committed.status).toBe(0);
    expect(JSON.parse(committed.stdout).case_version).toBe("v2");
    expect(existsSync(join(workspace, ".eval/resume.md"))).toBe(false);
    expect(spawnSync("bun", [script, workspace, "--reveal-resume"], { encoding: "utf8" }).status).toBe(0);
    expect(spawnSync("bun", [script, workspace, "--reveal-resume"], { encoding: "utf8" }).status).not.toBe(0);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

fixtures("Review corpus preserves sensitive seeds, controls, Git baselines, and packet isolation", () => {
  const result = spawnSync("bun", [join(behavioral, "review-skills-v1/validate.ts")], { encoding: "utf8" });
  expect(result.status).toBe(0);
  const report = JSON.parse(result.stdout);
  expect(report.results).toHaveLength(8);
  expect(report.results[0]).toEqual({
    case: "review-public-input-v1", variant: "candidate", public: "PASS", standards: "PASS", oracle: "EXPECTED_FAIL",
    baseline_commit: "f2617abd0a8d2263a4876570ff23c1727a5a4135",
    diff_sha256: "2731375cd0a3fbaee0ca6dc28be46972bc2efe34f967b848e628f0a07cdac542",
  });
  expect(report.results.filter((result: { variant: string }) => result.variant === "control")
    .every((result: { public: string; standards: string; oracle: string }) => result.public === "PASS" && result.standards === "PASS" && result.oracle === "PASS")).toBe(true);
  expect(report.routing).toBe("NOT RUN");
});

fixtures("Review runtime packages reject evaluator material and symlinks before staging", () => {
  const root = mkdtempSync(join(tmpdir(), "forge-fixture-")), script = join(behavioral, "review-skills-v1/setup.ts");
  try {
    for (const material of ["evaluator.md", "oracle/outcome.js", "review-skills-v1/task.md", "symlink"]) {
      const runtime = join(root, material.replaceAll("/", "-")), workspace = `${runtime}-trial`;
      mkdirSync(runtime);
      if (material === "symlink") symlinkSync(script, join(runtime, "linked.ts"));
      else {
        const parts = material.split("/");
        if (parts.length > 1) mkdirSync(join(runtime, parts[0]!));
        writeFileSync(join(runtime, material), "withheld\n");
      }
      const result = spawnSync("bun", [script, "review-public-input-v1", workspace, "--runtime-package", runtime, "--runtime-label", "arm"], { encoding: "utf8" });
      expect(result.status).not.toBe(0);
      expect(existsSync(workspace)).toBe(false);
    }
  } finally { rmSync(root, { recursive: true, force: true }); }
});

fixtures("approval-gate oracle rejects untracked implementation files", () => {
  const root = mkdtempSync(join(tmpdir(), "forge-fixture-")), workspace = join(root, "trial");
  try {
    expect(stage("rc1-lifecycle-approval-v1", workspace).status).toBe(0);
    writeFileSync(join(workspace, "unapproved.css"), "body { display: none; }\n");
    const result = spawnSync("bun", [oracle, "rc1-lifecycle-approval-v1", workspace, "--mode", "candidate"], { encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("unapproved.css");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

fixtures("RC1 oracles accept sensitive seeds and reject their unrepaired candidates", () => {
  const root = mkdtempSync(join(tmpdir(), "forge-fixture-"));
  try {
    for (const caseId of ["rc1-small-issue-v1", "rc1-bug-hypothesis-v1", "rc1-review-repair-v1"]) {
      const workspace = join(root, caseId);
      expect(stage(caseId, workspace, "--no-git").status).toBe(0);
      expect(spawnSync("bun", [oracle, caseId, workspace, "--mode", "seed"], { encoding: "utf8" }).status).toBe(0);
      expect(spawnSync("bun", [oracle, caseId, workspace, "--mode", "candidate"], { encoding: "utf8" }).status).toBe(1);
    }
  } finally { rmSync(root, { recursive: true, force: true }); }
});

fixtures("memory oracle validates canonical knowledge and exercises preserved identity and meaning", () => {
  const root = mkdtempSync(join(tmpdir(), "forge-fixture-")), workspace = join(root, "trial"), caseId = "rc1-memory-reconcile-v1";
  function check(mode = "candidate") {
    return spawnSync("bun", [oracle, caseId, workspace, "--mode", mode], { encoding: "utf8" });
  }
  try {
    expect(stage(caseId, workspace, "--no-git").status).toBe(0);
    expect(check("seed").status).toBe(0);
    expect(check().stderr).toContain("approved replacement did not retain explicit decision history");
    const decision = join(workspace, "docs/knowledge/decisions/task-retention.md");
    const superseded = `${readFileSync(decision, "utf8")}\nSuperseded with the approved replacement.\n`;
    writeFileSync(decision, superseded);
    expect(check().status).toBe(0);
    writeFileSync(decision, superseded.replace("code: TASK-RETENTION", "code: TASK-RETENTION-CHANGED"));
    expect(check().stderr).toContain("decision changed immutable code");
    writeFileSync(decision, superseded);
    const spec = join(workspace, "docs/specs/tasks/SPEC.md");
    writeFileSync(spec, readFileSync(spec, "utf8").replace("A person can add a task with a non-empty description and see it immediately.", ""));
    expect(check().stderr).toContain("unaffected accepted add-task meaning was not preserved");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

fixtures("managed fixture documents validate under the current metadata contract", () => {
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
