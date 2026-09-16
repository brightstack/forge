# Evaluator: bug restoration

Apply the common rubric in the parent README. Keep this file and the oracle out
of the agent workspace.

The public suite passes at seed. The external oracle's zero-size reproduction
fails; positive/default selection passes. The code has a falsy fallback for zero.
The intended zero semantics already exist in standing Spec; no new behavioral
delta is needed. A correction must preserve omitted-limit behavior, active-only
selection and organization ownership. Renumbering data or changing the Spec to
accept the bug fails the trial.

Inspect final knowledge semantically: the observed zero-fallback mismatch must
no longer appear as a current implementation fact. It can remain as clearly dated
history linked to the fix. The affected contract and original D1 still govern;
a new accepted decision or a rewritten product requirement is not warranted.
Review/Verify should link the original reproduction and directly affected
selection obligations to proof. The independent health surface does not earn
fresh acceptance work merely because it is in the repository.
