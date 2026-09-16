# Build 002 - Fallback agent runtime plan

## Outcome

Implement the provider-neutral, standard-library fallback process lifecycle in
`forge/agents.py`, with deterministic tests in `tests/test_agents.py`. Native
subagents remain Forge's primary runtime; this module reports process facts only.

## Approach

1. Define small public `start`, `status`, `wait`, and `stop` operations around a
   caller-supplied command. Validate agent names, working directories, result
   paths, and command input before launch.
2. Pass the pointer assignment to the child through standard input, redirect
   stdout and stderr to transient diagnostic files, and persist only minimum
   process metadata beneath `${TMPDIR}/forge-agents-<uid>/`.
3. Track the exact child process group, record terminal exit facts after an
   observed wait, reject duplicate or unknown relaunches, preserve honest
   `unknown` status when liveness cannot be established, and stop only that
   recorded process group.
4. Exercise start, running and terminal states, timeout, stop, duplicate names,
   missing state, result-path reporting, invalid input, and absence of persisted
   pointer text with local fake subprocess commands.

## Checks

Run `python3 -m unittest apps/forge/tests/test_agents.py` from the repository
root, then inspect the owned diff and record the exact result in `result.md`.

## Boundaries

- Own only `forge/agents.py`, `tests/test_agents.py`, and this Build's plan and
  result files.
- Add no provider adapters, messaging emulation, daemon, lease, recovery service,
  repository state, or semantic workflow decisions.
