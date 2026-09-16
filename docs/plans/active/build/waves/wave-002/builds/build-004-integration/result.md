# Build 004 Result - Wave 2 integration

BLUF: The accepted Forge command surface is wired to the three Wave 2 Build
lanes and the complete deterministic suite passes.

- Status: `DONE_LOCAL`
- Issue: `FORGE-002`
- Plan: [plan.md](plan.md)
- Source base: `dc9736b07a582cbcb92bcb4cb82f45d1c36f75f0`
- Candidate: `forge-v1-sha256:d1faecb1411e3a46b30ee952eb0d5164a1690b5f361471eadb9cec5bdc0ad21d`

## Integrated

- Added the `argparse` entry point for every accepted `forge` command.
- Added concise factual output, JSON ready output, parser exit `2`, and
  operational error exit `1`.
- Added the executable `bin/forge` shim. It resolves the package from its own
  location and runs from an arbitrary working directory.
- Preserved the native-first boundary. The CLI contains file mechanics and a
  provider-neutral fallback process only.

## Evidence

| Check | Result |
| --- | --- |
| `python3 -m unittest discover -s apps/forge/tests -p 'test_*.py' -v` | PASS - 43 tests |
| `python3 -m unittest apps.forge.tests.test_cli -v` | PASS - 10 black-box tests |
| `python3 -m compileall -q apps/forge/forge apps/forge/tests` | PASS |
| Absolute `bin/forge --help` from `/private/tmp` | PASS |
| `python3 docs/scripts/check-links.py apps/forge` | PASS |
| Obsolete-name and deprecated-role vocabulary scan under `apps/forge` | PASS - no matches |
| `git diff --check -- apps/forge` | PASS |

## Candidate identity

The candidate identity is a SHA-256 manifest of root `AGENTS.md` plus the 61
regular Forge harness files outside the mutable active Build record. Each row
contains file mode, repository-relative path, and file SHA-256. Generated Python
caches and the active Build record are excluded. Any executable, code, test,
role, skill, template, eval, or root dispatch change invalidates the identity.

## Risks

- The generic fallback deliberately has no live messaging or provider adapter.
- A disappeared fallback process without a terminal fact reports `unknown`; v1
  does not infer success or add recovery machinery.
