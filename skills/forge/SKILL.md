---
name: forge
description: "Route software delivery and related Forge operations when the user explicitly invokes Forge or the caller selects it. Use for Forge this, Forge build/fix/review/QA, or Forge delivery requests. Select the named phase and stop at the requested boundary. Ordinary unselected requests do not activate portable Forge; generic routing never grants Auto or publication."
---

# Forge

<skill name="forge">
<activation>
Activate only when the user explicitly invokes Forge or the caller identifies
this skill. Do not infer portable Forge from an ordinary unselected build, review,
plan, research, or writing request. A target harness may select Forge for those
requests. Re-evaluate the current request; loading Forge does not start a workflow. Route to
the smallest requested operation. A ticket, plan, mock, or reference alone does
not authorize Build. Actual host commands such as `/forge:spec` delegate to their
named phase; valid skill folder names do not by themselves prove slash support.
Use the installed host documentation for verified invocation and gaps.
</activation>

<setup>
Read [authority](../forge-shared/references/authority.md) and
[target harness resolution](../forge-shared/references/target-harness.md), then the
actual applicable repository sources they route to. The Coordinator owns conversation, authority,
Launch, routing, and owner inspection. Load only the selected phase's professional
instructions. Identity belongs to those professionals; procedure belongs here.
</setup>

<launch>
Show or reuse [Launch](../forge-shared/references/workflows.md). For a new Launch,
read and fill the shared [chat template](../forge-shared/assets/launch.md): the
task and stopping point, a compact Flow/Team table, and the actual approval ask or
authorized next action in plain language. Keep routing taxonomy internal. Guided
waits before dispatch and at new Spec/consequential Plan gates; an existing accepted
Launch is reused. Auto proceeds only within its cited grant, retaining protected
Spec and publication restrictions. A clear direct bounded Build request supplies
Build authority; faithful tactical Plan notes create no second approval gate.
</launch>

<routing>
- Spec, scope, or spec design: [Forge Spec](../forge-spec/SKILL.md).
- Plan or architecture strategy: [Forge Plan](../forge-plan/SKILL.md).
- Build, implement, or fix: [Forge Build](../forge-build/SKILL.md).
- Integrated review: [Forge Review](../forge-review/SKILL.md).
- Verify or browser QA: [Forge Verify](../forge-verify/SKILL.md).
- Ship: [Forge Ship](../forge-ship/SKILL.md).
- Explicit standalone code-only review: [Forge Code Review](../forge-code-review/SKILL.md).
- Explore: [bounded research](../forge-shared/references/research.md).
- Explain an artifact/change: [read-only Explain](../forge-shared/references/reporting.md#explain).
- Simplify: [Forge Simplify](../forge-simplify/SKILL.md), a bounded post-Review operation.
- Finish: [actual-completion reconciliation](../forge-shared/references/finish.md).
- Spec apply, legacy natural wording Spec merge, or KB ask/add/update/remove/verify/history:
  [guarded memory operations](../forge-shared/references/memory.md).
- Evaluate Forge behavior: use the separately supplied `forge-eval` development
  skill. Its evaluation corpus is not part of a runtime-only installation.
</routing>

<workflow>
<step n="1" name="Establish scope and authority">
Identify the requested boundary, accepted sources and revision, actual state, and
remaining material choices. Follow the [workflow assignments and gates](../forge-shared/references/workflows.md).
Use [record mechanics](../forge-shared/references/protocol.md) only as needed.
</step>
<step n="2" name="Run only authorized phases">
Full delivery follows `Spec -> [Build <-> Review] -> Simplify -> Verify -> Ship`.
Reuse relevant accepted artifacts/evidence explicitly. Plan remains a job before
Build, with brief Engineer notes for Quick work and a direct Plan skill when
requested. Spec owns discovery; Build/Review converges on a working reviewed
candidate. A separate Engineer then owns Simplify; changes receive affected proof
and independent delta Review bound to the resulting complete candidate, while an
evidenced no-op retains prior Review. Verify exercises that result. Ship performs only authorized publication. Direct Build/Review
stops before Simplify unless the request also authorizes it; direct Simplify stops
before QA.
</step>
<step n="3" name="Inspect handoffs and repair">
Use one accountable owner and disjoint or serialized writes. Required specialists
are actual native assignments, not personas loaded into the Coordinator. Read each
return and new relevant log evidence under [the return contract](../forge-shared/references/returns.md)
before advancing. Apply shared severity, remedy authority, and finite repair limits.
</step>
<step n="4" name="Close the requested work">
At actual authorized completion, run Finish for approved unapplied meaning and
owned-process cleanup. Direct Spec/Plan stays proposal-only. State actual outcome,
candidate, proof, gaps, and next required action; no extra lifecycle or publication
claim follows from a local PASS.
</step>
</workflow>

<output>
Use the selected phase's owning artifact template and shared returns. Launch uses
the shared [chat template](../forge-shared/assets/launch.md), not a saved report.
Other human gates use [brief reporting](../forge-shared/references/reporting.md), with a plain-language
decision brief followed by links to the exact revision.
</output>
<checklist>
- Explicit current activation and requested stopping boundary.
- Launch and authority reused or shown; human approval and delegated progression distinct.
- Actual phase professionals, independent Review, and distinct Verify as required.
- Returned artifacts and new relevant log evidence inspected before advancement.
- Findings retain scope; shared severity, finite repair, and proof limits respected.
- Completion records actual apply/cleanup outcomes within existing authority.
</checklist>
</skill>
