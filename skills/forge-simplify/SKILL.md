---
name: forge-simplify
description: Simplify a bounded candidate without changing accepted behavior, then run affected proof and independent Review when it changes. Use for "Forge simplify", an explicit bounded simplification request through Forge, or the authorized post-Review delivery phase. Direct Simplify stops at its result and never starts QA or Ship.
---

# Forge Simplify

<skill name="forge-simplify">
<activation>
Run only when explicitly invoked through Forge, selected by the caller, or reached
by an authorized delivery after Build and independent Review pass. Direct Build
or Review alone does not authorize this phase. Reuse accepted Launch and scope;
an installed skill name does not prove native slash-command support.
</activation>
<setup>
Read [authority](../forge-shared/references/authority.md) and
[target harness resolution](../forge-shared/references/target-harness.md),
[Launch and gates](../forge-shared/references/workflows.md), and the target
repository's applicable harness. Adopt [Engineer](../../agents/engineer/instructions.md)
for behavior-preserving simplification. In delivery, this is a separate Engineer
assignment after the initial Build/Review loop, before QA.
</setup>
<workflow>
<step n="1" name="Bind scope and the actual baseline">
Identify accepted authority, requested scope and writes, exact candidate/base,
preservation scope, current proof, and any actual prior Review. Delivery requires
passing Build/Review before Simplify. A direct bounded Simplify request needs no
pre-edit Review PASS; inspect its actual baseline and follow the
[owning procedure](references/simplify.md). Never invent prior evidence or start a
broader delivery lifecycle.
</step>
<step n="2" name="Simplify and refresh affected evidence">
Follow the owning procedure. Return changes with affected proof or an evidenced
no-op. Before completing a changed operation, obtain independent
[Review](../forge-review/SKILL.md) bound to the resulting complete candidate. Use
delta Review and reuse unaffected evidence by reason when prior passing evidence
exists; without it, review the requested outcome and affected commitments without
claiming an earlier verdict. A no-op retains the same candidate and any actual
prior evidence, explicitly reporting missing prior Review.
</step>
<step n="3" name="Inspect and stop or hand off">
The accountable owner reads the actual return and relevant new log entries under
[shared returns](../forge-shared/references/returns.md). Delivery proceeds to QA
only with current passing Review; direct Simplify stops at its bounded result.
</step>
</workflow>
<output>
Use [the simplification record guidance](assets/simplify.md) in the existing log.
Report the actual baseline and prior Review presence/absence, inspected paths, changes or no-op basis, resulting
candidate, affected and reused proof, independent verdict, gaps, and boundary.
</output>
<checklist>
- Accepted scope, exact baseline, and actual prior Review presence/absence resolved.
- Separate delivery assignment follows passing Build/Review and precedes QA.
- Required behavior and harness preserved; no unrelated cleanup or new scope.
- Changed operation completes only with affected proof and independent Review bound to the whole result.
- No-op preserves the candidate and any actual prior evidence; missing prior Review remains explicit.
- Direct operation adds no pre-edit Review PASS gate and stops without QA or Ship.
</checklist>
</skill>
