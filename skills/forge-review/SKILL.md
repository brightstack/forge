---
name: forge-review
description: Judge an exact integrated candidate against accepted intent, applicable engineering/design/quality/security/performance risks, and pragmatic craft. Use for "Forge review", asking Forge to review a candidate, or a caller-selected integrated Review phase. Read-only; direct Review ends at its report and never repairs or starts Verify.
---

# Forge Review

<skill name="forge-review">
<activation>
Run this phase only when explicitly invoked through Forge, selected by the caller,
or reached by an authorized Forge lifecycle. Ordinary unselected requests do not
activate portable Forge.
Reuse accepted Launch/authority on resume. Stop at this phase's boundary; an
installed machine name is not evidence of native slash-command support.
</activation>
<setup>
Read [authority](../forge-shared/references/authority.md) and
[target harness resolution](../forge-shared/references/target-harness.md), [Launch and gates](../forge-shared/references/workflows.md),
and the target repository's applicable root/nested harness. Adopt
[Reviewer](../../agents/reviewer/instructions.md) as primary professional guidance.
Reviewer owns dimension coverage and the integrated verdict. Focused Judges remain read-only helpers; their findings cannot create scope.
</setup>
<workflow>
<step n="1" name="Bind the assignment">
Identify the accepted outcome/source revision, selected workflow/depth/control,
requested boundary, actual candidate/state, allowed writes, required proof, and
material unresolved choices. Show or reuse Launch before dispatch or edits.
</step>
<step n="2" name="Perform the phase">
Follow the [owning procedure](references/review.md), loading only applicable
support and professionals. Select and load the actual [judge rubrics](references/judges.md),
including practical Security/Performance where applicable. When Code Review applies,
the Reviewer directly reads and follows the selected [Code Review leaf](../forge-code-review/SKILL.md)
or passes that exact selected path to a required delegated Judge. Both read the
actual applicable target app standards and check paths. Record the selected source
and inspected standards/evidence in the existing report; preserve delegated
originals and inspect their evidence before disposition.
</step>
<step n="3" name="Inspect and return">
Use the [shared return contract](../forge-shared/references/returns.md). The
accountable owner opens the actual result and relevant new log entries before
advancement, checking the selected template/rubric, candidate, actual evidence,
and gaps. Correct incomplete handoffs; do not promote self-reports into proof.
</step>
</workflow>
<output>
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
