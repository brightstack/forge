# Ponytail light simplification

In delivery, a separate Engineer simplifies the working candidate after the
initial Build/Review loop passes and before Verify. Direct "Forge simplify"
selects only this bounded operation. Load
[Engineer judgment](../../../agents/engineer/instructions.md), the target harness,
[authority](../../forge-shared/references/authority.md),
[pragmatism](../../forge-shared/references/pragmatism.md), and
[returns](../../forge-shared/references/returns.md).

## Scope and actual baseline

Read the accepted outcome, actual complete candidate/base, preservation scope,
current proof, and any actual prior independent Review. In delivery, passing
Build/Review is required before this phase. A direct bounded Simplify request
authorizes inspection and behavior-preserving edits within its accepted scope
without a mandatory pre-edit Review PASS. Inspect the baseline and relevant proof;
record prior Review as present, absent, or stale. Missing prior Review does not
block the requested Craft cleanup and cannot be presented as passing evidence.
Neither path starts a broader Build, QA, or Ship lifecycle.

Compare material promises and restrictions to independently retained intent,
decisions, and the actual grant. A generated Spec or prior Review cannot make an
unsupported addition binding. Return unresolved scope to its owner; do not ratify
it or silently remove behavior the human actually accepted.

Trace the primary flow. Ask whether each new mechanism exists for the current
problem: no change, reuse an existing owner, standard library/native platform,
installed dependency, then small new code. Remove accidental duplication, unused
layers, needless state or configuration, speculative compatibility, and case-by-case
guards whose owner can be simpler. Prefer a coherent root-cause change over a
cosmetic line reduction.

Keep the happy/common path clear and preserve explicit behavior, security, input
validation at real trust boundaries, data-loss prevention, accessibility, and
necessary recovery. Do not redesign unrelated code, erase earned distinctions,
change material data/API contracts, or weaken tests to make work pass. Material
scope choices return to the human; useful P2 advice does not extend the assignment.
Write only assigned paths, without concurrent writers.

## Evidence and handoff

Record the actual baseline, prior Review presence/absence, inspected paths, changes
and why they preserve meaning, resulting complete candidate, affected checks and
actual evidence, and unaffected proof reused with its reason. A justified no-op
names what was inspected and why no simpler route met the outcome; it retains the
unchanged candidate and any actual prior evidence without another verdict. Report
missing prior Review honestly; a no-op does not manufacture a passing verdict.

For changes, run affected proof and obtain independent
[Forge Review](../../forge-review/SKILL.md) before completing the changed operation.
Supply the baseline-to-result diff, accepted authority, preservation scope,
resulting complete candidate, and any actual prior Review and proof. With prior
passing evidence, the Reviewer assesses the delta and affected commitments and
reuses unaffected evidence explicitly. Without it, the Reviewer covers the requested
outcome and affected commitments without assuming prior coverage. In either case,
the independent verdict binds to the resulting whole candidate. A prior verdict
alone or a review detached from the complete result cannot cover changed bytes.
Reuse focused Reviewer context when suitable; do not force a complete restart or
a Judge per dimension outside the staffing triggers. Missing required proof or
Review remains incomplete rather than a completed changed operation. A changed
simplification is complete only after that independent Review passes.

Use the existing [Build log](../../forge-build/assets/build-log.md) or bounded
Work record, following [simplification record guidance](../assets/simplify.md).
The accountable owner inspects the actual return and new relevant log evidence.
Delivery advances to QA only after the resulting candidate has passing Review.
Material failures return to the appropriate Build/Review repair boundary under
[shared finite limits](../../forge-shared/references/repair.md); after repair, reassess simplification proportionately and
reuse unaffected proof. Direct Simplify reports its result and stops; a failure
does not grant broader implementation or delivery authority.
