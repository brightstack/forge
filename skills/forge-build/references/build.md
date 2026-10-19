# Build

Apply [authority](../../forge-shared/references/authority.md), [pragmatism](../../forge-shared/references/pragmatism.md), [repair](../../forge-shared/references/repair.md)
and [returns with owner inspection](../../forge-shared/references/returns.md).

Build produces one integrated candidate and includes independent Review. It may be
invoked directly from an accepted task; a direct Build stops after its Review
result. Separate Simplify, Verify, and Ship require their own authority.

## Accountable Engineer

One Engineer owns the whole accepted outcome, tactical plan, required Worker
delegation, integration, internal review,
evidence, and coherent repair. Read the accepted Spec/ticket, Plan, decisions,
applicable repository harness, current candidate/base, shared seams, and proof
contract. Follow [Launch and workflow preparation](../../forge-shared/references/workflows.md): a missing or
unready Issue goes to PM first, then Engineer assessment, before Build, even at
Quick depth.
This does not require a Project Spec. Do not bypass Launch, new intent, or
consequential strategy gates because the user requested implementation.

Before entering a new subtree, framework boundary, or standards domain, resolve
its applicable harness and load only newly relevant rules and exemplars. Include
those rules in delegated packets; neither a familiar pattern nor a persona can
override the target repository's authority.

For UI work, use [design direction and craft](../../forge-shared/references/design-direction.md) unless the
target selects a replacement. Apply it within the accepted design; it does not
require a new study for an already specified patch.

Trace the current flow and reuse existing sound machinery. Build the smallest
complete path across every necessary layer. For bugs, load [bug
diagnosis](debug.md), establish a red-capable signal, test hypotheses, fix the
root cause, and retain the original reproduction. For general work, choose the
appropriate creator and proof rather than forcing software files or tests.
Check no-change and existing-owner routes before adding a new mechanism. Apply
the [shared pragmatism](../../forge-shared/references/pragmatism.md) test to new state, caches, parsers, classes,
and contracts; a present trust, data-loss, accessibility, or recovery boundary can
earn a guard on its first demonstrated failure. An apparently dead code path does
not erase its accepted scenario. If a simpler scope supersedes planned machinery,
drop its dependent side quests and reassess depth and staffing.

Before implementation, the Builder proposes a preservation scope using
[knowledge guidance](../../forge-shared/references/knowledge.md): signals, affected accepted obligations,
selected checks, and gaps. Inspect changed and shared package contracts, APIs,
events, data or persistence paths, foundations, removed or renamed files, test
expectation changes, and Spec, decision, or KB edits. Paths narrow discovery;
exported contracts and actual semantics expand it. Keep the proposal proportional
and record it in the Build handoff.

Dispatch Workers under [concrete staffing](../../forge-shared/references/workflows.md#concrete-staffing), showing
ownership and sequencing first. Each Worker gets accepted
constraints, seams, source anchors, owned paths, proof, stop conditions, and the actual [target harness paths](../../forge-shared/references/target-harness.md) and
[return contract](../../forge-shared/references/returns.md) paths to load. One writer owns a hot seam; the Builder integrates and tests the
combined result. A Worker return or local green check is not a candidate verdict.

Before independent Review, assemble the complete actual candidate diff: code,
tests, any directly applied canonical Spec, earned factual knowledge edits, and decision
references that the outcome changed. Supply the retained accepted baseline and
approved delta separately so canonical working bytes do not become their own
authority. Review binds to this complete candidate; after authorized Simplify,
Review and Verify bind to the resulting candidate. A document-only
receipt is provenance for the installed target; it is not Build evidence.

## Independent Review and repair

After internal review and required project checks, pin the exact candidate/base
and invoke [Review](../../forge-review/references/review.md) with a separate Reviewer. Record Build, Review,
findings, dispositions, repairs, exact candidate, and the preservation scope in
[build-log.md](../assets/build-log.md). Keep actual Verify evidence under `verify/`.
The Reviewer challenges the Builder's scope and the canonical Spec/KB diff when
the candidate carries intent or factual updates.

Before repair, apply the shared [owner defect/remedy check](../../forge-shared/references/repair.md)
and record the disposition in the existing Review/Build log. A supported defect
does not authorize the reviewer's mechanism; choose the smallest sound in-scope
correction, or hold the affected boundary for a necessary out-of-scope decision.
Only authorized corrections of admitted P0s and pragmatic P1s return the whole
accepted packet to the Builder for automatic repair.
Group symptoms by state owner, lifecycle, or contract and repair the shared cause.
Reassess the complete outcome and affected proof; a changed candidate needs a new
independent verdict. P2 advice never extends the loop. Use the finite rethink and
[stop contract](../../forge-shared/references/repair.md).
If repeated repairs to the same mechanism do not converge, revisit its owner and
invariant at the existing RETHINK boundary rather than growing case-by-case guards.

## Completion

Return candidate/base identity, built behavior or deliverable, actual commands and
observations, independent Review verdict, unresolved gaps, and direct-Build
boundary. In authorized delivery, passing Build/Review hands off to a separate
[Forge Simplify](../../forge-simplify/SKILL.md) assignment before QA. Direct Build
stops here. Review PASS establishes engineering judgment at that candidate, not
runtime acceptance.
