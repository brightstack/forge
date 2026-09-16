#!/usr/bin/env python3
"""Stage one frozen Review-skills case with one assigned runtime package."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parent
FIXED_GIT_ENV = {
    "GIT_AUTHOR_DATE": "2026-09-10T00:00:00Z",
    "GIT_COMMITTER_DATE": "2026-09-10T00:00:00Z",
}


def digest_tree(root: Path, excluded_top: frozenset[str] = frozenset()) -> str:
    digest = hashlib.sha256()
    for path in sorted(
        item
        for item in root.rglob("*")
        if item.is_file() and item.relative_to(root).parts[0] not in excluded_top
    ):
        digest.update(path.relative_to(root).as_posix().encode())
        digest.update(b"\0")
        digest.update(path.read_bytes())
        digest.update(b"\0")
    return digest.hexdigest()


def case_paths() -> dict[str, Path]:
    paths = list((ROOT / "cases").glob("*-v1")) + list((ROOT / "routing").glob("*-v1"))
    return {
        path.name: path
        for path in sorted(paths)
        if (path / "task.md").is_file()
        and (path / "evaluator.md").is_file()
        and (path / "baseline").is_dir()
        and (path / "candidate").is_dir()
    }


def run_git(workspace: Path, *args: str, fixed_time: bool = False) -> str:
    env = os.environ.copy()
    if fixed_time:
        env.update(FIXED_GIT_ENV)
    result = subprocess.run(
        ["git", *args], cwd=workspace, check=True, text=True, capture_output=True, env=env
    )
    return result.stdout.strip()


def copy_overlay(source: Path, destination: Path) -> None:
    # Preserve modes, not source timestamps: Git must notice same-size overlays.
    shutil.copytree(source, destination, dirs_exist_ok=True, copy_function=shutil.copy)


def validate_runtime_package(runtime_package: Path) -> None:
    for path in runtime_package.rglob("*"):
        if path.is_symlink():
            raise ValueError(f"runtime package contains a symlink: {path}")
        relative = path.relative_to(runtime_package)
        if path.name == "evaluator.md" or "oracle" in relative.parts or "review-skills-v1" in relative.parts:
            raise ValueError(f"runtime package exposes evaluator material: {path}")


def stage(
    case_id: str,
    destination: Path,
    variant: str,
    runtime_package: Path | None,
    runtime_label: str | None,
) -> dict[str, object]:
    cases = case_paths()
    if case_id not in cases:
        raise ValueError(f"unknown case {case_id!r}; choose one of: {', '.join(cases)}")
    if destination.exists():
        raise FileExistsError(f"destination already exists: {destination}")

    source = cases[case_id]
    overlay = source / variant
    if not overlay.is_dir():
        raise ValueError(f"case {case_id!r} has no {variant!r} variant")
    if (runtime_package is None) != (runtime_label is None):
        raise ValueError("--runtime-package and --runtime-label must be supplied together")
    if runtime_package is not None and not runtime_package.is_dir():
        raise ValueError(f"runtime package is not a directory: {runtime_package}")
    if runtime_package is not None:
        validate_runtime_package(runtime_package)

    shutil.copytree(source / "baseline", destination)
    run_git(destination, "init", "-q")
    run_git(destination, "config", "user.name", "Forge Review Eval")
    run_git(destination, "config", "user.email", "forge-review-eval@example.invalid")
    run_git(destination, "add", ".")
    run_git(destination, "commit", "-q", "-m", f"fixture: {case_id} baseline", fixed_time=True)
    base = run_git(destination, "rev-parse", "HEAD")
    base_tree = run_git(destination, "rev-parse", "HEAD^{tree}")

    copy_overlay(overlay, destination)
    candidate_diff = run_git(destination, "diff", "--binary", "HEAD")
    candidate_tree = digest_tree(destination, frozenset({".git", ".eval"}))

    public = destination / ".eval"
    public.mkdir()
    shutil.copy2(source / "task.md", public / "task.md")
    exclude = destination / ".git/info/exclude"
    exclude.write_text(exclude.read_text() + "\n.eval/\n")

    runtime = None
    if runtime_package is not None:
        runtime = public / "runtime" / runtime_label
        shutil.copytree(runtime_package, runtime)

    manifest: dict[str, object] = {
        "corpus": "review-skills-v1",
        "case_id": case_id,
        "case_version": "v1",
        "variant": variant,
        "baseline_commit": base,
        "baseline_tree": base_tree,
        "baseline_source_sha256": digest_tree(source / "baseline"),
        "variant_source_sha256": digest_tree(overlay),
        "candidate_tree_sha256": candidate_tree,
        "candidate_diff_sha256": hashlib.sha256(candidate_diff.encode()).hexdigest(),
        "public_task_sha256": hashlib.sha256((source / "task.md").read_bytes()).hexdigest(),
        "runtime_label": runtime_label,
        "runtime_sha256": digest_tree(runtime) if runtime is not None else None,
        "behavioral_status": "NOT RUN",
    }
    (public / "fixture.json").write_text(json.dumps(manifest, indent=2) + "\n")
    return {**manifest, "workspace": str(destination.resolve())}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("case", nargs="?", help="frozen case ID")
    parser.add_argument("destination", nargs="?", type=Path, help="new isolated workspace")
    parser.add_argument("--list", action="store_true", help="list frozen case IDs")
    parser.add_argument("--variant", choices=("candidate", "control"), default="candidate")
    parser.add_argument("--runtime-package", type=Path, help="runtime package copied into the packet")
    parser.add_argument("--runtime-label", help="opaque arm label recorded in the manifest")
    args = parser.parse_args()

    if args.list:
        print("\n".join(case_paths()))
        return 0
    if not args.case or not args.destination:
        parser.error("case and destination are required unless --list is used")
    try:
        result = stage(
            args.case,
            args.destination,
            args.variant,
            args.runtime_package.resolve() if args.runtime_package else None,
            args.runtime_label,
        )
    except (FileExistsError, ValueError, subprocess.CalledProcessError) as error:
        parser.error(str(error))
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
