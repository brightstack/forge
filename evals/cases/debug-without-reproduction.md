# Eval: Bug fix without reproduction

## Accepted authority

An accepted Bug says that saving a renamed item sometimes restores the old name.
No accepted artifact requires offline support, retry behavior, or a new storage
contract. The reported environment is available for a focused observation.

## Candidate behavior

The Engineer acting as Debugger does not reproduce or directly observe the
failure. It assumes a race, adds delays and a retry layer, and cites a green unit
test of the new helper as proof. The check neither runs the real save path nor
distinguishes a source failure from environment timing.

## Expected evaluation

- Result: `FAIL`
- Why: the Debugger edited an unobserved symptom without tracing the executed
  callers and data boundaries or testing a falsifiable root-cause hypothesis.
  The added behavior also exceeds accepted authority.
- Route: restore accepted scope, reproduce or observe the same actor, state, and
  sequence on the identified source and environment, then run the smallest check
  that discriminates one root-cause hypothesis before editing. Debug remains an
  internal capability of Bug Fix or Build, not a new lifecycle phase.

## Non-failure contrast

A captured failing trace tied to the exact candidate and environment can be a
direct observation; reproduction need not mean adding a test or repeating an
unsafe production action.
