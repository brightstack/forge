#!/usr/bin/env python3
"""Validate frozen Review-skills seeds and controls without running reviewers."""

from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent
sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location("review_skills_setup", ROOT / "setup.py")
setup = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(setup)


EXPECTED = {
    "review-public-input-v1": {"candidate_oracle": 1, "candidate_standards": 0},
    "review-standard-boundary-v1": {"candidate_oracle": 1, "candidate_standards": 1},
    "review-spec-preservation-v1": {"candidate_oracle": 1, "candidate_standards": 0},
    "review-clean-equivalent-v1": {"candidate_oracle": 0, "candidate_standards": 0},
}


def run(workspace: Path, *command: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(command, cwd=workspace, text=True, capture_output=True)


def assert_public_boundary(workspace: Path) -> None:
    public_files = {
        path.relative_to(workspace / ".eval").as_posix()
        for path in (workspace / ".eval").rglob("*")
        if path.is_file()
    }
    assert public_files == {"fixture.json", "task.md"}, public_files
    assert not any(workspace.rglob("evaluator.md"))
    assert not any(path.name == "oracle" for path in workspace.rglob("oracle"))


def main() -> int:
    results: list[dict[str, object]] = []
    with tempfile.TemporaryDirectory(prefix="forge-review-skills-v1-") as temp:
        temp_root = Path(temp)
        for case_id, expected in EXPECTED.items():
            for variant in ("candidate", "control"):
                workspace = temp_root / f"{case_id}-{variant}"
                manifest = setup.stage(case_id, workspace, variant, None, None)
                assert_public_boundary(workspace)
                public = run(workspace, "bun", "run", "test")
                if public.returncode:
                    raise AssertionError(f"{case_id} {variant} public test failed:\n{public.stderr}")
                standards = run(workspace, "bun", "run", "standards")
                expected_standards = expected["candidate_standards"] if variant == "candidate" else 0
                if (standards.returncode != 0) != bool(expected_standards):
                    raise AssertionError(
                        f"{case_id} {variant} standards exit {standards.returncode}, expected {expected_standards}"
                    )
                oracle_path = ROOT / "cases" / case_id / "oracle/outcome.test.js"
                oracle = run(workspace, "bun", "test", str(oracle_path))
                expected_oracle = expected["candidate_oracle"] if variant == "candidate" else 0
                if (oracle.returncode != 0) != bool(expected_oracle):
                    raise AssertionError(
                        f"{case_id} {variant} oracle exit {oracle.returncode}, expected {expected_oracle}"
                    )
                results.append(
                    {
                        "case": case_id,
                        "variant": variant,
                        "baseline_commit": manifest["baseline_commit"],
                        "diff_sha256": manifest["candidate_diff_sha256"],
                        "public": "PASS",
                        "standards": "EXPECTED_FAIL" if standards.returncode else "PASS",
                        "oracle": "EXPECTED_FAIL" if oracle.returncode else "PASS",
                    }
                )

        for case_id in sorted(setup.case_paths()):
            if case_id in EXPECTED:
                continue
            workspace = temp_root / case_id
            setup.stage(case_id, workspace, "candidate", None, None)
            assert_public_boundary(workspace)
            assert run(workspace, "git", "diff", "--quiet", "HEAD").returncode == 1, (
                f"{case_id}: changed candidate must be visible to Git"
            )

    print(json.dumps({"corpus": "review-skills-v1", "results": results, "routing": "NOT RUN"}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
