# Eval: Missing authority-chain coverage

## Accepted authority

Product Spec AC2 requires users to recover an accidentally removed draft. The
Design Spec defines an undo action and its time-visible feedback. The Technical
Spec requires an existing reversible-delete contract because the Design constraint
depends on it.

## Candidate behavior

Plan creates Issues for create, edit, and delete. No Issue owns the undo outcome,
reversible-delete contract, or credible proof for AC2. Plan Review passes because
every listed Issue has tests.

## Expected evaluation

- Result: `FAIL`
- Why: local Issue completeness does not cover the forward chain from accepted
  obligation through Design and Technical Specs into delivery ownership and proof.
- Route: correct the Plan package and Issues to cover the accepted chain. Do not
  weaken the accepted Spec bundle to match an incomplete Plan.

## Non-failure contrast

An accepted obligation may bypass Design or Technical Spec when neither is
needed; it still needs an Issue owner and credible proof.
