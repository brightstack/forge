# Spec

Spec defines accepted intent and can stop with a useful draft. It owns discovery,
context retrieval, informed questions, and the proposed change to standing meaning.
It does not authorize Build or Ship.

Start with accepted [Launch choices and workflow assignments](workflows.md).
PM prepares a missing/unready Issue at either depth; Engineer assesses after
that draft exists. Designer and Architect join under the shared triggers in
that order, each waiting on the upstream artifact.

## Choose the smallest useful artifact

- **Project:** Product Manager authors a concise PRD from
  [product.md](../assets/product.md). Add [design.md](../assets/design.md) when
  experience decisions matter and [tech.md](../assets/tech.md) when durable
  contracts, data, trust boundaries, migration, failure behavior, or material NFRs
  need early alignment.
- **Issue:** reuse a ready Issue or have PM create/complete
  [issue.md](../assets/issue.md), including effort/complexity, uncertainty, depth,
  specialist assignments, and proof after Engineer assessment. Do not duplicate it into
  a project Spec or infer low complexity from its workflow name.
- **Bug:** Engineer records expected/actual behavior, impact, available
  reproduction, and applicable scenarios in [bug.md](../assets/bug.md). Do not
  guess the cause.
- **Design:** Designer defines flows, states, responsive and accessibility intent,
  and an identified mock or visual board using [design.md](../assets/design.md) and
  [visual.md](../assets/visual.md). For a visual change or look-and-decide request,
  follow [codebase-anchored design studies](design-studies.md) to produce a
  browsable single-page study with project-native frames and rendered evidence.
  Reuse an adequate accepted visual; do not create a board for every small patch.
- **Work:** the relevant professional defines the deliverable, audience, goals,
  constraints, source standard, and proof in [work.md](../assets/work.md).

Use [spec-change.md](../assets/spec-change.md) when proposed behavior changes
standing requirements. Name additions, modifications, removals, preserved
commitments, affected knowledge, source authority, and full Given/When/Then
scenarios. Do not express a removal by omission or copy standing Spec into a
second corpus.

Use [knowledge guidance](knowledge.md) to carry only earned domain, data, runtime,
process, operations, or design intent into proposed OKF concepts. State the
preservation signals, affected obligations, selected checks, and gaps when the
change can affect existing behavior.

## Authoring

Retrieve relevant standing Spec, decisions, domain concepts, processes,
interfaces, repository facts, and existing solutions. Missing coverage is a
visible gap rather than a reason to block incremental adoption. Ask only
consequential human choices that cannot be retrieved, and include a recommendation.
Treat a question, possibility, analogy, or agent recommendation as open, not as
authority for a stronger guarantee. Trace each proposed addition or removal to an
exact accepted source or bounded Auto grant; otherwise label it proposed and keep
the accepted baseline. A later answer does not retroactively turn an earlier
question into approval. Correct mistaken source and dependent records in order.
Do not force a fixed interview, exhaustive catalog, or empty
sections. Do not add Spec files, feature flags, configuration, extra scenarios,
or compatibility promises the human did not ask for. Delete unused template
sections. Do not bury extra product or technical decisions inside a Spec to
make it look complete.

For a substantial Product, Design, Technical, or Work artifact, open with a short
Summary, Context, and self-contained End State before earned detail. State the
proposal, why it matters, and the observable or operational result and boundaries.
Omit empty sections. A ready Quick Issue stays brief. First look for the existing
owner or pattern that can deliver the outcome; new machinery must earn its cost
under [Craft](judges.md#craft-rubric), including a first real safety boundary.

Use `forge kb ask` to retrieve authority and existing vocabulary. Keep human
decisions, accepted requirements, observations, and proposals distinct. A loop
Spec records intent for the KB; it does not make that intent canonical or prove
that the implementation satisfies it.

Product intent uses PM judgment without an extra Product gate. In Guided, present
new/materially revised meaning and obtain human approval before boundary review.
In Auto, record the explicit grant and exercised delegated authority before the
same review; do not label unseen text human-approved. Reuse accepted requests or
artifacts when they cover current meaning. Boundary review checks fidelity,
clarity, consistency, demonstrability, cost, and downstream usability; it cannot
replace a human decision or authorize protected standing-Spec writes.

After the applicable authority gate, a native Worker may prepare bounded outputs.
A separate fast checker performs that same boundary fidelity check against the
retained accepted baseline, approved change, scenarios, decisions, and source.
Do not add a second lifecycle review or provider/model default. If the checker is
unavailable or meaning is ambiguous, report the gap to the responsible owner;
return newly consequential meaning to the human.

Record proposed standing-Spec and knowledge meaning independently when the work
earns either. Both are optional. The active repository owns its canonical memory,
and a user-facing deliverable is not automatically knowledge. Spec records and
approves the loop change; it does not routinely edit canonical Specs or knowledge.
The explicit natural operation `Forge spec apply <change>` remains available with
separate request or authority. Routine [Finish](finish.md) may invoke it at actual
work completion, normally Build-or-later or after a general-work deliverable;
direct Spec and Plan remain proposal-only.

For behavior, assign stable scenario IDs and write explicit Given/When/Then:

```text
Scenario: SCN-…
Given <accepted starting state>
When <observable actor action or event>
Then <observable outcome>
```

Keep prototypes and mocks identified as decision evidence until the human accepts
their meaning. Record accepted visual revision, states, and representative
viewports so later Review and Acceptance can compare the actual result.

## Completion

Return the artifact paths, accepted and open decisions, proposed Spec or knowledge
meaning when present, active repository, preservation chain, boundary-check status,
and next requested boundary. A direct Spec call stops here, including under Auto.
In Guided
delivery, brief the new/materially revised Spec in the conversation, link the
exact draft, and stop before Plan; record human approval of that revision
before boundary review. Auto follows its grant through
ordinary gates and retains the same review. Follow [workflow authority rules](workflows.md)
for consequential revisions, depth changes, and protected-Spec application.
