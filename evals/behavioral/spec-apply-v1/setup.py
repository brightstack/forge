#!/usr/bin/env python3
"""Reuse the existing behavioral case stager with this bounded corpus."""
import importlib.util
import sys
from pathlib import Path

sys.dont_write_bytecode = True
root = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("forge_case_setup", root.parent / "setup_case.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.ROOT = root
if __name__ == "__main__":
    raise SystemExit(module.main())
