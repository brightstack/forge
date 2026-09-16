# Forge v1 Technical Design

Forge is a file-based SDLC harness plus standard-library mechanics. The host
agent interprets three routes and uses native subagent controls. Forge does not
embed a semantic workflow controller.

## Context and package boundary

```text
apps/forge/
├── AGENTS.md and README.md
├── agents/                    # professional ownership contracts
├── skills/forge/              # router, workflow references, and templates
├── skills/forge-*             # substantial craft guidance
├── forge/                     # Python mechanics and fallback agent process
├── bin/forge                  # executable entry
├── tests/                     # deterministic mechanics
├── evals/                     # semantic behavior cases
└── docs/plans/active/build/   # accepted authority and evidence
```

The root `AGENTS.md` adds one App Dispatch row. Forge does not modify or replace
the shared Agent Loop. The Python package uses the standard library only.

## Route and control model

All delivery uses the locked stage vocabulary:

```text
Intake -> Research -> Plan -> Build -> Verify -> Ship
```

Intake exposes exactly `Patch`, `Build Loop`, and `Full SDLC`. It writes a
recommended route, concise reason, expected shape, and user-selected route. A
manual selection wins. A later agent can return `ROUTE_MISMATCH: UNDER|OVER`
with evidence and a recommendation, but only the user changes the selected
route. Accepted artifacts and completed proof carry forward when still valid.

- Patch uses one Builder and conditional Review.
- Build Loop uses one Builder, one independent Reviewer, and up to three
  convergence-gated Builder continuations from the same pair.
- Full SDLC adaptively activates missing product, Design, Technical Design,
  Delivery Plan, Issue, Wave, integration, and final-proof work.

Auto remains an authority envelope for pauses and terminal actions. It does not
select or silently change a route.

## Domain entities and artifact contracts

- **Decision** - immutable attributed human authority with an ID, status, source,
  consequence, supersession, and projection destination when applicable.
- **Spec** - current product outcomes, scope, acceptance criteria, and non-goals.
- **Design Brief** - consequential experience decisions, active only for a
  significant UX change or explicit user request.
- **Technical Design** - the proportionate senior-engineer technical contract.
  It describes current and target architecture, APIs and interfaces, entities
  and data model, components and ownership, flows, integration seams, security,
  rollout, decisions and tradeoffs, failure modes and operations, NFRs, and
  validation implications as applicable.
- **Delivery Plan and Issue** - delivery seams, real dependencies, ownership,
  Waves, and proof mapped to accepted authority.
- **Build plan and result** - concise Builder tactics and immutable candidate
  evidence. A normal plan stays near 250 words unless complexity earns more.
- **Review and Verify result** - independent findings or observed proof bound to
  one exact candidate.

Templates define these Markdown interfaces. They are strong enough to prevent
meaningful divergence but do not prescribe reversible implementation tactics.

## Authority and decision flow

Authority flows forward and is checked in reverse:

```text
human decisions -> Spec -> Design when active -> Technical Design when active
-> Delivery Plan and Issues -> implementation and proof
```

`decisions.md` is append-only audit authority. Current strong artifacts project
the accepted decisions downstream agents need. The Manager may apply a simple
explicit user decision as scribe only when the destination is obvious, the text
is near-verbatim and non-conflicting, and no professional inference is needed.
The decision entry records where it was applied. Product owns judgment-bearing
acceptance changes, Design owns experience changes, and Architecture owns
Technical Design, NFR, and technical-contract changes. No semantic
synchronization service is added.

Ordinary assignments point to current accepted artifacts plus relevant decision
IDs. Plan Review and implementation Review verify both forward coverage and
reverse support. Unsupported material obligations return as `AUTHORITY_GAP` to
their owner rather than becoming Reviewer-created requirements.

## Runtime and dispatch interface

The invoking Manager follows this order:

1. Use native host subagents and model selection when they satisfy the assignment.
2. Use the generic CLI agent process when native delegation is unavailable,
   lacks a requested capability, or the user explicitly asks for it.
3. Report unsupported live messaging or intervention instead of inventing
   control.

Every assignment is a compact pointer packet: role, outcome, accepted authority,
candidate or diff, required reads, owned paths, decisive proof, stop conditions,
and return shape. Substantive work is written to the owned artifact. The return
packet contains only result path, exact candidate, verdict, and decisive check
facts. Retained Builder and Reviewer contexts are resumed for repairs and closure.

The fallback accepts a caller-supplied command. It contains no provider names or
provider-specific flags. Pointer input arrives on stdin and is not persisted.
Transient process state lives below `${TMPDIR}/forge-agents-<uid>/`.

## Build and Review control flow

A Patch Builder plans briefly, changes source, self-checks, and writes a result.
Risk, uncertainty, or explicit user instruction can add independent Review.

A Build Loop Builder writes one concise plan, builds the full accepted ticket,
self-checks, and returns an exact candidate. One independent Reviewer performs
Authority Compliance, correctness, repository-standard, simplicity, craft, and
evidence checks. The same flow applies to each exact integrated Full SDLC Wave.
Specialist Review activates only for a named risk or capability gap.

Review feedback returns to the original Builder as one batch attached to the
complete ticket. The Builder can `ACCEPT` or evidence-backed `DISPUTE`; the same
Reviewer adjudicates and closes. At most three complete continued delivery
candidates may return:

1. Continuation 1 addresses all concrete, local, material findings together.
2. Continuation 2 requires an open original finding or local correction regression and a
   different supported hypothesis.
3. Continuation 3 requires a narrower, better-understood, demonstrably converging
   correction.

Two similar failed fixes, growing blast radius or findings, an equal-or-higher
regression, authority or Architecture change, contradictory evidence, or failed
continuation 3 stops the loop. P2 findings and nits do not consume or extend it.
Targeted closure checks finding resolution, original-ticket preservation, and
the changed blast radius without reopening general Review.

## Verify and Ship flow

Final Verify activates for meaningful cumulative or high risk, a distinct
environment, or proof available only on the complete candidate. Full SDLC
normally runs one Final Verify after all Waves. Build Loop can ask its independent
Reviewer to exercise the accepted journey when no distinct proof boundary
exists. Current credible evidence is reused; only missing, stale, invalidated,
contradictory, cumulative, or final-only proof reruns.

Ship updates factual state and returns the exact candidate, proof boundary,
known limitations, and next external owner. It dispatches no agent, mutates no
candidate, repeats no proof, and performs no PR, merge, deployment, or publication.

## Durable run protocol and data model

A run starts with `index.md` and append-only `decisions.md`. It creates only
activated phase folders. Plan holds accepted semantic artifacts and one mutable
Issue file per Issue. Build holds Waves, direct Build results, and direct Review
reports. Verify holds a final QA report only when activated. Ship holds the
factual handoff and optional external records.

The Issue directory is the only status. Each Issue file carries its ID, kind,
dependencies, accepted outcome, authority pointers, and proof contract. The
normal Full SDLC path is:

```text
backlog -> planned -> in-progress -> review -> verify -> ship
```

Build Loop may move a passing reviewed Issue directly from `review` to `ship`
when its Reviewer performed the accepted journey and no distinct Final Verify
was earned. An accepted cancellation can move a non-shipped Issue to
`cancelled`. Review or Final Verify source failure returns affected Issues to
`in-progress`.

Dependencies are Issue IDs recorded only in the dependent Issue. The ready-set
mechanic validates missing IDs and cycles, then returns planned Issues whose
dependencies reached a satisfying prior gate. The Manager chooses a Wave from
that factual ready set. Durable references use stable IDs and resolve exactly one
status path.

## Candidate identity and interfaces

Every Build result, Wave index, Review, continuation closure, Final Verify, and Ship
record cites the exact commit or artifact identity it describes. A source change
invalidates earlier conclusions only for affected proof. The latest passing
targeted closure candidate is the effective reviewed candidate.

The CLI remains:

```text
forge init LOOP_ROOT --control guided|auto --authority SOURCE --terminal TERMINAL
forge append --kind log|decision --heading HEADING FILE
forge issue move --loop ROOT --id ID --from STATE --to STATE --evidence PATH [--wave PATH]
forge issue ready --loop ROOT [--json]
forge check artifact --class CLASS PATH...
forge check loop LOOP_ROOT [--wave PATH]
forge agent start --name NAME --cwd PATH --result PATH -- COMMAND...
forge agent status NAME
forge agent wait NAME [--timeout SECONDS]
forge agent stop NAME
```

The signatures define syntax, not semantic authority. Mechanics never classify
routes, judge findings, decide convergence, or choose a phase.

## Security, failure modes, and operability

- Resolve mutation paths below the declared loop root and reject traversal or
  symlink escape.
- Use atomic rename for Issue moves and a file lock plus durable append for
  shared records.
- Keep transient process data outside the repository and never persist pointer
  input.
- Bind evidence and verdicts to exact candidates. Treat source, authority,
  environment, and runtime failures as different return routes.
- Preserve direct artifacts across agent or process loss. Runtime liveness does
  not imply semantic completion.
- Do not add recovery protocols, leases, status services, provider adapters,
  automatic decision synchronization, or duplicate JSON state.

## Validation implications

Deterministic tests cover only file mechanics, safe transitions, dependency
readiness, candidate binding, and fallback-process behavior. They do not assert
prompt prose or semantic route judgment. Markdown semantic evals cover routing,
decision projection, authority compliance, Technical Design quality, concise
Builder plans, convergence stops, and complete-ticket outcome preservation.

## Key tradeoffs

- Human-readable direct artifacts preserve authority across context changes at
  lower complexity than a semantic workflow engine.
- Conditional phases, Review, and Final Verify reduce cost while named triggers
  preserve rigor.
- Three Builder continuations permit evidence-backed convergence without a generic
  repeat-until-pass loop.
- Mechanical decision projection keeps current authority usable without letting
  the Manager perform specialist judgment.
