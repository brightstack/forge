# Forge v1 Spec

Forge gives an agent a small, reliable way to deliver software work without
turning every request into a project or every project into ceremony.

## Problem

The current loop can over-plan small work, let Managers enter specialist work,
promote Review concerns into requirements, run too many reviews, and spend large
token and time budgets before shipping. CLI-driven agents also perform unevenly
and should not define the workflow.

## Outcome

An agent can invoke Forge with a request and recorded authority. Forge selects the
smallest credible path through:

```text
Intake -> Research -> Plan -> Build -> Verify -> Ship
```

The run exposes its current phase, direct artifacts, Issues, Wave candidate,
evidence, blockers, next action, and exact shipping authority. Native subagents
perform specialist work by default. File records survive agent context changes.

## Required behavior

### Right-size the route

- Forge exposes exactly `Patch`, `Build Loop`, and `Full SDLC` as user-facing
  route names. Each is a profile through the canonical lifecycle, not a separate
  lifecycle.
- Intake recognizes supplied authority, recommends the smallest credible route
  with a concise reason and expected shape, and records the user's selection.
  Manual choice wins.
- An agent may report `ROUTE_MISMATCH: UNDER` or `ROUTE_MISMATCH: OVER` and
  recommend a switch when observed scope differs from Intake. It does not switch
  silently, and an accepted switch preserves valid work and artifacts.
- Research activates only for a factual unknown. A Bug starts with reproduction
  or direct observation and root-cause tracing before repair planning.
- Plan creates only missing semantic authority. Clear or already-accepted work
  skips redundant artifacts and gates.
- Design activates only for a significant UX change or an explicit user request.
  Architecture follows Design when Design is active.
- A material unresolved user decision stops consequential Build. Reversible local
  tactics do not.

### Route contracts

- `Patch` uses one Builder for a tiny, local, reversible change. The Builder
  briefly plans, implements, self-checks, and reports. Independent Review is
  conditional on risk, uncertainty, or explicit request.
- `Build Loop` uses the same Builder to plan, build, self-check, and continue
  delivering one coherent ticket or Issue after Review feedback. One independent
  Reviewer evaluates the candidate and performs targeted closure.
- `Full SDLC` adaptively uses product definition, Technical Design, Delivery
  Planning, several Issues, Waves, integration, Review, and Final Verify only as
  accepted scope and risk earn them.

### Preserve ownership

- Product owns the problem, accepted outcome, scope, and Spec.
- Design owns experience and Design Brief when activated.
- Engineering owns the senior-engineer Technical Design, Issue seams, Build, and
  integration. The Technical Design covers APIs, entities, components, flows,
  seams, trust boundaries, migrations, tradeoffs, operations, NFRs, and
  validation implications as applicable.
- Independent Reviewers own Build Loop or Wave findings. Independent QA owns
  Final Verify when activated.
- Every specialist writes its artifact directly. The Manager only orchestrates
  and records facts, except that it may mechanically project a simple explicit
  human decision near-verbatim into its obvious destination as an attributed
  scribe. Judgment-bearing artifact changes return to the specialist owner.
- `decisions.md` remains immutable audit authority. Ordinary agents receive
  accepted artifacts and relevant decision IDs rather than the entire history.

### Build in dependency-ready Waves

- Issues express coherent outcomes, acceptance, proof, and only real start-now
  dependencies.
- A Builder can receive one Issue or a compatible bundle. The Builder inspects
  code, writes a concise plan-mode `plan.md`, builds, self-checks, fixes failures,
  publishes an exact source identity, and writes immutable `result.md`. A normal
  plan stays near 250 words unless real complexity earns more.
- Builders deliver professional-quality work. They exercise craft through smart,
  conventional, reversible choices that build on accepted authority without
  changing or strengthening it. Missing implementation prescription is latitude,
  not permission to ship a literal minimum.
- An assigned integration Builder combines valid results and pins one exact Wave
  candidate.
- One independent Review checks that candidate for correctness, repository
  standards, simplicity, craft, evidence, and triggered security or visual risks.
  UI components and material UI changes also activate a professional taste lens
  inside that Review.
- The Reviewer must also check accepted artifacts and reject invented
  requirements, cases, guarantees, or compatibility obligations.
- Up to three continued delivery candidates are available while the evidence
  converges. The same Builder and Reviewer retain their roles and contexts.
- Review feedback returns every admitted finding together to the original Builder.
  It never becomes a new repair ticket or a new agent. Every continuation still
  delivers the original accepted ticket. The Builder may `ACCEPT` or
  evidence-backed `DISPUTE` findings. Targeted closure checks finding resolution,
  original-outcome preservation, and the changed blast radius without reopening
  general Review.
- Continuation 2 requires an open original finding or local correction regression
  under a different supported hypothesis. Continuation 3 requires a narrower,
  better-understood, demonstrably converging correction. Repeated mechanisms,
  growing blast radius, equal-or-higher regressions, authority or Architecture
  changes, contradictory evidence, or failed continuation 3 stop the loop. P2
  findings and nits never extend it.

### Verify and Ship honestly

- Final Verify activates only for meaningful cumulative or high risk, a distinct
  environment, or final-only proof. Full SDLC normally runs it once over the
  complete exact candidate after all Waves pass.
- Build Loop may have the independent Reviewer exercise the accepted journey
  when no distinct proof boundary remains.
- QA reuses credible current evidence and runs the real integrated checks the
  accepted outcome requires.
- Source failure returns affected Issues and the complete ticket to the original
  Builder. Authority failure returns to Plan. Environment-only failure reruns the
  affected proof.
- Ship performs only the recorded authorized action and never equates a local
  branch, PR, merge, deployment, and production completion.

### Stay portable

- Native host subagents and models are primary.
- The Forge CLI supplies safe file mechanics and a generic caller-supplied agent
  command as fallback.
- A host limitation is reported as a limitation. Forge does not pretend to
  message, stop, or verify a native agent when the host exposes no such control.

## Success criteria

1. A clear small request can complete without mandatory Research or full Plan
   artifacts.
2. Full SDLC can schedule independent Issues in parallel from a validated
   dependency graph and Review each integrated Wave once.
3. No Manager output substitutes for a specialist artifact or judgment.
4. Review cannot add accepted behavior or proof without traceable authority.
5. When its trigger exists, one Final Verify binds observed proof to the complete
   exact candidate without repeating valid source Review or checks.
6. Guided and Auto runs stop at the correct recorded authority boundary.
7. The standard-library CLI passes deterministic tests for records, Issue state,
   dependency readiness, validation, and generic fallback-agent lifecycle.

## Non-goals

- A standalone app, UI, API, service, database, or durable workflow engine.
- Provider-specific Codex, Claude, Cursor, or model adapters.
- A universal scheduler that infers semantic dependencies or professional truth.
- Mandatory fan-out, fixed agent counts, Review per Issue, or unbounded
  continuation.
- Automatic PR creation, merge, deployment, publication, or production mutation.
- Replacing the existing shared Agent Loop during Forge v1 Build.
