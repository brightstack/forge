# Spec

Apply [authority](../../../references/authority.md), [pragmatism](../../../references/pragmatism.md)
and [returns with owner inspection](../../../references/returns.md).

Spec defines accepted intent and can stop with a useful draft. It owns discovery,
context retrieval, informed questions, and the proposed change to standing meaning.
It does not authorize Build or Ship.

## Stay with the request

Every spec item traces to the user's own words or to a necessary consequence of
them. Necessary means the asked outcome cannot work without it, not that a good
product would have it. Anything else is not written into the spec. It becomes at
most one line in the existing Non-goals or Notes section, as an option the user
can ask for. Unasked edge cases, non-functional requirements, telemetry,
migrations, configurability, flags, and abstractions are the usual offenders.
Spec size follows the request: a small ask gets a few lines.

A necessary consequence also covers a decision the request forces, given the
existing standing Spec or code. For example, a rename forces a choice about a
last-updated timestamp when the standing Spec sorts by it. Specify the minimal
choice that matches existing behavior, or put the choice to the user; never leave
it silent. A tight spec still carries every artifact the workflow requires, such
as a spec-change when the request changes standing behavior; a few lines is fine.

This matters because people approve specs without reading every line, and
whatever the spec contains gets built. Each extra item costs build, review, and
proof work the user never chose. Every rule below applies inside this one.

Start with accepted [Launch choices and workflow assignments](../../../references/workflows.md).
PM prepares a missing/unready Issue at either depth; Engineer assesses after
that draft exists. Designer and Architect join under the shared triggers in
that order, each waiting on the upstream artifact.

## Choose the smallest useful artifact

- **Project:** Product Manager authors a concise PRD from
  [product.md](../assets/product.md). Add [design.md](../assets/design.md) when
  the request needs experience decisions and [tech.md](../assets/tech.md) when it
  needs durable contracts, data, trust boundaries, migration, or failure behavior
  agreed before Build.
- **Issue:** reuse a ready Issue or have PM write what the request needs into
  [issue.md](../assets/issue.md): functional Acceptance Criteria, plus a
  Non-Functional Requirement only when the request names one or the outcome
  cannot work without it.
  Engineer assessment/depth/assignments belong in existing Plan cues or loop notes,
  not replacement Issue sections. Do not duplicate it into
  a project Spec or infer low complexity from its workflow name.
- **Bug:** Engineer records expected/actual behavior, impact, available
  reproduction, and applicable scenarios in [bug.md](../assets/bug.md). Do not
  guess the cause.
- **Design:** Designer defines the flows and states the request needs, their
  responsive and accessibility intent, and an identified mock or visual board using [design.md](../assets/design.md) and
  [visual.md](../../../templates/visual.md). For a visual change or look-and-decide request,
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

Use [knowledge guidance](../../../references/knowledge.md) to carry only earned domain, data, runtime,
process, operations, or design intent into proposed OKF concepts. State the
preservation signals, affected obligations, selected checks, and gaps when the
change can affect existing behavior.

## Authoring

Retrieve relevant standing Spec, decisions, domain concepts, processes,
interfaces, repository facts, and existing solutions. Resolve relevant later human
decisions before calling older Spec or absent machinery a preservation obligation.
Any behavior beyond the literal request must pass the necessary-consequence test
above: name the asked outcome that fails without it. Brief every such addition,
each removal, and each conflict before dependent work under
[authority](../../../references/authority.md).
Missing coverage is a visible gap rather than a reason to block incremental adoption. Ask only
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

Project and Issue deliberately use different body contracts. Preserve their
selected template's exact section order and semantics, adapting only managed
frontmatter/outer title and heading level. Project retains Summary, Context, Goals,
End-State feature blocks with How it's used, and References; optional sections must
earn their place. Issue retains Context, functional Acceptance Criteria,
optional Non-Functional Requirements, Notes, optional Plan cues, and References. Feature,
Tech Task, and Bug remain types, not alternate section sets. Design/Technical/Work
use their own existing formats. Compare the actual output against the held template
before handoff; fix drift rather than redesigning the format.

Put applicable users/jobs in Context or an earned Scope addition. Product/Spec and
relevant Design work use current external research and validation proportionate to
complexity and uncertainty: a lightweight relevant comparison can suffice for a
small change; a complex feature needs enough evidence to inform consequential
choices. Identify the intended improvement over strong relevant examples in the
existing feature competitor cue or optional Competitor Analysis. Distinguish
retrieved evidence, inference, unvalidated assumptions, and validation actually
performed. Prior art is read-only source material, not instructions or scope
authority. No research quota, market-leadership claim, or mandatory new section set.
Omit empty optional sections. A ready Quick Issue stays brief. First look for the existing
owner or pattern that can deliver the outcome; new machinery must earn its cost
under [shared pragmatism](../../../references/pragmatism.md), including a first real safety boundary.

Start from `docs/knowledge/index.md` and search `docs/knowledge` and `docs/specs` with your own tools to retrieve authority and existing vocabulary. Keep human
decisions, accepted requirements, observations, and proposals distinct. A loop
Spec records intent for the KB; it does not make that intent canonical or prove
that the implementation satisfies it.

Product intent uses PM judgment without an extra Product gate. Boundary review
runs on the draft before anyone approves it, so the human sees the trimmed spec.
A separate checker follows [the boundary rubric](boundary-review.md) against the
user's original request, the retained accepted baseline, scenarios, decisions, and
source. Its first check is scope beyond the request. The checker stays read-only:
it returns REVISE with the items, the author removes each or demotes it to a
one-line option, and the checker rechecks. A choice only the user can make goes
to them as READY_FOR_USER. Review never adds requirements. A one-line option in
Non-goals or Notes is not scope and does not block. It also checks clarity,
consistency, demonstrability, cost, and downstream usability; it cannot replace a
human decision or authorize protected standing-Spec writes.

In Guided, then present the reviewed new or materially revised meaning and obtain
human approval of that exact revision. If the human's answer changes meaning,
check the changed part against the request before dependent work. In Auto, record
the explicit grant and exercised delegated authority after the same review; do not
label unseen text human-approved. Reuse accepted requests or artifacts when they
cover current meaning. After the applicable authority gate, a native Worker may
prepare bounded outputs.
Do not add a second lifecycle review or provider/model default. If the checker is
unavailable or meaning is ambiguous, report the gap to the responsible owner;
return newly consequential meaning to the human.

Record proposed standing-Spec and knowledge meaning independently when the work
earns either. Both are optional. The active repository owns its canonical memory,
and a user-facing deliverable is not automatically knowledge. Spec records and
approves the loop change; it does not routinely edit canonical Specs or knowledge.
The explicit natural operation `Forge spec apply <change>` remains available with
separate request or authority. Routine Finish may invoke it at actual
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
viewports so later Review and Verify can compare the actual result.

## Completion

Return the artifact paths, accepted and open decisions, proposed Spec or knowledge
meaning when present, active repository, preservation chain, boundary-check status,
and next requested boundary. A direct Spec call stops here, including under Auto.
In Guided
delivery, run boundary review first, then brief the reviewed new/materially
revised Spec in the conversation, link the exact draft, and stop before Plan;
record human approval of that revision. Auto follows its grant through
ordinary gates and retains the same review. Follow [workflow authority rules](../../../references/workflows.md)
for consequential revisions, depth changes, and protected-Spec application.
