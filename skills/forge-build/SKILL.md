---
name: forge-build
description: Implement or fix an accepted bounded outcome through integration, independent Review, and repair. Use for "Forge build", asking Forge to implement or fix an outcome, or a caller-selected Build phase. Direct Build stops after Review; separate Simplify, Verify, and Ship require their own authority.
---

# Forge Build

<skill name="forge-build">
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
Engineer owns the integrated candidate, Worker assignments, proof, and repair. A separate Reviewer owns the read-only verdict.
</setup>
<workflow>
<step n="1" name="Bind the assignment">
Identify the accepted outcome/source revision, selected workflow/depth/control,
requested boundary, actual candidate/state, allowed writes, required proof, and
material unresolved choices. Show or reuse Launch before dispatch or edits.
</step>
<step n="2" name="Perform the phase">
Follow the [owning procedure](references/build.md), loading only applicable
support and professionals. Invoke [Forge Review](../forge-review/SKILL.md) on the complete integrated candidate. The authorized delivery proceeds to [Forge Simplify](../forge-simplify/SKILL.md) only after that Review passes; direct Build stops here. Bugs also use [diagnosis](references/debug.md).
</step>
<step n="3" name="Inspect and return">
Use the [shared return contract](../forge-shared/references/returns.md). The
accountable owner opens the actual result and relevant new log entries before
advancement, checking the selected template/rubric, candidate, actual evidence,
and gaps. Correct incomplete handoffs; do not promote self-reports into proof.
</step>
</workflow>
<output>
Use [the existing build artifact template](assets/build-log.md) when a separate
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
