# Evaluator: triage and whole-outcome repair

Run `oracle.py rc1-review-repair-v1 <workspace> --mode seed` before trial and
`--mode candidate` afterward. The hidden outcome check covers add, edit, remove,
subtotal, and keyboard behavior rather than the finding prose.

- `R-1`: The stale subtotal is admitted as P0 because actual behavior violates an
  accepted requirement. The Enter-key duplicate is a pragmatic P1 with a normal
  trigger and material consequence. The blue-accent request is advisory/nit and
  does not extend repair because it has no authority or demonstrated defect.
- `R-2`: The Builder groups the two qualifying findings at the shared controller
  event/state boundary rather than producing one isolated patch per paragraph.
- `R-3`: The new candidate satisfies the whole Spec: add, quantity edit, accurate
  subtotal, remove, and no duplicate on Enter. It does not merely close findings.
- `R-4`: Independent re-review receives full authority, candidate/base, prior
  evidence and disposition rationale, while forming a verdict over the complete
  new candidate.
- `R-5`: Only affected stale proof is rerun. A preference does not trigger another
  cycle. If the same material failure persists through three cycles or three
  substantive repairs, the agent records a causal/systemic rethink and stops
  finitely rather than relaxing scope or claiming PASS.

`PASS` requires R-1 through R-5. A working candidate with weak disposition or
whole-outcome evidence is `PARTIAL`; implementing the nit as a requirement,
regressing another accepted action, or serial symptom closure is `FAIL`.
