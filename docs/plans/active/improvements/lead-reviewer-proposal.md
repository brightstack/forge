# Proposal: Lead and Reviewer topology

BLUF: Forge should put one accountable Lead on each work-producing phase and one
independent Reviewer on its quality gate. The Lead builds the complete accepted
end state. The Reviewer chooses the phase-specific checks and Judges, validates
their evidence, and issues one verdict. Review feedback is signal, not new
authority or a replacement backlog.

## Scope and authority reconciliation

This proposal does not reopen the accepted routes or SDLC. `Work`, `Build`, and
`Bug Fix` remain the three routes. The Build lifecycle remains:

```text
Intake -> Spec -> Plan -> Build -> Verify -> Simplify -> Ship
```

Research remains an internal capability. Ship keeps its accepted PR-only scope.

Adoption requires these explicit reconciliations:

- `apps/forge/AGENTS.md`, `apps/forge/README.md`, and the current improvement
  `plan.md` still describe `Patch | Build Loop | Full SDLC`, a Research phase,
  `Planning`, and no Simplify phase. Implementation must migrate those surfaces
  to the controlling `index.md` and `decisions.md`; this proposal does not adopt
  their stale lifecycle.
- Replace `Phase Lead`, `Wave Builder Lead`, `Review Lead`, and `Reviewer Lead`
  in the target contract with `Lead` and `Reviewer`. `Worker` and `Judge` remain
  the two delegated roles.
- Revise VNEXT-D2's exclusive agent ownership. The Spec Lead owns coordination,
  integration, and the complete Spec candidate. Product, Design, Architecture,
  Research, and other specialists contribute domain judgment and may author
  whole files, but their returns are inputs to the Lead rather than separate
  authority. Recorded human decisions remain controlling.
- Amend VNEXT-D4's stable-interface implication. Accepted Spec and human
  decisions stay fixed, but implementation seams can be provisional, mocked,
  incomplete, and revised by the Lead inside that authority.
- Refine VNEXT-D8. A material gap in accepted intent or a one-way contract
  returns to its owner. An unspecified reversible implementation choice belongs
  to the Lead and does not create an authority gap.
- Preserve VNEXT-D5's one integrated verdict, but make the Reviewer responsible
  for an adaptive quality strategy instead of a fixed Judge roster.
- Close the comparative review's fresh-per-Issue versus Wave Lead experiment as
  an open topology choice. Fresh-per-Issue can remain a regression control, not
  the target execution model.

## Target topology

```text
Forge activates a phase
  -> Lead plans, delegates, inspects, and integrates
       -> Workers own bounded meaningful outcomes
       -> one exact phase candidate
  -> Reviewer selects checks and read-only Judges
       -> validates and reconciles evidence
       -> one verdict
  -> pass, repair, rethink, or human decision
```

`Lead` is an assignment, not another permanent persona. The phase's accountable
domain specialist normally fills it. The Lead owns candidate quality even when
Workers authored parts of it. The Reviewer owns independent judgment and the
gate. Workers can edit and test within a bounded outcome. Judges remain read-only
and return evidence, never verdicts or repairs.

There is no Review per Issue, Worker, file, or finding. A Wave produces one
integrated candidate and receives one Review. Issues remain planning, coverage,
and human-verification units. They do not dictate agent sessions or code
boundaries.

## Authority hierarchy

1. Recorded human decisions and the accepted intent expressed by the Spec are
   absolute. Agents cannot silently reinterpret, weaken, strengthen, or trade
   them away. Exact names, fields, behaviors, ACs, NFRs, constraints, and
   non-goals are binding when the Spec states them. A Spec artifact may be
   repaired by the appropriate specialist when accepted human intent already
   determines the correction; that repair creates a new Spec candidate and
   invalidates affected downstream review without changing authority.
2. Applicable repository harness, architecture rules, code style, UI guidance,
   security rules, and test commands are mandatory authority. When an artifact or
   candidate conflicts with authority, the Lead dispatches the appropriate
   specialist to bring it into compliance: Product Manager for Product Spec,
   Designer for Design Spec, Engineer or Architect for Technical Spec and Build,
   or another domain specialist when earned. Return `READY_FOR_USER` only when a
   compliant repair requires changing, adding, or materially reinterpreting an
   accepted human decision.
3. Accepted Plan and Issues map outcomes, obligations, risks, dependencies, and
   proof. Plan creates the complete Issue graph before Plan Review. Build may
   regroup and sequence reviewed Issues, revise provisional seams, and create
   ephemeral Worker tasks, but it cannot add Issues.
4. Implementation choices belong to the Lead and Workers when authority leaves
   them open. The Spec should describe the required end state, not every class,
   helper, internal boundary, or unit test.
5. Logs, tests, Worker returns, and Review findings are evidence. None can create
   or amend a requirement.

## Shared state and artifacts

| State | Contents | Mutation rule |
| --- | --- | --- |
| Authority | Recorded human decisions and the accepted intent expressed by the current Spec | Human decisions are frozen. A Lead-routed specialist repair may correct the Spec within that intent, producing a new candidate and invalidating affected downstream review. Any semantic change requires human approval. |
| Planning | Plan, Issues, dependencies, provisional seams, Wave composition | Plan Lead controls the complete graph through Plan Review; Build may change runtime sequencing and ephemeral Worker tasks, not the Issue set |
| Execution evidence | Logs, assumptions, discoveries, commands, test results, Worker returns, rejected approaches | Append facts; never treat them as authority |
| Candidate | Exact integrated artifact or source state presented to Review | Only the Lead publishes it; any change invalidates the prior verdict |

Use a cheap boundary check instead of a continuous semantic monitor. At Spec
acceptance, record the exact protected files and their repository-native content
identity. Check them before Build, Review, every repair continuation, Simplify
closure, and Ship. An unexplained change blocks the gate. A Lead-routed Spec
repair replaces the accepted candidate and triggers affected re-review; do not
auto-revert it or infer approval. Continuous semantic monitoring stays out of the
first version.

## Phase behavior

- **Intake and Spec:** Use the Grill Me and Wayfinder posture. Retrieve available
  facts first, identify the current consequential decision frontier, ask focused
  questions with a recommendation, and prototype when experience answers a
  question faster than discussion. Record the human answer once. Stop asking
  when remaining uncertainty is reversible Lead judgment. The Spec captures
  outcomes, behavior, ACs, NFRs, terms, constraints, and non-goals without
  attempting to describe the full implementation. The Spec Lead may delegate
  whole Product, Design, Technical, or research outcomes, then inspect and
  integrate one coherent bundle. It may edit for bundle coherence but routes a
  material domain correction to the appropriate specialist. Specialist judgment
  does not override a recorded human decision. The Reviewer checks decision
  provenance, contradictions, completeness, proportionality, and required
  structure or links without inventing missing intent. Findings return to the
  Spec Lead, which dispatches the relevant domain specialist to repair its
  contribution and then integrates a new complete Spec candidate.
- **Plan:** The Lead maps every accepted obligation to meaningful outcomes and
  credible proof. Plans and Issues stay legible to humans and specialist agents,
  but avoid file-level task trees and fixed staffing. The Reviewer checks
  traceability, feasibility, proportionality, harness fit, and whether the Plan
  leaves reversible choices to Build.
- **Build:** The Lead reads the complete authority and harness, makes a tactical
  plan, and delegates only coherent outcomes. UI, API, background jobs, or other slices
  can proceed concurrently against a provisional contract, mock, fixture, or
  stub. Intermediate work can be incomplete or broken. The Lead owns hot seams,
  resolves mismatches, integrates the full candidate, and runs cumulative proof
  before Verify.
- **Verify:** The Reviewer defines the quality strategy for the exact integrated
  candidate. Spec compliance and harness compliance are mandatory dimensions.
  The Reviewer runs applicable mechanical checks and commissions focused Judges
  for material risks such as behavior, security, data integrity, UI quality, or
  overengineering. A Wave uses a dedicated Spec Compliance Judge; the Reviewer
  can cover that lens directly for a small candidate. Judge count otherwise
  follows risk, not Worker or Issue count. When UI is in scope and an accepted
  Design Spec, mock, screenshot, prototype, or other visual reference exists, the
  Reviewer must dispatch a Visual QA Judge to inspect the rendered product against
  that authority. The Judge captures representative states and breakpoints and
  checks material fidelity, hierarchy, spacing, typography, alignment, overflow,
  clipping, overlapping text, contrast, and obvious responsive defects. The goal
  is professional visual quality and recognizable fidelity, not pixel-perfect
  reproduction unless the accepted authority explicitly requires it.
- **Simplify:** A Lead removes incidental complexity without changing behavior.
  If source changes, the same Reviewer checks authority integrity, affected proof,
  and preservation of the complete accepted outcome before Ship. Semantic change
  returns to Build.

## Build and repair loop

1. The Lead checks accepted authority and project harness before source work.
2. The Lead gives each Worker an outcome, authority pointers, provisional seam,
   write boundary, proof, and stop condition. A Worker can recommend a seam
   change; only the Lead integrates it.
3. Parallel work can remain temporarily incompatible. Shared hot seams use one
   owner or serialized integration. Worker branches are not review candidates.
4. The Lead integrates one candidate and proves the complete end state, not only
   each delegated slice.
5. The Reviewer returns one admitted finding set inside the canonical Review
   Report. Each issue-like Finding carries explicit Reviewer provenance, type
   `Bug` or `Feedback`, priority `High`, `Medium`, or `Low`, and authority and
   evidence pointers. Findings never enter the Plan Issue graph or change
   accepted scope. The Lead validates each item against authority and evidence,
   accepts sound findings, and disputes invalid ones with concrete proof. Use
   `Bug` only when behavior is clearly broken. Use
   `Feedback` for Spec deviation, code or UI quality, harness compliance,
   overengineering, missing evidence, and anything else that is not clearly a
   behavioral bug. Type and priority are independent: an out-of-Spec finding can
   be High-priority Feedback. Findings are signals inside the complete outcome,
   not new requirements or the scope of the next round. The Lead chooses whether
   to fix, address differently, or cancel each Finding and records its rationale
   in the repair plan. It routes accepted repairs to the appropriate specialist;
   Reviewers and Judges never repair their own findings. A suggested repair is
   advisory unless authority dictates the exact solution. A correction requiring
   new or changed accepted behavior returns to the human rather than being
   laundered through Review.
6. Every repair loop begins again from the full Spec, decisions, harness,
   candidate, Plan, and accepted behavior. The Lead updates its whole-outcome
   plan, makes coherent corrections, reruns invalidated and regression proof,
   and publishes one integrated candidate. It never optimizes the code for the
   report alone.
7. The same Reviewer reviews the entire new candidate against the complete
   accepted outcome, harness, and relevant quality risks. It also checks prior
   finding closure and may reuse evidence that remains valid, but the next
   review is never scoped to finding IDs or changed files. Newly exposed defects
   are recorded as new, uniquely identified Findings in that repair round of the
   same Review Report.

Allow at most three repair loops after the initial verdict; there is no fourth.
Return `RETHINK` earlier when the same High-priority failure recurs, a repair
introduces another High-priority regression, scope or blast radius grows, or the
mechanism no longer supports a credible whole-outcome correction. After the
third repair candidate, any remaining High or Reviewer-upheld blocking Medium
mandates `RETHINK`. Use `READY_FOR_USER` only when an exact authority or
accepted-intent decision is required. A disputed finding gets one evidence
exchange; an unresolved authority interpretation returns `READY_FOR_USER`, while
any other unresolved material defect returns `RETHINK`.

## Review Findings and priority policy

| Priority | Admission rule | Gate effect |
| --- | --- | --- |
| High | Any demonstrated mismatch with an explicit Spec or human decision; unauthorized authority change; invalid candidate or proof boundary; critical safety, security, or data-loss defect | The underlying problem blocks unless the Lead proves the finding invalid, stale, or already resolved, or the human changes its authority. The Lead still owns the remedy. |
| Medium | Reachable or reasonably probable, materially harmful, supported by direct evidence or a decisive check, and correctable inside scope without disproportionate machinery | The Lead must disposition it and may cancel it with rationale. The Reviewer may accept the cancellation or reopen it with evidence that addresses that rationale. |
| Low | Nit, preference, speculative future concern, equally valid tactic, low-materiality case, or disproportionate correction | Advisory. The Lead may fix, defer, or cancel it; it never starts or extends repair. |

`High | Medium | Low` replace `P0 | P1 | P2` in Forge artifacts. Out-of-spec
is High even when operational impact is small. Record operational impact
separately so a naming mismatch and data loss do not look equivalent. Every High
or Medium Finding cites the controlling authority or harness rule, trigger,
evidence, impact, and smallest known in-contract correction. The correction is a
recommendation, not an instruction. Review priority cannot create scope.

The Reviewer reads every Lead cancellation rationale before the next verdict. It
may reopen or reprioritize a Finding only by addressing that rationale against the
new complete candidate and evidence; it cannot keep a loop alive by restating its
preferred solution. Finding disposition never overrides reality: canceling a valid Spec
violation does not make the candidate compliant, and fixing a problem differently
from the recommendation is valid when the candidate reaches the accepted end
state.

A failing required formatter, linter, typecheck, build, or other mechanical
harness command blocks its gate without turning every emitted nit into Medium.

## Testing and gates

Prefer early behavioral, BDD, integration, or contract proof when it clarifies
the end state and lets parallel Workers build against a useful seam. Add focused
unit proof as parsers, policies, state machines, calculations, transformations,
and regressions become concrete. This is a default form, not a required order or
test-count target. The Lead and Reviewer choose evidence from the actual risk.

A semantic gate passes only when:

- the accepted authority boundary is intact;
- the exact candidate satisfies every explicit Spec obligation;
- applicable harness, style, UI, lint, type, build, and test checks pass;
- no unresolved High, Reviewer-upheld blocking Medium, or authority gap remains;
  and
- the Reviewer issues one verdict for that candidate.

## Minimum acceptance and evaluation

Before locking the topology, prove these cases:

- An unapproved edit to an accepted Spec is caught mechanically at the next
  boundary.
- Code that uses a different explicitly specified field or domain name receives
  High priority even when tests pass.
- A Lead can revise subissues and a provisional API inside the Spec without a
  human gate, while an AC or NFR change stops for approval.
- Coupled UI and API Workers build concurrently against a mock, integrate once,
  and receive no per-Worker or per-Issue Review.
- A Reviewer rejects a repair that closes its original finding but breaks a
  different accepted behavior or harness rule, because every repair round reviews
  the complete outcome rather than only prior findings.
- A probable material defect becomes Medium, the Lead can cancel it with a
  proportionality rationale, and the Reviewer must address that rationale before
  reopening it. A Low nit or speculative overengineering recommendation cannot
  keep the loop alive.
- A UI candidate with accepted visual authority is rendered and inspected by a
  Visual QA Judge; material mock drift, overlapping or clipped content, and
  obvious responsive failures cannot pass on code-level evidence alone.
- Intake asks only consequential questions, records the answers, and leaves
  reversible implementation detail to the Lead.

Run the cases against one solo task, one coupled Wave, and one repair scenario.
Track escaped Spec violations, harness violations, integration defects, repair
rounds, human turns, elapsed time, tokens, and artifact count. Adoption requires
zero candidate passes with a demonstrated Spec deviation and no per-Issue review
topology.
