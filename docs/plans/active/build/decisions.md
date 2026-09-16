# Forge v1 decisions

These accepted user decisions bind Forge v1 until the user explicitly supersedes
them. New findings can propose a change but cannot silently rewrite this record.

## FORGE-D1. Name and location

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-18

The harness is named `Forge` and lives under `apps/forge`. Use `forge` for its
Python package, executable, and CLI command. Do not use the previous working name.

## FORGE-D2. Agent-invoked, native-first

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-18

Forge is invoked and operated by an agent. It is not a standalone application,
server, daemon, database-backed scheduler, or product runtime. Native host models
and subagents are the primary execution path. The CLI supplies mechanics and a
provider-neutral fallback only when native delegation is unavailable, lacks a
required capability, or the user explicitly requests the fallback.

## FORGE-D3. Canonical lifecycle

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-16

Use exactly:

```text
Intake -> Research -> Plan -> Build -> Verify -> Ship
```

Review, Waves, integration, repair, agents, models, and CLI execution are details
inside those six stages. They do not rename or expand the top-level lifecycle.

## FORGE-D4. Plan is adaptive

- Status: SUPERSEDED BY FORGE-D13
- Owner: User
- Accepted: 2026-08-18

Plan can include Spec, Design Brief, Technical Design, Project Plan and Issues,
dependency sequencing, Verification Plan, one lightweight consistency Review,
and a human or authorized Auto gate. Create, repair, reuse, or skip each artifact
according to the smallest credible route. A Builder's tactical `plan.md` is not
the Plan phase and cannot change accepted meaning.

## FORGE-D5. Clarification is cross-cutting

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-18

Clarification is an action at any phase, not a seventh stage. Retrieve facts.
Route professional decisions to their owner. Ask the accountable human before a
material intent, scope, contract, proof, risk, authority, or one-way choice.
Choose reversible, precedent-backed tactics autonomously.

## FORGE-D6. Manager does not join specialist work

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-18

The Manager routes, schedules, dispatches, monitors, messages, pauses, replaces,
and records factual state. Assigned Builders integrate source. The Manager never
authors or repairs specialist artifacts, changes or integrates source, reviews,
performs QA, or decides which specialist is technically right.

## FORGE-D7. Wave Review and one Final Verify

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-18

Review happens once per exact integrated Wave candidate, not per Issue or Build
assignment. Each Wave receives at most one repair batch for every admitted P0 and
material, non-nit P1, followed by targeted closure from the same Reviewer. One
independent Final Verify runs after every planned Wave passes Review.

## FORGE-D8. Auto is an authority envelope

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-18

Guided and Auto use the same lifecycle, owners, evidence, and stop conditions.
Auto records its authority source, authorized terminal, and permitted external
actions. It can continue through reversible work inside accepted authority. It
cannot change accepted intent, cross an unowned one-way decision, weaken proof,
or infer permission for a PR, merge, deployment, publication, production
mutation, or other external action.

## FORGE-D9. Keep v1 thin

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-18

Use the Python standard library only. Do not add a server, UI, database,
provider-specific adapter, semantic workflow controller, or duplicated state.
Dependencies live once in Issue metadata. Scripts enforce mechanics, not
professional judgment.

## FORGE-D10. Ship boundary for this Build

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-18

Ship for Forge v1 means a clean committed branch and factual handoff. This Build
does not authorize PR creation, merge, deployment, publication, or release.

## FORGE-D11. Recommended and selected routes are distinct

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-19

Intake always records Forge's recommended smallest credible route and the route
actually selected. An explicit manual route wins and records why it differs.
Auto controls pauses, terminal authority, and permitted external actions; it
does not imply the full process or override routing proportionality.

## FORGE-D12. Research is usually embedded

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-19

Keep lightweight current-state, precedent, and state-of-the-art research inside
Intake or the accountable Product, Design, or Architecture assignment. Activate
the distinct Research stage only for a substantial unknown that needs an
independent question, evidence record, or research artifact. The canonical
lifecycle name remains unchanged.

## FORGE-D13. Plan sequence, authority, and one Review

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-19
- Supersedes: FORGE-D4 where artifact names or Review scope conflict

Plan conditionally uses:

```text
Spec -> Design when needed -> Architecture -> Delivery Plan and Issues
-> one automatic Plan Review -> human or authorized Auto gate
```

Architecture follows Design whenever Design is active because experience choices
can constrain technical decisions. Product Spec alone originates product
acceptance criteria. Design originates only in-scope experience constraints
linked to accepted criteria. Architecture alone originates justified NFRs and
technical constraints. The Delivery Plan and Issues reference those contracts;
they do not create or strengthen them. Builders, Reviewers, QA, and the Manager
cannot add acceptance criteria, NFRs, cases, or guarantees. A material missing
contract returns to its owning specialist or the user.

Verification strategy lives in `plan.md` and applicable Issues unless complexity
earns a separate accepted artifact. One automatic read-only Plan Reviewer checks
forward and reverse traceability across acceptance criteria, Design constraints,
Architecture/NFRs/required technical shape, Delivery Plan, Issues, dependencies,
and proof. It also checks consistency, feasibility, proportionality, absence of
requirement laundering, and concise artifact quality. It reports findings to the
owning specialist and never rewrites an artifact.

## FORGE-D14. One Wave Reviewer by default

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-19

Use one strong Wave Reviewer with combined Spec, Design, Architecture,
correctness, repository-standard, and simplicity lenses. The same Reviewer does
targeted closure after the single repair batch. Add specialist Reviewers only
for a concrete risk that the combined Reviewer cannot credibly cover.

## FORGE-D15. Impeccable is optional Design craft

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-19

Design may use the repository's existing live Impeccable skillset at
`apps/sam-ui/.agents/skills/impeccable/SKILL.md` when the accepted surface needs
its shaping, critique, or polish craft. Reference it; do not copy it. Impeccable
does not activate Design by itself and cannot expand Product scope or acceptance.

## FORGE-D16. Native context and model routing are host-owned

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-22

Forge requests the cleanest native subagent context available and sends a
pointer-only assignment with bounded ownership, exact candidate identity, checks,
and stop and return conditions. It does not paste or persist conversation history
or expected conclusions. When a host cannot isolate context, Forge uses the least
inherited context available and discloses the limitation.

Forge classifies work by semantic demand rather than provider name. The native
host maps that profile to its available agents, concrete models, effort controls,
and lifecycle operations. Use the cheapest adequate option for explicit
mechanical work and strong reasoning for architecture, ambiguous diagnosis,
consequential Review, or adversarial judgment. Runtime availability never changes
accepted scope, ownership, or proof.

## FORGE-D17. Bugs use bounded systematic debugging

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-22

A Bug Build reproduces or directly observes the failure, traces the executed path
backward through callers and data boundaries, tests one falsifiable root-cause
hypothesis, and makes the smallest supported root-cause fix. It uses canonical
Build records rather than a new phase or artifact. Environment failures remain
separate. After three materially different source-fix attempts fail against the
same observation, stop editing and return the architecture or assumption problem
to Plan or clarification.

## FORGE-D18. Behavioral evaluation is comparative and optional

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-22

Consequential Forge behavior or cost decisions may use matched trials between a
frozen Forge candidate and a no-Forge-guidance control. Use fresh native agents
and isolated workspaces when supported, evaluator-only outcome checks, multiple
cost-aware trials, and descriptive reporting of quality, latency, agents, and
tokens. Repository and system safety remain common to both arms. Missing host
telemetry is `unavailable`, never zero. Behavioral evaluation is not an
every-change delivery gate or a provider-specific runtime.

## FORGE-D19. Codex uses a high-reasoning floor

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-22

When Codex exposes the GPT-5.6 family, map Forge profiles as follows:

```text
mechanical -> gpt-5.6-luna high
standard   -> gpt-5.6-terra high
deep       -> gpt-5.6-sol max
```

Normal Forge work does not use low or medium Codex reasoning. Saving a small
number of reasoning tokens does not justify a weak attempt that consumes another
agent turn, correction, or redispatch. Lower effort remains available only when
the user explicitly chooses it or a behavioral evaluation is measuring it. This
is a Codex host mapping, not a provider requirement in Forge's generic runtime.

## FORGE-D20. High reasoning is the cross-host floor

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-22

Normal Forge agents use each host's high or strong reasoning tier as the minimum.
Deep Architecture, ambiguous diagnosis, consequential Review, and adversarial
judgment use the host's maximum quality tier. The Manager may select a cheaper
model for mechanical work, but not lower reasoning effort. Lower effort requires
an explicit user choice or a behavioral evaluation that is measuring it.

When a host does not expose a comparable effort control, choose an adequately
strong model for the semantic profile and disclose the limitation. Never lower
accepted scope, ownership, or proof because the preferred model or effort is
unavailable. FORGE-D19 remains the concrete Codex mapping under this general rule.

## FORGE-D21. Three routes through one lifecycle

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-22
- Supersedes: FORGE-D11 and FORGE-D13 where route terminology or activation conflicts

Forge exposes exactly three delivery routes: `Patch`, `Build Loop`, and
`Full SDLC`. They are profiles through the canonical lifecycle in FORGE-D3, not
separate lifecycles or new phase names.

- `Patch` handles a tiny, local, reversible change. One Builder plans briefly,
  implements, self-checks, and reports. Independent Review activates only for a
  named risk, unresolved uncertainty, or explicit user request.
- `Build Loop` handles one coherent accepted ticket or Issue. The same Builder
  plans, builds, self-checks, and repairs. One independent Reviewer checks the
  candidate and performs targeted closure.
- `Full SDLC` is the adaptive complete route for product definition, several
  Issues, dependencies, Waves, integration, or consequential cross-discipline
  decisions. It reuses accepted authority and creates only missing or earned
  artifacts.

Intake recommends the smallest credible route with a concise reason and expected
shape, then records the user's selected route. An explicit selection wins.
Agents may report `ROUTE_MISMATCH: UNDER` or `ROUTE_MISMATCH: OVER` with evidence
and recommend a different route. They do not switch routes silently. A user-
accepted switch preserves valid work and artifacts.

Lightweight research remains embedded. Distinct Research still requires a
substantial unknown or reusable artifact. Design activates only for a significant
UX change or an explicit user request. Architecture follows Design whenever
Design is active.

## FORGE-D22. Technical Design and Builder plans are proportionate

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-22
- Supersedes: FORGE-D13 where Architecture is characterized mainly as NFRs and constraints

Technical Design is the senior-engineer technical document for the accepted
change, not an NFR list. As applicable, it covers architecture and context,
current-system behavior, APIs and interfaces, entities and data model,
components and responsibilities, data and control flows, integration seams,
security and trust boundaries, migrations and rollout, technical decisions and
tradeoffs, failure modes and operability, NFRs and constraints, and validation
implications. It stays proportional, omits irrelevant sections, and never
invents product requirements.

A Builder's `plan.md` is concise plan-mode output. It records the understood
current flow, proposed approach and key files or seams, testing strategy, and
material risks or unknowns. A trivial change can use a few sentences. A normal
Issue stays near 250 words unless real complexity earns more. It does not become
ceremony, microscopic instructions, or a substitute for Builder craft.

## FORGE-D23. Decisions project into current authority without role collapse

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-22
- Supersedes: FORGE-D6 and FORGE-D13 only where they forbid mechanical decision projection

`decisions.md` is the immutable human-authority and audit record. Accepted
decisions are projected into the current strong artifact that downstream work
uses. The Manager may log and mechanically apply a simple explicit human decision
as scribe only when the destination is obvious, the text is near-verbatim,
the change is non-conflicting, and no professional inference is required. The
decision record names the destination and that the Manager applied it as scribe.

Product alone adds or changes acceptance criteria. Design alone changes
experience constraints. Architecture owns Technical Design, NFRs, and technical
contracts. Any judgment-bearing change returns to that owner. Do not add an
automatic semantic synchronization mechanism.

Ordinary agents receive accepted current artifacts and only the relevant
decision IDs, not the whole decision history. Plan Review and implementation
Review check that relevant accepted decisions were projected faithfully.

## FORGE-D24. Outcome-preserving Review, repair, Verify, and Ship

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-22
- Supersedes: FORGE-D7 and FORGE-D14 where repair count or Final Verify is unconditional

One combined independent Reviewer is the default. It checks Authority Compliance,
correctness, repository standards, simplicity and overengineering, professional
craft, and evidence. Authority Compliance traces both directions through:

```text
human decisions -> Spec -> Design when active -> Technical Design when active
-> Delivery Plan and Issues -> implementation and proof
```

An unsupported material gap is `AUTHORITY_GAP` for the owning specialist, never
an invented blocker. Specialist Review activates only for a named risk or
capability gap the combined Reviewer cannot credibly cover.

Build Loop and Wave Review permit at most three returned repair candidates. The
same Builder and Reviewer retain their roles and contexts. Every repair must
still deliver the original accepted ticket while addressing accepted or upheld
findings. The Builder may `ACCEPT` or evidence-backed `DISPUTE` a finding.
Targeted closure checks only finding resolution, original-outcome preservation,
and the repair blast radius. It does not reopen general Review.

Round 1 handles concrete, local, material findings. Round 2 continues only for
an open original finding or a local repair regression under a different supported
hypothesis. Round 3 continues only when the correction is narrower, better
understood, and demonstrably converging. Stop on two materially similar failed
fixes, growing blast radius or findings, an equal-or-higher severity regression,
an authority or architecture change, contradictory evidence, or failed round 3.
P2 findings, nits, and advisories never keep the loop alive.

Final Verify is conditional. Activate it for meaningful cumulative risk, high
risk, a distinct environment, or proof available only on the complete candidate.
Full SDLC normally runs one complete-candidate Final Verify after all Waves.
Build Loop may have its independent Reviewer exercise the accepted journey when
no distinct proof boundary exists. Reuse current evidence and do not repeat
source Review or valid checks.

Ship is a zero-agent factual handoff. It does not rerun proof, mutate the
candidate, open a PR, merge, deploy, or publish.

## FORGE-D25. Review feedback continues original Builder delivery

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-22
- Supersedes: FORGE-D24 where repair-candidate or repair-round framing conflicts

Review feedback does not create a repair ticket, repair agent, or assignment per
finding. The original Builder remains accountable for delivering the complete
accepted ticket. Resume that same Builder with the original ticket and every
admitted finding in one feedback batch.

The Builder evaluates the findings, resolves any disputes with the same Reviewer,
then continues the feature coherently. Its next result is another complete
delivery candidate. It must preserve and re-prove the original outcome, not only
make finding reproductions pass. The word `repair` may describe a source action;
it does not name an agent, work item, dispatch, or delivery objective.

Allow at most three convergence-gated Builder continuations per reviewed
candidate, never one continuation per finding. Continuation 1 handles all
admitted findings together. Continuations 2 and 3 exist only for an unresolved
original finding or a local correction regression with new evidence and a
demonstrably converging hypothesis. The same Reviewer performs targeted closure
without reopening general Review.

## FORGE-D26. Professional craft is bounded Builder latitude

- Status: ACCEPTED
- Owner: User
- Accepted: 2026-08-22
- Supersedes: FORGE-D24 where its general Craft lens lacks the UI taste trigger

Builders deliver professional-quality work rather than the literal minimum that
satisfies acceptance criteria. They exercise craft through smart, conventional,
reversible choices that build on the accepted Spec, active Design, Technical
Design, and repository standards without superseding, changing, or strengthening
them. Missing prescription grants latitude; it does not lower the quality bar.

Ponytail is lightweight judgment inside every Build, including small Builds. Its
reuse and simplicity ladder does not create a separate agent, stage, gate,
artifact, or mandatory browser pass. Proof remains proportional to the task.

When a candidate contains UI components or materially changes UI, the single
combined Reviewer activates a professional taste lens. It judges observable
hierarchy, composition, typography, spacing, states, interaction coherence, and
finish against accepted visual authority, repository taste, and conventional
professional quality. Personal preference and unaccepted visual direction cannot
create a finding or new requirement. A separate visual specialist still requires
a concrete accepted target or capability gap that earns its cost.
