# Review judges

The Reviewer owns coverage and one integrated verdict. Dimensions are review
responsibilities, not seven mandatory agents. Load each applicable rubric; staffing
is proportionate under [shared triggers](../../forge-shared/references/workflows.md#concrete-staffing).
Apply [authority](../../forge-shared/references/authority.md),
[finding admission](../../forge-shared/references/severity.md), and
[returns/owner inspection](../../forge-shared/references/returns.md) to every owner.

## Applicability and ownership

| Dimension | Applies when | Owning rubric |
| --- | --- | --- |
| Code Review | Code, UI markup/styles, tests, executable configuration, or execution-controlling instructions change | [Code Review](judges/code-review/rubric.md): source correctness, regressions, standards, tests; uses the standalone leaf |
| Design | UI behavior, rendered surfaces, or design artifacts change | [Design](judges/design/rubric.md): fidelity, interaction, accessibility |
| Quality | A knowledge-work deliverable is the requested outcome | [Quality](judges/quality/rubric.md): accuracy, reasoning, usefulness, artifact quality |
| Spec | Every candidate | [Spec](judges/spec/rubric.md): current accepted obligations, omissions, invented scope, preservation |
| Craft | Every candidate | [Craft](judges/craft/rubric.md): proportionality and sound simplicity |
| Security | Changes affect a plausible trust, authorization, tenancy, sensitive-data, input-execution, or sandbox boundary | [Security](judges/security/rubric.md): reachable threats and existing protections |
| Performance | Frequent paths, queries/remote calls, collection processing, rendering, or stated resource/latency obligations are affected | [Performance](judges/performance/rubric.md): present costs and measured or causally supported impact |

CSS-only code activates Code Review and Design. A pure design artifact activates
Design without Code Review. Accompanying software docs/loop records do not alone
activate Quality; the Reviewer checks their artifact contract during integration.
Security and Performance may be NOT_APPLICABLE with an evidence-backed reason;
never omit a plausible current risk because the candidate is small. They do not
replace Code Review or create security/performance requirements.

No separate Standards or Evidence judge is needed: standards belong to their
owning dimension and each dimension supplies evidence. Route an obvious concern
to its owner with the trace and avoid a duplicate full audit. Code Review reads
criteria to establish correct behavior; Spec owns the exhaustive intent audit.

## Staffing and return

Without an expanded-Review trigger, one Reviewer covers every applicable dimension
in one compact report. For applicable Code Review it reads and follows the actual
selected leaf, by default [Forge Code Review](../../forge-code-review/SKILL.md),
plus the actual relevant target app standards; using one Reviewer does not skip
the leaf procedure. When a shared trigger requires judges, assign each required
dimension to a separate clean read-only context. Retain exact candidate/base,
authority, allowed tools, selected rubric or exact leaf path, actual applicable
target harness/rule/reference/check paths, and boundary. The receiving Judge reads
those sources before judgment; provider/model diversity
is not required. Reviewer integrates original returns and covers undelegated
work. Native nesting gaps are handled by the host Coordinator dispatching on the
Reviewer's behalf, not by author self-review.

Every rubric uses the dimension section of [review.md](../assets/review.md) or its
selected leaf report. Return actual checks/evidence/results/gaps, the authority,
reachable trigger, consequence, severity, and remedy eligibility of each finding,
and a dimension verdict. Reviewer reads the actual report and relevant new log
entries, checks the evidence, preserves delegated originals, merges duplicates,
and records dispositions. Self-reported rubric compliance does not establish it.

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
runtime Verify. Preserve user choices through the existing authority records.


## Shared investigation and admission

Try plausible ways the strongest candidate claims fail, then challenge your own
allegation against existing safeguards and equally valid implementations. Start
with the happy path and common adjacent cases; rare-case work needs a current
reason. A reachable security threat is not dismissed because an exploit is unusual.
Use common severity by actual impact, not by dimension name or Spec mismatch.
Review findings cannot create requirements. A severe defect remains visible even
when its remedy needs a human decision; a merely preferred redesign is not a
blocker. State required proof gaps without inventing a runtime defect. Reuse
credible unaffected proof; rerun missing, stale, contradictory, required, or
hypothesis-relevant checks.
