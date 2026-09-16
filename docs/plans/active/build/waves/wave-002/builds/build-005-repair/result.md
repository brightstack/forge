# Wave 2 Repair Build Result

BLUF: All three admitted Wave 2 findings are repaired in one batch, and the
complete deterministic Forge suite passes.

- Status: `DONE_LOCAL`
- Issue: `FORGE-002`
- Plan: [plan.md](plan.md)
- Review: [Wave 2 Review](../../review.md)
- Source base: `7b163418e8f8d5c0ff8fae74a24faeab287ac38e`
- Candidate: `forge-v1-sha256:b74fb43356cdded4dc324de5b72779bbd67815628c36be0cff416a5bdc701b36`

## Repaired

- `W002-F001`: an append without an explicit library root now discovers and
  validates an enclosing initialized Forge run before opening the target for
  mutation. The accepted CLI is unchanged, and an external ordinary file is
  rejected without modification.
- `W002-F002`: a closed Wave now requires its direct `review.md` to record either
  an initial PASS or a resolved closure PASS for the same candidate. Final Verify
  must reference exactly the direct passing Review reports for the selected
  closed Waves and cannot run while a selected Wave remains open.
- `W002-F003`: Forge no longer creates child stdout or stderr logs. Child output
  is discarded, so even a child that echoes stdin cannot place pointer bytes in
  Forge-controlled transient records. Exit, result, stop, and launch-error facts
  remain available.

## Evidence

| Check | Result |
| --- | --- |
| `python3 -m unittest discover -s apps/forge/tests -p 'test_*.py' -v` | PASS - 49 tests |
| `python3 -m unittest apps.forge.tests.test_cli -v` | PASS - 12 black-box tests |
| `python3 -m compileall -q apps/forge/forge apps/forge/tests` | PASS |
| Absolute `bin/forge --help` from `/private/tmp` | PASS |
| `python3 docs/scripts/check-links.py apps/forge` | PASS |
| `git diff --check -- AGENTS.md apps/forge` | PASS |
| Obsolete-name and deprecated-role vocabulary scan under `apps/forge` | PASS - no matches outside the immutable Review evidence |
| Candidate manifest reconstruction | PASS - the prior algorithm reproduced `d1faecb...`; the 62-file repaired manifest is `b74fb433...` |

The focused regressions reproduce all three Review triggers: external append,
closed Wave without Review / Final Verify without its passed Review, and an
echoing fallback child. Each now fails safely or leaves no pointer bytes in
Forge-controlled state as required.

## Deviations and risks

- No accepted artifact, CLI signature, provider boundary, or semantic workflow
  decision changed.
- Fallback commands must persist useful output in their assigned result artifact;
  Forge deliberately retains no child stdout or stderr diagnostics.
- Independent targeted closure remains owned by the original Wave Reviewer.
