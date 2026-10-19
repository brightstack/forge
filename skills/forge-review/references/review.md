# Independent Review

Apply [authority](../../forge-shared/references/authority.md), [severity](../../forge-shared/references/severity.md)
and [returns with owner inspection](../../forge-shared/references/returns.md).

Review is independently callable and normally composed inside Build. One separate
Reviewer stays read-only, pins the exact candidate/base, covers applicable
dimensions with required Judge assignments, and owns one integrated verdict. The Reviewer
never edits, delegates repairs, creates requirements, or turns findings into Plan
Issues. Direct Review stops at its report.

## Bind and select

Establish the review purpose and applicable current obligations using the shared
[Reviewer guidance](../../../agents/reviewer/instructions.md). Carry that purpose
to judges with the authority packet: a deferred delta is not automatically a
completion claim, and claimed completion must cover the approved outcome.

Start from the independently retained accepted baseline plus approved delta, their
authority sources, current canonical result, decisions, Plan or bounded assignment,
applicable repository harness, exact candidate/base including dirty state, verified
source anchors, runnable proof, and known gaps. Inspect the actual candidate before
trusting author conclusions, document-only receipts, or earlier PASS labels.
Check the exact source and scope of each material addition, removal, or stronger
guarantee. A question, edited Spec, green check, or earlier Review is not approval.
If an accepted scenario disappeared because its code path appears dead, retain it
as unresolved until a scoped human decision or valid grant covers the removal.
Use [target harness resolution](../../forge-shared/references/target-harness.md) to
read the actual root/nested maps and relevant routed app rules, references,
canonical exemplars, and checks. Capture their actual paths for the assignment.
Re-resolve the harness when a trace enters another subtree or standards domain.

Use [Review judges](judges.md) to select Code Review, Design, Quality, Spec, Craft,
and applicable Security/Performance
and resolve each bundled, replacement, or disabled assignment. Record every
dimension's applicability and selected source. Spec and Craft apply to every
candidate; other dimensions follow the actual outcome. Small work narrows scope
and report size, not required applicable coverage. Standards and proof belong to
each dimension, not additional judges.

## Inspect, delegate, and preserve reports

Choose staffing using [concrete workflow triggers](../../forge-shared/references/workflows.md#concrete-staffing).
The Reviewer inspects undelegated dimensions directly with their selected rubrics.
When Code Review applies, including Quick Review without Judges, read and execute
the selected leaf procedure: by default
[Forge Code Review](../../forge-code-review/SKILL.md). Resolve a user/harness
replacement under [selection](judges.md#selection-replacement-and-disable) first.
The dimension rubric is the route to that leaf, not a substitute for reading it.
For each delegated dimension, use a clean-context read-only native subagent,
blind to peer conclusions. Give it the [Judge contract](../../../agents/judge/instructions.md),
[authority](../../forge-shared/references/authority.md),
[finding admission](../../forge-shared/references/severity.md),
[actual target harness paths](../../forge-shared/references/target-harness.md),
[return/owner inspection contract](../../forge-shared/references/returns.md),
selected skill or rubric, exact candidate/base and paths, accepted authority,
verified anchors, allowed commands/tools, supplied proof, gaps, and stopping boundary.
A delegated Code Review packet names the exact selected leaf path and actual
applicable instruction-map, rule/reference, exemplar, and check paths. The Judge
reads and follows both the selected leaf and those target sources before judgment;
"use Code Review" or "follow repo standards" alone is not a complete assignment.
Code Review stays a leaf and never starts another panel.
Run independent Review Judge assignments in parallel where resources permit;
serialize shared browser use with explicit ownership. This is Review inspection,
not Spec authoring. If nested spawning is unavailable, the host
coordinator dispatches the Reviewer's required assignments. Required delegation,
independence, access, or proof gaps prevent judgment;
never label the Builder's self-review an independent return.

Each judge returns a dimension verdict and its own report: dimension, selected
skill/source, candidate/base and path scope, inspected authority, checks and
observations, findings, and gaps. Use the dimension section in
[the review template](../assets/review.md), or the leaf's report template. The
record-owning coordinator persists each return as a distinct labelled section or
linked managed document through existing CLI mechanics; judges never write records.
Preserve delegated originals beside the Reviewer's disposition. Reviewer-owned
dimensions can use concise evidence-backed table entries or sections in the same
report, sharing the boundary and checks. Identify their owner honestly; do not
invent separate judge reports or duplicate the packet for each dimension. In the
existing selected-source, inspected-authority, and evidence fields, identify the
actual leaf and applicable app standards/checks read and what the observations
support. A source link alone does not establish execution or compliance.

## Integrate and challenge

Actively try to falsify candidate claims, then apply the conservative admission bar
in the judge guidance to every allegation, including replacement-skill returns.
Check authority, candidate binding, real reachability, evidence or causal trace,
material consequence, and severity. No quota, manufactured nits, personal taste,
speculative scale, unrelated debt, or unsupported redesign. Explicit material
standards remain binding. Required proof gaps stay visible and are not invented
defects or inferred success.

Before integration, read each actual returned report and relevant new loop/Build
log entries. Check the selected rubric/template, candidate binding, and cited
check/evidence/result/gap. Request missing required information rather than assume
it ran. Record the inspected return/evidence and disposition in the existing report.

Merge duplicates, route concerns to their owning dimension, and disposition
conflicts from evidence rather than votes. In the existing report, distinguish
supported defects from optional proposals and give concise reasons for received
material feedback rejected or retained as optional. Preserve delegated originals;
do not silently convert their advice into requirements or automatic repair.
Reject a needless mechanism while retaining any supported underlying defect.
Preserve sufficient evidence for every applicable dimension; a passing dimension
cannot conceal a failed one. Check the
managed-artifact contract for accompanying software records without adding Quality.

Use [Craft](judges/craft/rubric.md) to challenge both needless machinery and
missing guards at real present boundaries. A finding is evidence to assess, not
an order to add another layer. Judge whether the existing owner can meet the
accepted result and why a proposed new mechanism is necessary. After a narrowed
scope, reject Review work that serves only the superseded design.

Challenge the Builder's preservation scope using [knowledge guidance](../../forge-shared/references/knowledge.md).
Check signals against real consumers and semantics, name affected and preserved
obligations, and require selected checks plus explicit gaps. Expand beyond paths
for exported contracts or actual behavior; do not demand full-product replay for
a narrow patch. Review actual canonical Spec/KB bytes beside code and tests.
Intended target and observed implementation stay distinct; KB retrieval, receipt
matching, and structural validation cannot prove compliance.

## Verdict and boundary

Use [shared impact-based severity and admission](../../forge-shared/references/severity.md).
A Spec mismatch is not automatically P0; a finding's remedy authority is separate
from its severity. Required missing evidence remains an explicit gap.

Return `PASS`, `REVISE`, `RETHINK`, `READY_FOR_USER`, or `BLOCKED`.
PASS requires no unresolved P0/pragmatic P1 and sufficient current evidence for
all required Review claims. Missing required evidence or independence blocks PASS.
Zero findings is valid. A sound improvement can pass without perfection; optional
advice cannot block completion or extend the loop. Real blockers retain their
severity even when correction needs a human decision.
`REVISE` means supported correction is needed; `RETHINK` means the mechanism needs
reconsideration; `READY_FOR_USER` identifies a consequential intent/authority
choice; `BLOCKED` means required access, evidence, or capability prevents judgment.
Disabled coverage and an explicit scoped human waiver follow the judge guidance;
label exclusions, never imply they passed. Review PASS does not establish Verify.

State the authority status of the intent you judged against. When it carries no
recorded human approval, say so in the boundary and scope the verdict to fidelity
to that draft. Unapproved intent is reported, not escalated: it is not a finding
on its own, and it is not `READY_FOR_USER` when the loop record already shows the
Coordinator routed that gate under a standing grant. Reserve `READY_FOR_USER` for
an intent or authority choice nobody has made yet. This concerns approval status;
routing a draft gate does not adopt material additions outside the actual grant.

On a changed repair candidate, review the complete accepted packet again and
inspect prior dispositions without narrowing to a patch list. Reuse unaffected
proof only with a candidate-bound reason. Record preservation scope, individual
reports, disagreements, and reused or missing evidence in the integrated handoff.
