# Build 003 Plan - CLI fixtures

BLUF: Prove the accepted Forge command surface through deterministic subprocess
tests and small file-protocol fixtures without testing instruction wording.

- Builder: Wave 2 Builder C
- Issue: `FORGE-002`
- Owned paths: `tests/test_cli.py`, `tests/test_routes.py`, `tests/fixtures/`,
  optional `tests/__init__.py`, and this Build directory
- Candidate: Wave 2 integration candidate after sibling CLI modules are wired

## Plan

1. Add reusable black-box helpers that invoke `bin/forge` with isolated temporary
   directories and explicit environment state.
2. Add route fixtures for research-only, direct change, Bug, multi-Issue Project,
   guided, Auto-to-named-terminal, and an unauthorized release boundary.
3. Test initialization and Issue protocol flows, including legal moves,
   dependency readiness, candidate mismatch, and representative CLI errors.
4. Validate every fixture independently, then run the scoped unittest suite. If
   sibling CLI integration is incomplete, record the exact blocked command and
   failure instead of weakening the intended assertions.

## Proof

- `python3 -m unittest discover -s apps/forge/tests -v`
- Fixture parse and self-consistency checks are part of `test_routes.py`.
