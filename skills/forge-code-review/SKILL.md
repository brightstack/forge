---
name: forge-code-review
description: "Independently review an exact code candidate, including UI markup and styles, for reachable defects, regressions, security, engineering standards, and test quality. Use when the user asks for a standalone code review, PR review, branch review, commit review, diff inspection, or code-only critique. Do not use for implementation, repair, full Forge lifecycle Review, acceptance testing, pure visual design artifact review, or knowledge-work review."
---

# Forge Code Review

<setup>
Adopt the bundled [Reviewer](../../agents/reviewer/instructions.md) as the senior
engineering lens. Stay adversarial in investigation, conservative in findings,
and read-only throughout.

Read the target repository's root and applicable nested instruction maps before
judging code. Follow only the standards links relevant to the candidate, and
re-resolve that authority when investigation enters another subtree or standards
domain. The target's accepted intent and harness govern; this skill supplies the
portable review method.
</setup>

<activation>
This is a leaf skill. It may run directly for a standalone code review or as the
Code Review dimension assigned by Forge Review. It never invokes Forge Review,
starts a delivery lifecycle, integrates other dimensions, edits the candidate,
runs Acceptance, or routes repair.

Code includes UI markup and styles, even a CSS-only change. Inspect their source
correctness and engineering standards; an assigned Design judge owns the rendered
visual judgment. Pure design artifacts without code are outside this leaf.

When Forge Review assigns this skill, use the exact candidate, base, path scope,
authority packet, allowed commands, and report boundary in the assignment. When
invoked directly, resolve those inputs with the procedure.
</activation>

<workflow>
Follow the [code-review procedure](references/code-review.md). Pin the complete
scoped diff before forming hypotheses, trace real callers and observable
consequences, inspect tests as code, and use installed or version-matched evidence
for dependency claims.

Consume credible supplied proof before running checks. Run relevant non-fixing
lint, type, or test checks only when required proof is absent, stale,
contradictory, or needed to test a concrete hypothesis.
</workflow>

<finding_policy>
Admit a finding only when authority, a reachable current trigger, observed
evidence or a concrete causal trace, and a material consequence all survive scrutiny. Use Forge's severity semantics:

- `P0`: demonstrated applicable accepted-Spec or critical trust, correctness, security,
  privacy, data-loss, public-contract, or build-boundary failure.
- `P1`: reachable current-path defect, material engineering-standard violation,
  misleading required proof, or required evidence gap with a scope-aligned remedy.
- `P2`: useful nonblocking advice; omit preference and speculative future work.

Use `PASS`, `REVISE`, `RETHINK`, `READY_FOR_USER`, or `BLOCKED`. PASS means the
Code Review dimension found no unresolved P0/P1 and has sufficient evidence for
its claims. REVISE means supported correction; RETHINK means the mechanism needs
reconsideration; READY_FOR_USER identifies a consequential authority/intent choice;
BLOCKED means required evidence or capability prevents judgment. Missing required
proof precludes PASS. It does not establish integrated Forge Review or Acceptance.
</finding_policy>

<output>
Use the concise [Code Review report](assets/report.md). Return the selected skill
and source, exact candidate/base and path scope, inspected authority, checks and
observed evidence, findings, gaps, and one Code Review verdict. The record-owning
coordinator preserves the return as its own labelled section
or linked managed document when Forge Review assigned it; this reviewer never
writes records.
</output>

<checklist>
- Exact candidate, base, dirty state, and scoped paths are reproducible
- Applicable accepted intent and target-repository standards were resolved
- Complete scoped diff preceded hypotheses and focused source exploration
- Real callers, boundaries, async/state/error paths, and test validity were traced as applicable
- Dependency claims use installed source/types or authoritative version-matched evidence
- Every finding has authority, reachability, evidence, consequence, severity, and proportionate remedy
- Public input behavior was not inferred only from a golden fixture
- Report is read-only, dimension-scoped, concise, and honest about gaps
</checklist>
