# Build 003 Result - CLI fixtures

BLUF: The route fixtures and black-box CLI suite are complete; CLI execution is
blocked until integration adds `bin/forge` and `forge/__main__.py`.

- Status: `BLOCKED`
- Issue: `FORGE-002`
- Plan: `plan.md`
- Source: shared Wave 2 worktree, uncommitted Builder result
- Blocker owner: Wave 2 integration Builder

## Built

- Added six self-consistent route fixtures covering research-only, direct change,
  Bug, two-Wave Project, guided and Auto control, a named Auto terminal, and an
  unauthorized release boundary.
- Added ten subprocess tests for the accepted `forge` commands: minimal init,
  append, Issue movement and readiness, artifact and loop checks, candidate
  mismatch, CLI errors, and fallback agent lifecycle.
- Kept semantic judging in `evals/`; these tests assert file and command behavior,
  not instruction wording.

## Evidence

| Contract | Command | Result |
| --- | --- | --- |
| Route fixture consistency | `python3 -m unittest apps.forge.tests.test_routes -v` | PASS - 6 tests |
| Python syntax | `python3 -m py_compile apps/forge/tests/test_cli.py apps/forge/tests/test_routes.py` | PASS |
| Black-box CLI | `python3 -m unittest apps.forge.tests.test_cli -v` | BLOCKED - 10 tests reach the missing `apps/forge/bin/forge`; every failure reports `[Errno 2] No such file or directory` |

## Integration notes

- Run the complete test command after wiring `bin/forge` and
  `forge/__main__.py`.
- `issue ready --json` can return either a JSON list or an object with a `ready`
  list. Each item can be an Issue ID or an object with an `id` field.
- Domain failures use exit code 1. Argument parser failures use exit code 2.
- `append` reads its body from stdin. `agent start` forwards stdin to the child.

## Deviations

- None. The missing executable belongs to the planned integration step, not this
  Builder's owned paths.
