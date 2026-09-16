# Review judges

The independent Reviewer owns coverage and the integrated verdict. These are five
review responsibilities, not five mandatory agents. Do not omit an applicable
dimension because a change is small.

## Staffing

Use [concrete workflow staffing](workflows.md#concrete-staffing), including its
precedence when both expanded-Review triggers apply. Record the observed trigger
and actual dimension owners. Without either trigger, one Reviewer covers every
applicable dimension with evidence and a verdict in one compact report. Each
required Judge owns one dimension in a separate read-only context; Reviewer
integrates original returns and covers undelegated dimensions. Shared authority
and checks need not be duplicated. Staffing never waives coverage or Acceptance.

## Applicability and ownership

| Dimension | Applies when | Bundled source and responsibility |
| --- | --- | --- |
| Code Review | Code (including UI markup and styles), tests, executable configuration, or agent instructions that control execution change | [Forge Code Review](../../forge-code-review/SKILL.md): defects, regressions, security, code/test quality, lint/types, engineering standards |
| Design | UI behavior, rendered surfaces, or UI design artifacts change | Design rubric below: accepted visual fidelity, interaction states, accessibility, UI conventions |
| Quality | A knowledge-work deliverable is the reviewed outcome | Quality rubric below: accuracy, completeness, reasoning, usefulness, writing/artifact standards |
| Spec | Every candidate | Spec rubric below: approved end state, constraints, omissions, invented requirements, preservation |
| Craft | Every candidate | Craft rubric below: proportionality, overbuilding, underbuilding, justified mechanisms and remedies |

UI markup and stylesheet changes, including CSS-only changes, activate both Code
Review and Design: Code Review inspects source correctness and engineering
standards; Design inspects rendered fidelity, interaction, and accessibility. A
pure design artifact without a code change activates Design without Code Review.

Accompanying software docs, plans, and loop records do not routinely activate
Quality. The Reviewer checks their managed-artifact contract during integration.
A separately requested report or document deliverable does activate Quality.
There is no Standards or Evidence judge: standards belong to their owning
dimension and evidence is required from each. Code Review reads acceptance criteria
to establish correct behavior; Spec owns the exhaustive intent audit. Craft does
not replace code-quality inspection. Route an obvious concern outside a judge's
remit to its owner with evidence, without performing a second full audit.

## Selection, replacement, and disable

Resolve each applicable dimension in this order: explicit current user choice,
applicable repository harness, bundled source. Read the actual selected skill or
rubric; a name or remembered description is not its procedure. A replacement gets
the same boundary, authority, read-only contract, evidence bar, and report schema.
It cannot recursively invoke Forge Review or create another panel.

Selection is human-readable guidance, not configuration or a plugin API. For
example, a repository's AGENTS.md may say:

```text
For Forge Review, replace the Code Review dimension with .agents/skills/team-review/SKILL.md.
For Forge Review, replace the Design dimension with .agents/skills/ui-review/SKILL.md.
```

A user can instead say, "Disable the bundled Code Review skill and use the team
review skill for Code Review." This replaces the implementation, retaining
coverage. "Disable Design for this review" skips that dimension with the reason,
authority, and exact scope recorded; never silently run its bundled default.
Disabling coverage is not proof it passed. Report `DISABLED`, distinct from
`NOT_APPLICABLE` and a returned verdict. A missing explicitly selected replacement
is a gap; do not fall back unless that fallback is already authorized.

Only an explicit human waiver of the omitted coverage can permit an integrated
`PASS` scoped to the remaining dimensions; label that PASS with its excluded
dimension and waiver. A harness disable alone or an agent's tool limitation does
not supply that waiver. Otherwise required disabled or unavailable coverage
precludes PASS. No selection can rewrite accepted requirements or waive required
runtime Acceptance. Preserve user choices through the existing authority records.

## Shared investigation and admission

Try to break the change. Choose plausible counterexamples to its strongest claims,
follow real consumers, and test consequential failure paths. Then challenge your
own allegation: inspect existing safeguards and equally valid implementations.
There is no finding quota. A clean candidate earns a clean report.

Every admitted finding needs controlling authority, a reachable current trigger,
observed evidence or a concrete causal trace, and a material consequence. Name the
smallest honest severity and proportionate remedy boundary. Do not manufacture
nits, personal taste, speculative scale, hypothetical inputs outside the accepted
surface, or unrelated debt. Preserve real standards: an explicit material rule
violation is not dismissed as preference. A required proof gap remains a gap;
state the authority requiring that proof and the unproved claim, without inventing
a runtime failure. Reuse credible current proof and rerun only affected, missing,
stale, contradictory, required, or hypothesis-relevant checks.

## Design rubric

Use [design direction and craft](design-direction.md) as the bundled design
guidance, or the selected replacement. Challenge the primary user task with an
affected long-content, narrow-width, keyboard, or state-transition case. Check
actual type/color roles and content relationships against the incumbent system;
novelty and decoration are not quality requirements.

Load the target's accepted design revision, applicable UI standards, affected
journeys and states, and real rendering tools. Compare actual rendered output for
visual claims. Inspect hierarchy, legibility, alignment, clipping, overflow,
missing content, responsive behavior, and accepted fidelity. Exercise affected
interaction, loading/empty/error/success states, keyboard and focus behavior,
semantics, and accessibility. A screenshot alone cannot prove interaction.

Admit material drift from accepted visual authority or a demonstrated usability
or accessibility failure. Do not invent a redesign, demand pixel equality unless
required, or turn preferred spacing into a blocker. Source inspection may support
a causal accessibility finding; unavailable rendering remains a gap for visual
claims. State actual browser ownership and avoid concurrent browser mutation.

## Quality rubric

Load the deliverable's purpose, audience, accepted questions, source requirements,
and routed writing/artifact standards. Check material claims against their sources,
reasoning from evidence to conclusion, omissions that defeat the stated purpose,
internal consistency, usable structure, and the actual rendered/exported artifact
when layout matters. Try a consequential counterexample or alternative explanation.

Admit factual error, unsupported consequential conclusions, accepted omissions, or
material artifact-standard violations. A different writing voice or an interesting
unrequested topic is not a defect. Disclose unavailable sources and proof limits.

## Spec rubric

Use the assigned candidate purpose and the [Reviewer’s current-obligation
guidance](../../../agents/reviewer/instructions.md) to distinguish preserved
standing behavior, work this candidate must deliver, and explicitly deferred work.

Load independently retained accepted baseline, approved delta, decisions, NFRs,
non-goals, and affected standing commitments. Trace each affected obligation forward
to implementation and proof, then trace material changes back to accepted intent
or legitimate implementation latitude. Check omissions, silent strengthening or
weakening, contradictory scenarios, unauthorized scope, and preserved outcomes.
The mutable candidate Spec or a matching receipt cannot establish its own authority.

Name direct evidence or a concrete gap for each affected commitment. Do not invent
requirements from tests, findings, descriptive knowledge, or synthetic users. A
necessary change to accepted intent goes to the human; it is not a workaround.

## Craft rubric

Judge the mechanism against the accepted problem and present operating conditions.
Challenge unnecessary abstractions, state, configuration, protocols, indirection,
and dependencies; also challenge inadequate robustness at real trust, data-loss,
accessibility, and recovery boundaries. Follow the target's reuse/simplicity
standards and distinguish an equally valid tactic from a material violation.

Require a current maintenance or operational consequence, not hypothetical scale
or personal architectural taste. A remedy must solve the evidenced problem at
proportionate cost. A real defect needing a larger correction stays real and may
warrant RETHINK; disproportionate advice cannot become mandatory work.
