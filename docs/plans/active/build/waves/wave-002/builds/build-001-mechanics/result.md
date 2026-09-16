# Build result: build-001-mechanics - Forge file mechanics

Forge now initializes minimal authority records, appends shared Markdown records
safely, moves and schedules Issues from file facts, and validates artifact and
candidate consistency without making semantic decisions.

- Status: `DONE_LOCAL`
- Issues: `FORGE-002` under the active Issue board
- Plan: [plan.md](plan.md)
- Source: `codex/agent-loop-sdlc-vnext` at base
  `dc9736b07a582cbcb92bcb4cb82f45d1c36f75f0`; uncommitted owned files in the
  shared Forge worktree
- Environment: Python 3 standard library on macOS

## Built

- Minimal guided or Auto initialization with explicit authority, terminal, and
  permitted external-action facts.
- Exclusive locked append with exact duplicate-heading rejection and durable
  flush.
- Stable Markdown Issue parsing, directory-owned status, legal atomic movement,
  evidence and containment checks, and symlink rejection.
- Dependency inventory, missing-ID and cycle detection, and factual planned
  readiness after dependencies reach `verify` or `ship`.
- Artifact and loop checks for structural fields, unique Issue state, Wave status,
  and exact Wave, Review, Final Verify, and release candidate consistency.

## Evidence

| Contract | Command or artifact | Result |
| --- | --- | --- |
| Records and Auto fields | `python3 -m unittest discover -s apps/forge/tests -p 'test_records.py'` | PASS - 5 tests |
| Issue moves, path safety, dependencies, and readiness | `python3 -m unittest discover -s apps/forge/tests -p 'test_issues.py'` | PASS - 9 tests |
| Artifact, status, and candidate consistency | `python3 -m unittest discover -s apps/forge/tests -p 'test_validation.py'` | PASS - 5 tests |
| Python syntax | `python3 -m compileall -q apps/forge/forge apps/forge/tests` | PASS |
| Owned diff hygiene | `git diff --check -- apps/forge/forge apps/forge/tests/test_records.py apps/forge/tests/test_issues.py apps/forge/tests/test_validation.py apps/forge/docs/plans/active/build/waves/wave-002/builds/build-001-mechanics` | PASS |

## Deviations or blockers

- The complete `test_*.py` discovery attempt reached 10 black-box CLI failures
  because the integration-owned `apps/forge/bin/forge` did not exist yet. The 19
  owned mechanics tests passed separately. Integration must rerun the complete
  suite after wiring the entry point.

## Integration notes

- Public functions are `records.init_loop`, `records.append_record`,
  `issues.move_issue`, `issues.ready_issues`, `validation.validate_artifact`, and
  `validation.validate_loop`. Contract errors raise `ForgeError`.
- Ready output is a sorted list of dictionaries with `id`, `status`, `path`, and
  `dependencies`. Mechanics create a destination state directory only when a
  legal Issue move first needs it.
