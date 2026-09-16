#!/usr/bin/env python3
"""Stage one Forge behavioral case without exposing its evaluator bundle."""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parent


def case_paths() -> dict[str, Path]:
    return {
        path.name: path
        for path in sorted(ROOT.glob("rc1-*-v1"))
        if path.is_dir() and (path / "task.md").is_file() and (path / "evaluator.md").is_file()
    }


def digest_tree(root: Path) -> str:
    digest = hashlib.sha256()
    for path in sorted(candidate for candidate in root.rglob("*") if candidate.is_file()):
        digest.update(path.relative_to(root).as_posix().encode())
        digest.update(b"\0")
        digest.update(path.read_bytes())
        digest.update(b"\0")
    return digest.hexdigest()


def run_git(workspace: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", *args], cwd=workspace, check=True, text=True, capture_output=True
    )
    return result.stdout.strip()


def stage(case_id: str, destination: Path, initialize_git: bool) -> dict[str, str]:
    cases = case_paths()
    if case_id not in cases:
        raise ValueError(f"unknown case {case_id!r}; choose one of: {', '.join(cases)}")
    if destination.exists():
        raise FileExistsError(f"destination already exists: {destination}")

    source = cases[case_id]
    fixture = source / "fixture"
    if not fixture.is_dir():
        raise ValueError(f"case has no fixture directory: {case_id}")

    shutil.copytree(fixture, destination)
    public = destination / ".eval"
    public.mkdir()
    shutil.copy2(source / "task.md", public / "task.md")
    manifest = {
        "case_id": case_id,
        "case_version": "v1",
        "fixture_sha256": digest_tree(fixture),
        "public_task_sha256": hashlib.sha256((source / "task.md").read_bytes()).hexdigest(),
        "resume_available": (source / "resume.md").is_file(),
        "behavioral_status": "NOT RUN",
    }
    (public / "fixture.json").write_text(json.dumps(manifest, indent=2) + "\n")

    base = "unversioned"
    if initialize_git:
        run_git(destination, "init", "-q")
        run_git(destination, "config", "user.name", "Forge Eval Fixture")
        run_git(destination, "config", "user.email", "forge-eval@example.invalid")
        run_git(destination, "add", ".")
        run_git(destination, "commit", "-q", "-m", f"fixture: {case_id}")
        base = run_git(destination, "rev-parse", "HEAD")

    return {**manifest, "workspace": str(destination.resolve()), "base": base}


def reveal_resume(case_id: str, destination: Path) -> dict[str, str]:
    cases = case_paths()
    if case_id not in cases:
        raise ValueError(f"unknown case {case_id!r}; choose one of: {', '.join(cases)}")
    source = cases[case_id] / "resume.md"
    if not source.is_file():
        raise ValueError(f"case has no resume step: {case_id}")
    manifest_path = destination / ".eval/fixture.json"
    if not manifest_path.is_file():
        raise ValueError(f"destination is not a staged case: {destination}")
    manifest = json.loads(manifest_path.read_text())
    if manifest.get("case_id") != case_id:
        raise ValueError(f"staged case is {manifest.get('case_id')!r}, not {case_id!r}")
    target = destination / ".eval/resume.md"
    if target.exists():
        raise FileExistsError(f"resume step already revealed: {target}")
    shutil.copy2(source, target)
    return {
        "case_id": case_id,
        "workspace": str(destination.resolve()),
        "resume": str(target.resolve()),
        "resume_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("case", nargs="?", help="case directory name")
    parser.add_argument("destination", nargs="?", type=Path, help="new workspace path")
    parser.add_argument("--list", action="store_true", help="list available cases")
    parser.add_argument("--no-git", action="store_true", help="do not create the baseline commit")
    parser.add_argument("--reveal-resume", action="store_true", help="stage the human resume input after step one")
    args = parser.parse_args()

    if args.list:
        print("\n".join(case_paths()))
        return 0
    if not args.case or not args.destination:
        parser.error("case and destination are required unless --list is used")

    try:
        result = (
            reveal_resume(args.case, args.destination)
            if args.reveal_resume
            else stage(args.case, args.destination, not args.no_git)
        )
    except (FileExistsError, ValueError, subprocess.CalledProcessError) as error:
        parser.error(str(error))
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
