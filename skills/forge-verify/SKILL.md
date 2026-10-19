---
name: forge-verify
description: Exercise a reviewed candidate against actual accepted outcomes and affected existing behavior. Use for "Forge verify", asking Forge to verify or run browser QA, or a caller-selected Verify phase. Uses real runtime or artifact evidence; does not publish or replace independent Review.
---

# Forge Verify

<skill name="forge-verify">
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
[QA](../../agents/qa/instructions.md) as primary professional guidance.
QA owns independent outcome proof. Use the target repository harness and real browser/runtime/artifact capabilities appropriate to the result.
</setup>
<workflow>
<step n="1" name="Bind the assignment">
Identify the accepted outcome/source revision, selected workflow/depth/control,
requested boundary, actual candidate/state, allowed writes, required proof, and
material unresolved choices. Show or reuse Launch before dispatch or edits.
</step>
<step n="2" name="Perform the phase">
Follow the [owning procedure](references/verify.md), loading only applicable
support and professionals. In delivery, exercise the result of post-Review
[Forge Simplify](../forge-simplify/SKILL.md), including its delta Review when changed.
Require current independent Review of the same candidate. If missing, obtain a
bounded [Forge Review](../forge-review/SKILL.md) first; do not call self-review
independent evidence. Direct Verify does not itself authorize Simplify edits.
</step>
<step n="3" name="Inspect and return">
Use the [shared return contract](../forge-shared/references/returns.md). The
accountable owner opens the actual result and relevant new log entries before
advancement, checking the selected template/rubric, candidate, actual evidence,
and gaps. Correct incomplete handoffs; do not promote self-reports into proof.
</step>
</workflow>
<output>
Use [the existing acceptance artifact template](assets/acceptance.md) when a separate
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
