# Forge vNext accepted decisions

These decisions are the current Forge contract. They supersede conflicting v1
workflow language without rewriting v1's historical Build evidence.

## VNEXT-D1 - Lifecycle

Forge exposes exactly three routes: `Work`, `Build`, and `Bug Fix`.

`Build` is the full SDLC and uses exactly `Intake -> Spec -> Plan -> Build ->
Verify -> Simplify -> Ship`. `Bug Fix` preserves that order with a Bug Spec and
proportionate depth. `Work` handles generic non-SDLC outcomes through a Work Spec
and only the planning, execution, verification, simplification, and shipping work
the outcome earns. Research is an internal capability activated when evidence is
missing, not a lifecycle phase.

Product, Bug, Work, Design, and Technical Specs are conditional parts of Spec.
Plan is a distinct downstream phase. The Build-phase Builder still performs its
own tactical implementation planning; the Plan phase does not prescribe its
internal execution topology.

## VNEXT-D2 - Flat Spec bundle

The `spec/` folder contains exactly one of `product.md`, `bug.md`, or `work.md`,
optional `design.md` and `technical.md`, and one `review.md`. One Spec Lead owns
coordination, integration, and the complete Spec candidate. It may dispatch a
Product Manager, Designer, Engineer, Architect, Researcher, or another earned
specialist to author or repair meaningful contributions, then integrates one
coherent bundle. Recorded human decisions and accepted intent remain controlling;
any semantic change returns to the human. The Spec Review lists the exact files
reviewed, one verdict, and any unresolved authority gaps. No other Spec lifecycle
record exists.

## VNEXT-D3 - Plan graph

Plan consumes accepted `spec/review.md` and produces the complete Issue graph,
exact authority pointers, proof, ordinal estimates, coupling, hot seams, and Wave
recommendations. One formal Plan Review covers the complete package. Plan
does not select runtime staffing, Worker boundaries, worktrees, or models.

## VNEXT-D4 - Build Lead and Workers

The Builder consumes the accepted Plan, thinks ahead about interfaces and
integration, makes its own tactical plan, and selects dependency-ready work. It
may delegate genuinely independent, outcome-oriented implementation tasks to
bounded Workers. A Worker assignment is a coherent slice such as "implement the
Settings page" or "create the Cable API against these dummy service contracts,"
not a disguised apply/edit command. Within its accepted outcome and interface
boundary, a Worker reads the relevant system, makes its own local plan, edits all
needed files, tests, debugs, and returns code plus evidence. Workers may proceed
concurrently against provisional contracts, mocks, fixtures, or stubs; their work
may remain temporarily incomplete or incompatible until integration.

The Build Lead owns task boundaries, shared contracts, sequencing, inspection,
integration, cumulative and cross-task proof, and the sole exact Wave candidate;
it does not own every edit. Workers cannot change accepted intent or shared
contracts without Lead approval, pass a gate, or publish the candidate. Worker
tasks and optional short-lived worktrees are ephemeral runtime coordination, not
durable Forge artifacts.

## VNEXT-D5 - One Wave Review verdict

Do not Review an Issue or Worker return independently. One Reviewer owns
Verify and must check implementation against every explicit accepted Spec
obligation and the applicable project harness. The Reviewer chooses mechanical
checks and may spawn task-focused, read-only Judges for code correctness, Spec
compliance, overengineering, security, data integrity, or browser QA. When UI has
accepted visual authority, a Visual QA Judge must inspect the rendered product
against it for material fidelity and visible defects; pixel perfection is required
only when explicitly specified. The Reviewer validates Judge evidence and owns
the sole verdict.

Admitted findings are issue-like records inside the Review Report, with explicit
Reviewer provenance, type `Bug` when behavior is clearly broken or `Feedback`
otherwise, and priority `High | Medium | Low`. They do not enter the Plan Issue
graph or change accepted scope. Priority does not prescribe the remedy. The Lead
may fix, address differently, or cancel a Finding with rationale in the repair
plan; the Reviewer reads that rationale before accepting or reopening it. Every
repair loop builds and reviews the complete outcome, not only prior findings.
Allow three repair loops after the initial verdict; no Low Finding starts or
extends one.

## VNEXT-D6 - Minimal binding mechanics

Bind each Wave to accepted `spec/review.md`, its exact Issues, one exact candidate,
cumulative proof, and one Review verdict. Before leaving Build, require every
accepted Plan Issue to appear in at least one Wave. Reuse repository-native identity to
detect unexpected changes to accepted Spec files; a Lead-routed specialist repair
within accepted human intent creates a new Spec candidate and invalidates affected
downstream review. Do not add another source-handoff, join,
compliance-attestation, or custom fingerprinting protocol. Unsupported material
change returns `AUTHORITY_GAP(owner, obligation)`.

## VNEXT-D7 - Semantic model tiers

Generic Forge exposes `mechanical | standard | deep`; the host maps them to
current models. The orchestration skill sets the available Worker envelope and the
active Lead routes Workers within it. Formal authority, Wave coordination,
Review, and Verify retain the host's strongest applicable reasoning floor.

## VNEXT-D8 - Simplicity and likely use

Simplicity is a product feature. Every artifact, agent, abstraction, field, and
gate must earn its existence. Every explicit Spec, AC, and NFR is implemented and
proved regardless of rarity. Probability applies only where accepted authority
leaves latitude: extra flows, hardening or recovery, future abstractions, optional
edge UX, and exploratory test breadth. Those are earned only by observation,
probability, high impact or safety, or a real platform constraint. Ambiguity that
changes accepted intent returns `AUTHORITY_GAP(owner, obligation)`; unspecified
reversible implementation choices belong to the Lead.

## VNEXT-D9 - Simplify after Verify

After Verify produces a correct candidate, Simplify removes incidental complexity
while preserving every accepted behavior and obligation. It applies the Ponytail
and execution principles, reruns affected proof, and returns semantic changes to
Build instead of smuggling them into cleanup.

Ship has one responsibility: create a pull request from the final verified and
simplified branch. It does not merge, deploy, release, modify production, or
perform post-release validation. The pull request carries the candidate summary
and existing proof; Ship does not introduce another review or acceptance phase.

## VNEXT-D10 - Small bundled kernel

Core Forge consists of one public orchestration skill with internal Intake, Spec,
Plan, Build, Debug, Verify, Simplify, and Ship subskills; the Build-loop protocol;
canonical artifact templates; bundled Impeccable, Ponytail, and execution
principles; and small support scripts.

Every runnable agent has a directory named for it with `instructions.md` as its
base prompt. Persona agents are Product Manager, Designer, Engineer, and
Reviewer, with Architect and Researcher available when their specialties are
earned. Their instructions include an expanded identity/persona section with a
BMAD-like personality matrix, mental models, principles, decision posture, and
domain judgment. `Builder` is an Engineer instance assigned the Build skill. A
Simplifier is another Engineer instance assigned the Simplify skill, and a
Debugger is an Engineer instance assigned the Debug skill; neither is a separate
agent definition.

Worker and Judge also have agent directories and base instructions, but they are
ordinary task-focused bots rather than personas. Their instructions define
mission, authority limits, task intake, evidence, and return behavior without a
manufactured personality. Builders spawn Workers for bounded execution.
Reviewers spawn read-only Judges for focused evidence and retain the sole
verdict. Bots receive only the task, authority, scope, tools, and proof needed for
their assignment.

Tests and evals may be extensive because they prove the kernel. They do not earn
duplicated product roles, wrapper skills, protocol prose, or artifact types.

## VNEXT-D11 - Preserve template semantics

The canonical Forge artifact templates retain their accepted purpose, core
structure, and information model. The kernel rebuild may move, rename, or
consolidate their files and may update references needed by the new layout. It
must not use that reorganization to redesign the artifacts, discard their
essential sections, add new protocol schemas, or relitigate their substance.

## VNEXT-D12 - Canonical ontology flows downstream

Ontology is an optional, structured part of the Spec end state. Include it only
when exact naming, domain semantics, entities, fields, operations, processes, or
lifecycles materially constrain the outcome. When present, use only the earned
subsections `Terms and Concepts`, `Entities and Required Names`, and `Processes
and Lifecycles`. Never invent entries or empty sections to complete the template.

A Product, Bug, or Work Spec may define business terms and processes. The
Technical Spec inherits those names without silently renaming them and may expand
them into exact technical entities, fields, relationships, operations, states,
and lifecycle rules. It may add technical-only names or mappings where upstream
authority leaves the technical representation open. It cannot override an exact
accepted name. A name such as `labels` is binding on Plan, Issues, Build, and
code when accepted as exact.

Design, Plan, Issues, Build, and code use the canonical vocabulary. A downstream
agent may not introduce a competing synonym for an established concept as a
local implementation choice. Spec and Plan Review check vocabulary consistency;
the Verify Spec-compliance Judges treat material terminology drift as a contract
failure. Simplify may normalize incidental synonyms without changing semantics.

## VNEXT-D13 - Issue authority and Reviewer provenance

The Plan Lead creates the complete Issue graph before the whole-package Plan
Review. A passing Plan Review freezes its Issue set and content; status-directory
moves may record execution state, but Builders, Workers, Reviewers, and Judges do
not add Issues. Downstream work pins the accepted Plan Review identity so
rewriting the Review cannot admit later Issues. Build may regroup reviewed Issues
and create ephemeral Worker tasks without promoting those tasks into the Plan
graph.

Reviewers record issue-like Findings inside the canonical Review Report. Every
Finding carries explicit Reviewer provenance, type `Bug | Feedback`, priority
`High | Medium | Low`, authority or evidence basis, impact, and an advisory
recommendation. Findings are quality signal, not accepted scope, and never enter
the Plan Issue graph. The Lead records disposition and rationale in the repair
plan; the Reviewer reconciles it on the next complete-candidate pass.

If a Finding requires new or changed accepted behavior, it becomes a human
decision request. Only explicit human approval followed by a new Spec and Plan
boundary can promote that work into Issues. This decision supersedes earlier
vNext wording that allowed Build or Review to add Issues.

## VNEXT-D14 - Canonical Spec and Issue shapes

Every Spec uses the ordered top-level spine `Summary`, `Context`, `End State`,
optional `Key Decisions`, optional `Key Tasks`, `Plan`, and `References` without a
document-title heading. `Context` explains why the work exists. `Key Decisions`
records accepted choices. `Key Tasks` preserves explicit human instructions,
accepted must-do work, or unavoidable constraints and is never an exhaustive
implementation breakdown. Conditional sections and subsections are deleted when
they add no material information; agents do not manufacture filler.

Delivery `plan.md` uses `Summary`, `Context`, `End State`, optional `Key
Decisions`, optional `Key Tasks`, `Plan`, `QA`, and `References` in that order.
Its Plan section owns the Issue set, dependencies, Waves, integration seams, and
proof strategy without introducing requirements or fixing runtime staffing.

Plan Issues use YAML frontmatter with `issue`, `title`, `labels`, `priority`,
`estimate`, and `dependsOn`. The containing directory remains the only workflow
status. Exactly one delivery label is `Feature`, `Tech Task`, or `Bug`; other
labels may coexist. The body uses `Context`, `Acceptance Criteria`, optional
`Non-Functional Requirements`, optional `Notes`, `QA`, and `References`, in that
order. There is no Issue-level Plan. Plan owns Waves and shared seams, QA owns
minimum credible proof, and References map the Issue to accepted authority.
