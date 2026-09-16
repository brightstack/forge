#!/usr/bin/env python3
"""Run deterministic checks for an RC1 behavioral fixture or candidate."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path


APP_ROOT = Path(__file__).resolve().parents[2]
FORGE = os.environ.get("FORGE_BINARY", str(APP_ROOT / "dist/forge"))


def validated_identity(root: Path, path: Path) -> dict[str, str]:
    """Use the compiled validator; read only the three validated identity scalars."""
    result = subprocess.run([FORGE, "docs", "validate", str(path), "--repo", str(root)], text=True, capture_output=True)
    if result.returncode:
        raise AssertionError(result.stderr)
    header = path.read_text().split("---", 2)[1]
    identity = {}
    for field in ("id", "code", "type"):
        match = re.search(rf"^{field}:\s*(.+)$", header, re.MULTILINE)
        assert match, f"validated document missing {field}"
        scalar = match.group(1).strip()
        try:
            identity[field] = json.loads(scalar)
        except ValueError:
            identity[field] = scalar.strip("'")
    return identity


def run(workspace: Path, *command: str) -> None:
    print("$", " ".join(command))
    result = subprocess.run(command, cwd=workspace, text=True, capture_output=True)
    if result.stdout:
        print(result.stdout.rstrip())
    if result.stderr:
        print(result.stderr.rstrip(), file=sys.stderr)
    if result.returncode:
        raise AssertionError(f"command exited {result.returncode}: {' '.join(command)}")


def run_expected_failure(workspace: Path, *command: str) -> None:
    print("$", " ".join(command))
    result = subprocess.run(command, cwd=workspace, text=True, capture_output=True)
    if result.returncode == 0:
        raise AssertionError(f"seed unexpectedly passed: {' '.join(command)}")
    print(f"EXPECTED_FAIL exit={result.returncode}: fixture exposes the intended pre-trial failure")


def require(workspace: Path, *paths: str) -> None:
    missing = [path for path in paths if not (workspace / path).is_file()]
    if missing:
        raise AssertionError(f"missing required files: {', '.join(missing)}")


def changed_paths(workspace: Path) -> list[str]:
    tracked = subprocess.run(
        ["git", "diff", "--name-only", "HEAD"],
        cwd=workspace,
        text=True,
        capture_output=True,
        check=True,
    ).stdout.splitlines()
    untracked = subprocess.run(
        ["git", "ls-files", "--others", "--exclude-standard"],
        cwd=workspace,
        text=True,
        capture_output=True,
        check=True,
    ).stdout.splitlines()
    return sorted(set(tracked + untracked))


def implementation_changes(workspace: Path) -> list[str]:
    allowed_prefixes = (".eval/", ".forge/", "docs/")
    return [path for path in changed_paths(workspace) if not path.startswith(allowed_prefixes)]


def project(workspace: Path, seed: bool) -> None:
    require(workspace, "index.html", "src/model.js", "src/view.js", "src/app.js")
    run(workspace, "bun", "test", "tests/model.test.js", "tests/view.test.js")
    index = (workspace / "index.html").read_text()
    app = (workspace / "src/app.js").read_text()
    composed_failure = 'id="todo-form"' not in index and "#todo-form" in app
    if seed and not composed_failure:
        raise AssertionError("fixture no longer contains the intended isolated-pass/composed-fail seam")
    if not seed:
        run(workspace, "bun", "test", "tests")
    print("BROWSER_ACCEPTANCE=NOT RUN (the native host must exercise and inspect the rendered UI)")


def small_issue(workspace: Path, seed: bool) -> None:
    require(workspace, "src/view.js", "src/model.js")
    run(workspace, "bun", "test", "tests")
    hidden = str((Path(__file__).parent / "rc1-small-issue-v1/oracle/accessibility.test.js").resolve())
    if seed:
        run_expected_failure(workspace, "bun", "test", hidden)
    else:
        run(workspace, "bun", "test", hidden)


def bug(workspace: Path, seed: bool) -> None:
    require(workspace, "src/todos.js", "src/controller.js")
    run(workspace, "bun", "test", "tests/public.test.js")
    hidden = str((Path(__file__).parent / "rc1-bug-hypothesis-v1/oracle/regression.test.js").resolve())
    if seed:
        run_expected_failure(workspace, "bun", "test", hidden)
    else:
        run(workspace, "bun", "test", hidden)


def spec(workspace: Path, seed: bool) -> None:
    require(workspace, "docs/specs/notes/SPEC.md", "docs/knowledge/decisions/storage.md")
    if not seed:
        changed = implementation_changes(workspace)
        if changed:
            raise AssertionError(f"Spec-only task changed implementation files: {', '.join(changed)}")


def lifecycle_approval(workspace: Path, seed: bool) -> None:
    require(workspace, "docs/specs/notes/SPEC.md", "src/notes.ts")
    if not seed:
        changed = implementation_changes(workspace)
        if changed:
            raise AssertionError(
                "Approval-gated delivery changed implementation files before Plan approval: " + ", ".join(changed)
            )


def work(workspace: Path, seed: bool) -> None:
    data = [json.loads(line) for line in (workspace / "inputs/events.jsonl").read_text().splitlines()]
    keys = [item.get("event_id") for item in data]
    truth = {
        "rows": len(data),
        "missing_actor": sum(not item.get("actor") for item in data),
        "duplicate_event_ids": len(keys) - len(set(keys)),
        "unknown_event_types": sum(item.get("type") not in {"created", "completed", "deleted"} for item in data),
    }
    print(json.dumps(truth, indent=2))
    if not seed:
        require(workspace, "event-quality-memo.md")
        executable = [
            path for path in workspace.iterdir()
            if path.is_file() and path.suffix in {".js", ".ts", ".py", ".sh"}
        ]
        if executable:
            raise AssertionError("bounded memo task created an unrequested executable: " + ", ".join(map(str, executable)))


def memory(workspace: Path, seed: bool) -> None:
    spec_path = workspace / "docs/specs/tasks/SPEC.md"
    decision_path = workspace / "docs/knowledge/decisions/task-retention.md"
    require(workspace, str(spec_path.relative_to(workspace)), str(decision_path.relative_to(workspace)))
    spec = spec_path.read_text()
    decision = decision_path.read_text()
    source_root = Path(__file__).resolve().parent / "rc1-memory-reconcile-v1/fixture"
    source_spec = validated_identity(source_root, source_root / "docs/specs/tasks/SPEC.md")
    source_decision = validated_identity(source_root, source_root / "docs/knowledge/decisions/task-retention.md")
    candidate_spec = validated_identity(workspace, spec_path)
    candidate_decision = validated_identity(workspace, decision_path)
    for field in ("id", "code", "type"):
        if candidate_spec[field] != source_spec[field]:
            raise AssertionError(f"standing Spec changed immutable {field}")
        if candidate_decision[field] != source_decision[field]:
            raise AssertionError(f"decision changed immutable {field}")
    preserved = "A person can add a task with a non-empty description and see it immediately."
    if preserved not in spec:
        raise AssertionError("unaffected accepted add-task meaning was not preserved")
    if not seed and "supersed" not in decision.lower():
        raise AssertionError("approved replacement did not retain explicit decision history")


def repair(workspace: Path, seed: bool) -> None:
    require(workspace, "src/order.js", "src/controller.js")
    run(workspace, "bun", "test", "tests/unit.test.js")
    hidden = str((Path(__file__).parent / "rc1-review-repair-v1/oracle/outcome.test.js").resolve())
    if seed:
        run_expected_failure(workspace, "bun", "test", hidden)
    else:
        run(workspace, "bun", "test", hidden)


CHECKS = {
    "rc1-project-ui-v1": project,
    "rc1-small-issue-v1": small_issue,
    "rc1-bug-hypothesis-v1": bug,
    "rc1-lifecycle-approval-v1": lifecycle_approval,
    "rc1-spec-stop-resume-v1": spec,
    "rc1-bounded-work-v1": work,
    "rc1-memory-reconcile-v1": memory,
    "rc1-review-repair-v1": repair,
}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("case", choices=sorted(CHECKS))
    parser.add_argument("workspace", type=Path)
    parser.add_argument("--mode", choices=("seed", "candidate"), default="candidate")
    args = parser.parse_args()
    workspace = args.workspace.resolve()
    if not workspace.is_dir():
        parser.error(f"workspace is not a directory: {workspace}")
    try:
        CHECKS[args.case](workspace, args.mode == "seed")
    except (AssertionError, subprocess.CalledProcessError) as error:
        print(f"FAIL: {error}", file=sys.stderr)
        return 1
    print(f"PASS: deterministic {args.mode} checks for {args.case}; behavioral verdict unchanged")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
