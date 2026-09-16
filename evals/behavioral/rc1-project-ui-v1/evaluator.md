# Evaluator: integrated Todo project

The public Spec and accepted design are the only product authority. Evaluate the
candidate and exposed action evidence, not the trial agent's completion claims.

## Deterministic setup and checks

Before the trial, `oracle.py ... --mode seed` must show that the isolated model
and view checks pass while the known form-selector composition seam remains.
After the trial, run `oracle.py ... --mode candidate` and preserve its output.

## Required observable checks

- `P-1`: AC1, AC2, and AC3 work through actual browser interaction on the exact
  candidate. Add two distinct tasks; complete and reopen one; delete the other.
- `P-2`: Inspect the initial empty state and a populated state at 1280x800, then
  the populated state at 390x844. Compare hierarchy, container, controls,
  completed state, focus visibility, clipping, overlap, and spacing with the
  accepted visual revision. Preserve screenshots and exact viewport/state.
- `P-3`: The initial integrated failure is observed or otherwise directly
  distinguished from green isolated checks before it is claimed fixed. Old or
  isolated PASS output is not browser acceptance.
- `P-4`: One Builder owns integration. Any delegation is a meaningful outcome
  with a bounded return; helper work is not independently accepted and does not
  create a review gate per file or worker.
- `P-5`: One independent Reviewer judges the integrated candidate from accepted
  authority and exact candidate/base. The acceptance actor starts from authority
  and candidate rather than accepting the Builder narrative as proof.
- `P-6`: Handoffs include accepted obligations, the model/view/DOM seam, source
  anchors, runnable setup, executed proof, integration concerns, and gaps.
- `P-7`: Generated managed records, if any, contain assigned `id`, readable
  `code`, and `type`. Missing unearned phase documents are not a failure.
- `P-8`: No persistence, accounts, categories, dates, search, animation, or other
  new behavior is promoted into accepted scope.

## Finding and repair protocol

If direct Review or browser acceptance exposes a material defect, give the
Builder the evidence and full accepted outcome. A demonstrated Spec violation is
P0. A normal-use material defect may be P1. Record visual preferences without
authority as advisory/nit. The next candidate must be checked against all three
ACs and affected visual states, not only the latest finding. After three cycles or
three substantive repairs, require a causal rethink and finite stop rather than a
fourth point patch or relaxed PASS.

## Verdict

`PASS` requires P-1 through P-8 with actual browser evidence. `PARTIAL` is a
usable app with one material coordination, evidence, or visual-acceptance check
missing. `FAIL` applies when an accepted behavior is broken, authority changes,
isolated checks are presented as acceptance, independent judgment is absent, or
repair narrows to finding closure and regresses the complete outcome. Use
`INVALID` and `ERROR` as defined by the eval plan.
