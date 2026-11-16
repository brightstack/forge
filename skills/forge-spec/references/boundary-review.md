# Spec boundary review

A separate checker reads the exact authored revision beside the user's original
request, independently retained accepted intent, source/grant, decisions, and the
selected template. The check runs before the human approves the Spec, so the
human sees the trimmed result. Nothing in the draft is accepted yet: an inflated
draft is not evidence of what the human wants. Use the
[authority](../../../references/authority.md),
[pragmatism](../../../references/pragmatism.md),
[severity/admission](../../../references/severity.md) and
[return contract](../../../references/returns.md). Load
[Reviewer judgment](../../../agents/reviewer/instructions.md); no unrelated phase
skill or provider/model default is needed.

Check, in this order:

- Scope beyond the request: trace every item to the user's own words or to a
  necessary consequence of them, meaning the asked outcome cannot work without it.
  Small additions count: an unasked edge case, NFR, telemetry, migration, setting,
  flag, or abstraction is scope beyond the request. List each one in a REVISE
  return. The checker stays read-only: the PM (or the authoring professional)
  removes each item or demotes it to one line in the Issue's Notes or the PRD's
  Non-goals as an option the user can ask for, then the checker rechecks. A
  one-line option there is not scope and does not block. Review never adds
  requirements.
- Forced decisions, with the same weight as additions: every decision the request
  forces, given the existing standing Spec or code, is either specified as the
  minimal choice matching existing behavior or put to the user. A silent or
  declined forced decision returns REVISE.
- Required artifacts: every artifact the workflow requires exists, such as a
  spec-change when the request changes standing behavior. A short one is fine; a
  missing one returns REVISE.
- Fidelity: every removal and every asked-for behavior is still present. Compare
  stronger promises and restrictions to the request, applicable harness, actual
  decisions, and any bounded grant. A draft's claim that feedback is accepted
  cannot establish acceptance; only a human decision recorded in the source can.
  Keep missing acceptance visible.
- Important decisions: outcome, scope, behavior, material data/API implications,
  and unresolved consequential choices are visible before dependent work.
- Template: Project/Issue section order and meanings match the selected deliberate
  asset, with only managed-title/heading adaptation and earned optional content.
- Usability: the intended user/job, context, observable outcome, relevant constraints,
  and explicit Given/When/Then where behavior matters are understandable.
- Evidence: relevant prior art/research/validation is proportionate to complexity;
  evidence, inference, assumptions, and unperformed validation are distinct.
- Proportionality: spec size follows the request; no invented format, research
  quota, rare-case machinery, or mandatory tactic replaces builder freedom within
  approved meaning.

Apply the [Spec rubric](../../forge-review/references/judges/spec/rubric.md),
including its four execution-discipline checks, to the proposed Spec. Separate
observable commitments from implementation tactics and require a credible proof
route without demanding code or executed implementation checks at this stage.

Return the exact revision/source, checks and evidence, actual results, gaps, each
item beyond the request, and PASS, REVISE, READY_FOR_USER,
or BLOCKED with its basis. Scope beyond the request still written into the Spec
blocks PASS under [severity](../../../references/severity.md). PASS means the checked
revision faithfully serves its stated authority, not human approval, Build,
canonical application, or Verify. A material intent choice returns to the
human; missing current evidence stays incomplete. The owner reads the actual
return and relevant new log entries before progression.
