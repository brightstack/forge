---
name: forge-spec
description: Define product, experience, and contract intent using deliberate Project or Issue templates. Use for "Forge spec", asking Forge to specify or scope a feature, or a caller-selected Spec phase. Produces a proposal and boundary check; does not authorize Build, canonical Spec writes, or publication.
---

# Forge Spec

<skill name="forge-spec">
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
[Product Manager](../../agents/product-manager/instructions.md) as primary professional guidance.
Product Manager owns product intent. Use Engineer for Bug diagnosis, Designer for triggered experience, Architect for triggered contracts, and Researcher for missing external evidence; sequence dependent authors.
Load the triggered [Designer](../../agents/designer/instructions.md),
[Architect](../../agents/architect/instructions.md),
[Engineer](../../agents/engineer/instructions.md), or
[Researcher](../../agents/researcher/instructions.md) guidance before assignment;
[Reviewer](../../agents/reviewer/instructions.md) owns the separate boundary check.
</setup>
<workflow>
<step n="1" name="Bind the assignment">
Identify the accepted outcome/source revision, selected workflow/depth/control,
requested boundary, actual candidate/state, allowed writes, required proof, and
material unresolved choices. Show or reuse Launch before dispatch or edits.
</step>
<step n="2" name="Perform the phase">
Follow the [owning procedure](references/spec.md), loading only applicable
support and professionals. Read [boundary review](references/boundary-review.md) for the separate fidelity check. Compare the authored Project/Issue against its selected template before handoff.
</step>
<step n="3" name="Inspect and return">
Use the [shared return contract](../forge-shared/references/returns.md). The
accountable owner opens the actual result and relevant new log entries before
advancement, checking the selected template/rubric, candidate, actual evidence,
and gaps. Correct incomplete handoffs; do not promote self-reports into proof.
</step>
</workflow>
<output>
Choose the [Project](assets/product.md), [Issue](assets/issue.md),
[Bug Issue](assets/bug.md), [Design](assets/design.md), [Technical](assets/tech.md),
or [Work](assets/work.md) template under the owning procedure. Preserve the
selected contract; Issue never defaults to the Project format. Keep a ready
small Issue brief. Preserve actual results, findings and remedy authority, evidence limits,
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
