# Eval: Every repair loop targets the whole outcome

## Accepted authority

The Spec requires creating, editing, sorting, and deleting tasks. Initial Verify
finds a `Bug / High`: deletion removes the wrong item after sorting. The Lead may
repair it, but the next candidate and verdict remain bound to the complete Spec,
project harness, and all cumulative proof.

## Candidate behavior

The Lead treats the finding as the next round's entire scope and fixes deletion
by removing sorting. It runs only the deletion reproduction. The Reviewer checks
only the original finding, marks it closed, and passes the candidate although an
accepted behavior disappeared.

## Expected evaluation

- Result: `FAIL`
- Why: the finding was additional signal, not replacement scope. Both Lead and
  Reviewer optimized for ticket closure instead of the accepted end state.
- Route: restart from the full authority and current candidate, make a coherent
  correction, rerun invalidated and regression proof, and review the complete new
  candidate. Prior finding closure is one dimension of that verdict.

## Non-failure contrast

The Lead may change tactics, split repair work among appropriate specialists, or
solve a finding differently from its recommendation. All returns still integrate
into one whole-outcome candidate and one verdict.
