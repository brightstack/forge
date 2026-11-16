# Spec rubric

Load [Reviewer judgment](../../../../../agents/reviewer/instructions.md). Distinguish
standing behavior to preserve, outcomes this candidate must deliver now, and
explicitly deferred work. Nearby future intent is not automatically a completion
claim; an actual completion claim remains accountable to its approved scope.

## Check

This rubric measures request fidelity. It is not a hunt for gaps. Check two
things with equal weight, in this order: behavior added that nobody asked for,
and asked-for behavior that is missing. An addition counts even when it is small
or sensible: an unasked edge case, NFR, telemetry, setting, or abstraction is
added behavior. For a built result, the approved Spec is what was asked. Review
stays read-only: it lists added scope as a finding for the author to remove or
demote to a one-line option, or returns it to the user; it never adds
requirements. A one-line option in Non-goals or Notes is not scope.

Read the user's original request, independently retained accepted baseline,
approved delta or bounded grant, human decisions, scenarios, any NFRs, non-goals,
and affected standing commitments. Trace each item back to the request or a
necessary consequence of it, then trace affected obligations forward to
implementation/proof. Inspect unauthorized additions and strengthening first,
then silent omissions and weakening, contradictions, and lost preserved behavior.
The mutable Spec and matching receipts cannot prove their own authority.

Apply all four [execution-discipline principles](../../../../../references/pragmatism.md)
to proposed Specs as well as built results:

- Think before coding: resolve retrievable facts first; expose material assumptions,
  competing meanings, simpler alternatives, and unresolved consequential choices.
- Simplicity: keep only the behavior and constraints the request needs. For a
  built result, that includes reasonable handling of the asked behavior's
  normal-use failures. Challenge speculative features, flexibility,
  configuration, and rare-case machinery.
  Leave reversible tactics with the Builder; internal structure is not
  automatically a Spec obligation.
- Surgical changes: trace each addition, removal, or stronger promise to
  accepted intent, actual harness, decisions, or a bounded grant. Do not normalize
  unrelated cleanup or feedback merely because it now appears in the draft.
  Implementation removes only its own orphans and follows existing style.
- Verifiable goals: require observable outcomes, explicit Given/When/Then where
  behavior matters, and proportionate checks. A proposed Spec earns a credible
  proof route; code and executed implementation checks are due at their phase.

Do not invent requirements to satisfy validation or complete a template. Return
unsupported scope for a decision or remove it from the proposal. Keep
missing acceptance visible, count genuine later approval, and resolve consequential
choices before dependent work. Generic Auto control alone is not that decision.

## Evidence and limits

For each affected obligation give direct evidence or a concrete proof gap. Do not
create requirements from tests, findings, code, knowledge, prototypes, or synthetic
users. Distinguish source approval from delegated progression over a draft.
A mismatch is graded by demonstrated consequence under shared severity, not
labelled P0 merely for being a mismatch. An important intent change needs a human
decision; an in-scope reversible correction proceeds without a new gate.

## Common contract

Read [authority](../../../../../references/authority.md),
[finding admission](../../../../../references/severity.md),
[actual target harness sources](../../../../../references/target-harness.md),
[returns](../../../../../references/returns.md), and the assigned exact
candidate/base, authority packet, target harness, and allowed tools. Remain
read-only. Judge current obligations and present risks; no finding quota,
new requirements, or automatic repair authority. Severity follows actual impact;
remedy scope is assessed separately.

Use the dimension section in [review.md](../../../assets/review.md), unless a
selected leaf supplies its own report. Return selected rubric, inspected scope,
checks/evidence, actual results, findings with trigger/consequence/remedy boundary,
gaps, and PASS, REVISE, RETHINK, READY_FOR_USER, or BLOCKED with its basis. A
required unperformed check is incomplete. The Reviewer inspects the actual report
and relevant new log evidence before disposition.
