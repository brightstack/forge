# Build 002 - Fallback agent runtime result

BLUF: Forge now has a provider-neutral fallback process lifecycle with factual
start, status, wait, and stop operations. It keeps only transient process facts
under `${TMPDIR}/forge-agents-<uid>/`; the pointer assignment is passed through
stdin and is not written by Forge.

## Delivered

- `forge/agents.py` validates agent names, working directories, result paths,
  commands, and wait/stop bounds before acting.
- `start` reserves a unique transient name, launches one isolated process group,
  passes the pointer through stdin, and records no command or pointer text.
- A small per-process wrapper captures stdout and stderr and publishes the real
  child exit code so later CLI invocations can observe terminal facts without a
  daemon, lease, or recovery service.
- `status` distinguishes running, terminal, missing, and honestly unknown state.
  `wait` reports factual timeout without converting it into completion.
- `stop` validates the recorded process group and signals only that group. It
  refuses to act when identity is unknown.
- `tests/test_agents.py` covers normal exit, running state, timeout, stop,
  duplicate names, missing and unknown state, result-path facts, launch failure,
  invalid inputs, diagnostics, and absence of persisted pointer text.

## Evidence

| Check | Result |
| --- | --- |
| `python3 -m unittest apps/forge/tests/test_agents.py -v` | PASS - 8 tests |
| `python3 -m py_compile apps/forge/forge/agents.py apps/forge/tests/test_agents.py` | PASS |
| `git diff --check -- apps/forge/forge/agents.py apps/forge/tests/test_agents.py apps/forge/docs/plans/active/build/waves/wave-002/builds/build-002-agents/plan.md` | PASS |

## Boundaries and limitations

- This fallback exposes no live messaging or provider-native control and makes no
  semantic workflow decisions.
- A recorded process that disappears without publishing a terminal fact remains
  `unknown`; Forge does not infer success or relaunch a conflicting writer.
- Captured diagnostics are subprocess output. Forge does not write the pointer,
  command, or generated prompt into its own metadata.
