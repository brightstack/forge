# Build

Build produces one integrated candidate and includes independent Review. It may be
invoked directly from an accepted task; a direct Build stops after its Review
result and never claims Acceptance or Ship.

## Accountable Engineer

One Engineer owns the whole accepted outcome, tactical plan, required Worker
delegation, integration, behavior-preserving simplification, internal review,
evidence, and coherent repair. Read the accepted Spec/ticket, Plan, decisions,
applicable repository harness, current candidate/base, shared seams, and proof
contract. Follow [Launch and workflow preparation](workflows.md): a missing or
unready Issue goes to PM with Engineer input before Build, even at Quick depth.
This does not require a Project Spec. Do not bypass Launch, new intent, or
consequential strategy gates because the user requested implementation.

Before entering a new subtree, framework boundary, or standards domain, resolve
its applicable harness and load only newly relevant rules and exemplars. Include
those rules in delegated packets; neither a familiar pattern nor a persona can
override the target repository's authority.

For UI work, use [design direction and craft](design-direction.md) unless the
target selects a replacement. Apply it within the accepted design; it does not
require a new study for an already specified patch.

Trace the current flow and reuse existing sound machinery. Build the smallest
complete path across every necessary layer. For bugs, load [bug
diagnosis](debug.md), establish a red-capable signal, test hypotheses, fix the
root cause, and retain the original reproduction. For general work, choose the
appropriate creator and proof rather than forcing software files or tests.

Before implementation, the Builder proposes a preservation scope using
[knowledge guidance](knowledge.md): signals, affected accepted obligations,
selected checks, and gaps. Inspect changed and shared package contracts, APIs,
events, data or persistence paths, foundations, removed or renamed files, test
expectation changes, and Spec, decision, or KB edits. Paths narrow discovery;
exported contracts and actual semantics expand it. Keep the proposal proportional
and record it in the Build handoff.

Dispatch Workers under [concrete staffing](workflows.md#concrete-staffing), showing
ownership and sequencing first. Each Worker gets accepted
constraints, seams, source anchors, owned paths, proof, stop conditions, and a
return contract. One writer owns a hot seam; the Builder integrates and tests the
combined result. A Worker return or local green check is not a candidate verdict.

Simplify before independent Review: remove accidental duplication, unused layers,
speculative compatibility, unnecessary configuration, and review-driven
scaffolding while preserving accepted behavior and proof. Clean focused work can
record a justified no-op. Direct “Forge simplify” performs this bounded Build
operation without becoming a lifecycle phase.

Before independent Review, assemble the complete actual candidate diff: code,
tests, early-applied canonical Spec, earned factual knowledge edits, and decision
references that the outcome changed. Supply the retained accepted baseline and
approved delta separately so canonical working bytes do not become their own
authority. Review and Acceptance bind to this same candidate. A document-only
receipt is provenance for the installed target; it is not Build evidence.

## Independent Review and repair

After internal review and required project checks, pin the exact candidate/base
and invoke [Review](review.md) with a separate Reviewer. Record Build, Review,
findings, dispositions, repairs, exact candidate, and the preservation scope in
[build-log.md](../assets/build-log.md). Keep actual Acceptance evidence under `verify/`.
The Reviewer challenges the Builder's scope and the canonical Spec/KB diff when
the candidate carries intent or factual updates.

Admitted P0s and pragmatic P1s return the whole accepted packet to the Builder.
Group symptoms by state owner, lifecycle, or contract and repair the shared cause.
Reassess the complete outcome and affected proof; a changed candidate needs a new
independent verdict. P2 advice never extends the loop. Use the finite rethink and
stop contract in the main skill.

## Completion

Return candidate/base identity, built behavior or deliverable, actual commands and
observations, independent Review verdict, unresolved gaps, and direct-Build
boundary. Review PASS establishes engineering judgment at that candidate, not
runtime acceptance.
