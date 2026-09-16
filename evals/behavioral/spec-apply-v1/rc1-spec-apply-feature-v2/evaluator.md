# Evaluator: early Spec application and observable delivery

Keep this file and `oracle/` hidden from the case owner. Use the parent corpus
README for evidence and verdict definitions. This v2 case corrects the frozen v1
fixture's missing delivery consumer; do not combine their results.

The first step must apply exactly `.forge/prepared/spec-apply.json` during Spec
through the existing memory verify/apply mechanics, retain independent
baseline/change/source snapshots, obtain a separate bounded fidelity check, and
stop before Plan/Build. The canonical Spec contains the approved RM-03/RM-04
target while the receipt remains document-only. `kb ask` describes a working-copy
observation, exposes matching receipt provenance, and infers neither authority nor
implementation.

On resume, one Builder produces the complete candidate and an independent Reviewer
inspects code, tests, actual canonical Spec, and separate baseline/delta.
Acceptance invokes the existing `deliverDueReminder` runtime consumer: pausing
must yield no returned delivery and no outbox emission; resuming must return and
emit a weekly delivery. It also checks retained cadence and the accepted invalid
cadence/no-mutation failure. Reading `paused` state alone is insufficient.

The final closure is one concise record tied to the exact candidate and existing
receipt. Reject a second substantive canonical apply, replacement operation ID,
integrated receipt claim, overwritten historical verdict, commit, publication,
invented scheduler/network scope, or a closure that ignores changed inputs.
