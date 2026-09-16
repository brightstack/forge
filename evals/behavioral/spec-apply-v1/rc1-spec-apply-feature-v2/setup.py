#!/usr/bin/env python3
"""Stage this v2 case through the shared behavioral stager."""
from __future__ import annotations

import argparse
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
CASE_ID = "rc1-spec-apply-feature-v2"
ROOT = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("forge_case_setup", ROOT.parent.parent / "setup_case.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.case_paths = lambda: {CASE_ID: ROOT}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--no-git", action="store_true")
    parser.add_argument("--reveal-resume", action="store_true")
    args = parser.parse_args()
    if args.reveal_resume:
        result = module.reveal_resume(CASE_ID, args.destination)
    else:
        result = module.stage(CASE_ID, args.destination, not args.no_git)
        manifest_path = args.destination / ".eval/fixture.json"
        manifest = json.loads(manifest_path.read_text())
        manifest["case_version"] = "v2"
        manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
        result["case_version"] = "v2"
        if not args.no_git:
            module.run_git(args.destination, "add", ".eval/fixture.json")
            module.run_git(args.destination, "commit", "-q", "--amend", "--no-edit")
            result["base"] = module.run_git(args.destination, "rev-parse", "HEAD")
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
