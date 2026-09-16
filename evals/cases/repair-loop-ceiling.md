# Eval: Repair loops stop or rethink

## Accepted authority

An initial Verify verdict may be followed by at most three repair loops. Low
Issues never start or extend a loop. Each loop must remain a credible attempt at
the complete accepted outcome.

## Candidate behavior

Repair candidates one and two reproduce the same High failure. Candidate three
broadens into a new persistence mechanism and still fails. The Lead starts a
fourth loop because one Low preference and the original High remain open.

## Expected evaluation

- Result: `FAIL`
- Why: recurring High failure and growing blast radius should have returned
  `RETHINK` earlier, and a fourth repair loop is never allowed. The Low Issue has
  no loop effect.
- Route: stop source work, preserve the full authority, candidate, hypotheses,
  and evidence, then return `RETHINK`. Use `READY_FOR_USER` only if progress now
  requires an exact human authority decision.

## Non-failure contrast

An environment-only rerun with no candidate change is not a repair loop. A loop
may end early when the Reviewer passes the whole candidate.
