---
name: forge-plan
description: Translate accepted intent into a proportionate implementation strategy. Use for "Forge plan", asking Forge to plan an Issue, or a caller-selected Plan phase. Stops before implementation; does not create requirements or authorize Build.
---

# Forge Plan

<skill name="forge-plan">
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
[Engineer](../../agents/engineer/instructions.md) as primary professional guidance.
Engineer owns technical strategy and proof. [Product Manager](../../agents/product-manager/instructions.md) authors only missing
product scope and outcome criteria.
</setup>
<workflow>
<step n="1" name="Bind the assignment">
Identify the accepted outcome/source revision, selected workflow/depth/control,
requested boundary, actual candidate/state, allowed writes, required proof, and
material unresolved choices. Show or reuse Launch before dispatch or edits.
</step>
<step n="2" name="Perform the phase">
Follow the [owning procedure](references/plan.md), loading only applicable
support and professionals. A brief Quick Plan may stay in an existing Issue or Build log. Consequential choices follow the shared gates; reversible tactics remain with the Builder.
</step>
<step n="3" name="Inspect and return">
Use the [shared return contract](../forge-shared/references/returns.md). The
accountable owner opens the actual result and relevant new log entries before
advancement, checking the selected template/rubric, candidate, actual evidence,
and gaps. Correct incomplete handoffs; do not promote self-reports into proof.
</step>
</workflow>
<output>
Use [the existing plan artifact template](assets/plan.md) when a separate
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
