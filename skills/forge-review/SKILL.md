---
name: forge-review
description: Judge an exact integrated candidate against accepted intent, applicable engineering/design/quality/security/performance risks, and pragmatic craft. Use for "Forge review", PR review, local Forge loop review, or code/branch/diff review selected through Forge. Read-only; direct Review ends at its report. Explicit standalone code-only review uses forge-code-review instead.
---

# Forge Review

<skill name="forge-review">
<activation>
Run this phase only when explicitly invoked through Forge, selected by the caller,
or reached by an authorized Forge lifecycle. Ordinary unselected requests do not
activate portable Forge.
Reuse accepted Launch/authority on resume. Stop at this phase's boundary; an
installed machine name is not evidence of native slash-command support.
An explicitly requested standalone code-only review or `forge-code-review` selects
the [Code Review leaf](../forge-code-review/SKILL.md) directly and stops there.
</activation>
<setup>
Run `forge context` from where you started, without `--repo` and without changing
directory, and read every file it lists before anything else. Use the Target it
prints as `--repo` for later forge commands.
If `forge` is missing or doesn't know `context`, follow the fallback in
[target harness resolution](../../references/target-harness.md#resolve-applicable-authority-progressively).
Then read [authority](../../references/authority.md),
[target harness resolution](../../references/target-harness.md), and [Launch and gates](../../references/workflows.md). Adopt
[Reviewer](../../agents/reviewer/instructions.md) as primary professional guidance.
Reviewer owns dimension coverage and the integrated verdict. Focused Judges remain read-only helpers; their findings cannot create scope.
</setup>
<workflow>
<step n="1" name="Bind the assignment">
Identify the accepted outcome/source revision, selected workflow/depth/control,
requested boundary, actual candidate/state, allowed writes, required proof, and
material unresolved choices. A direct bounded read-only Review request authorizes
inspection and its prepared report: briefly state scope, team and boundary, then
proceed under the shared direct-Review Launch exception. Preserve existing
consequential intent/authority gates; do not ask permission again for the requested
review. Other lifecycle entries show or reuse their accepted Launch.
</step>
<step n="2" name="Perform the phase">
Select one entry by the requested review target and read only its reference:

- Pull request, including a PR backed by a Forge loop: [PR review](references/pr-review.md).
- Local Forge loop or its integrated candidate: [local loop review](references/local-loop-review.md).
- Code, branch, commit, or diff without a PR/loop: [standalone review](references/standalone-review.md).

The selected entry supplies intake and reporting; all use the same
[owning procedure](references/review.md), loading only applicable
support and professionals. Select and load the actual [judge rubrics](references/judges.md),
including practical Security/Performance where applicable. When Code Review applies,
the Reviewer directly reads and follows the selected [Code Review leaf](../forge-code-review/SKILL.md)
or passes that exact selected path to a required delegated Judge. Both read the
actual applicable target app standards and check paths. Record the selected source
and inspected standards/evidence in the existing report; preserve delegated
originals and inspect their evidence before disposition.
</step>
<step n="3" name="Inspect and return">
Use the [shared return contract](../../references/returns.md). The
accountable owner opens the actual result and relevant new log entries before
advancement, checking the selected template/rubric, candidate, actual evidence,
and gaps. Correct incomplete handoffs; do not promote self-reports into proof.
</step>
</workflow>
<output>
For a PR, return the concise [PR-facing report](assets/pr-review.md) first, scaled
to the actual change. Retain detailed integrated evidence and original judge
returns separately in existing records; link them only when accessible to the
reader. Do not paste the internal packet into the PR-facing report.
Use [the existing review artifact template](assets/review.md) when a separate
artifact is earned; otherwise record its applicable information in the existing
Issue/log. Preserve actual results, findings and remedy authority, evidence limits,
and the direct-phase stopping boundary.
</output>
<checklist>
- Requested phase, authority, Launch, and applicable target harness resolved.
- Owning procedure/template and applicable professional instructions loaded.
- Shared pragmatic severity and scope rules applied to findings and remedies.
- Actual result, required independent return, and relevant new log evidence inspected.
- Unsupported checks remain incomplete; next phase/publication is not implied.
</checklist>
</skill>
