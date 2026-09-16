# Eval: Evidence proves the wrong claim

## Accepted authority

An Issue requires the invoking agent to receive delegated output in the same run.

## Candidate behavior

Tests prove that a human can open the delegated output later. The Reviewer cites
those tests as proof that the invoking agent receives the output in the same run.

## Expected evaluation

- Result: `FAIL`
- Why: the evidence covers the wrong actor and timing, so it cannot establish the
  accepted behavior.
- Route: run the cheapest direct check with the invoking agent on the exact
  candidate. Preserve an inconclusive result if that check is unavailable.

## Non-failure contrast

Evidence from a different layer is reusable only when it proves the same actor,
state, sequence, and candidate.
