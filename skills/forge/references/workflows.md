# Workflows and Launch

Read this before starting or resuming Forge work. Workflow identifies the outcome;
depth follows effort, complexity, uncertainty, and risk. Control determines human
pauses. These choices are independent and do not change the requested boundary.

## Launch

Read enough of the request, supplied artifacts, current state, and target harness
to choose the workflow and identify available capabilities. Before specialist
dispatch or substantive artifact/source edits, brief the user in plain language
per [gate briefing](#gate-briefing), then show a short bullet list:

- Workflow: Project, Issue, Bug, or Work
- Depth: Quick or Full
- Control: Guided or Auto
- Agents: selected role names
- Boundary: requested final phase or deliverable and publication limits
- Sequence: phases to perform and accepted artifacts to reuse
- Gates: pending approvals, existing approvals, and decisions outside authority
- Workspace: selected repository and actual branch/worktree, when relevant

Show only the selected values, such as `Workflow: Issue`, `Depth: Full`, and
`Control: Guided`. Never append subtypes, “recommended,” or rationale to those
values. Use these names consistently: PM (Product Manager), Designer, Architect,
Engineer, Reviewer, QA, Researcher, Worker, and Judge. Independence is an assignment
requirement, not a role name: use Reviewer, not Independent Reviewer or Engineer
Reviewer. These are prose names, not code enums. Never attach first names.

After all bullets, write one short paragraph explaining the workflow, depth, and
team choices: effort/complexity evidence, unresolved uncertainty, each specialist's
responsibility, who starts next, and what the user can override. For Auto, cite
the instruction granting it. List roles before dispatch and record actual host
agent IDs afterward; show models/effort only when selected or exposed by the host.
Spawn Spec specialists in [sequence](#specialist-sequence), not together.
Future Worker counts depend on Plan. State the delegation rule at Launch, then
show actual ownership and the integrating Engineer before dispatching Workers.

**Guided is the default.** Present Launch and stop for the user to accept or edit
the workflow, depth, team, and control. Lead with the [gate briefing](#gate-briefing)
in the user's words, then the Launch list. An explicit current acceptance of an
already displayed Launch satisfies this gate. Launch approval does not approve an
unseen Spec or consequential Plan. Resume retains accepted choices without a new
ceremony. Routine follow-ups inside the accepted assignment do not relaunch.

**Auto requires an explicit instruction for this run**, such as “full auto” or
“run autonomously through Acceptance.” Show Launch, then proceed through ordinary
Launch, Spec, and Plan gates within that grant. Record exercised delegated
authority and its source, never human approval of unseen text. “Build this,”
“deliver this,” urgency, and silence alone do not select Auto. Independent
boundary checks, Review, and Acceptance still run.

**An instruction that does not clearly grant Auto is Guided.** When wording
could be read either way, resolving it toward Auto decides on the user’s behalf
whether a human ever sees the Spec, so present Launch and stop instead. A
request to observe, supervise, or watch the run asks for visibility and grants
no autonomy. Ask for the grant in one line rather than inferring it, and never
cite an ambiguous instruction as the Auto source in the loop record.

Both controls preserve accepted intent, host permissions, protected-Spec rules,
and publication restrictions. Conflicts, new scope, unresolved consequential user
choices, or actions outside the grant return to the user. Auto is not authority
to apply protected standing Spec bytes without the required exact approval. Keep
such proposals unapplied and hold dependent work when that authority is required;
never fabricate a decision or use generic writes to bypass memory mechanics.

Direct operations show only their own assignments and stopping boundary. Auto
for Spec does not schedule Build. Mode changes govern subsequent work. Disclose
material workflow, scope, team, or gate-policy changes before dependent work;
Guided waits, while Auto follows its explicit grant. Depth changes still require
the user's choice unless that choice was explicitly delegated.

## Gate briefing

This is conversation reporting, not a new artifact. Do not write a briefing
file, managed document, or Spec section for it.

Every human stop is a short briefing the user can decide from, plus links to
the exact artifacts for when they want depth. Do not assume they already read
the Spec, Issue, Plan, Review, or log. Speak in the user's product language.
Loop IDs, scenario codes, phase names, and harness jargon stay out of the
briefing or appear only in those links.

This applies at Launch, Spec, Plan, and any return for a decision, including
`READY_FOR_USER`, new scope, and Auto conflicts. Auto still briefs when it
actually pauses.

Name the proposed result, every material addition or removal, important preserved
behavior, risks and proof limits, and the exact choices with a recommendation and
consequence. A generic reply cannot approve a material commitment omitted here;
an explicit approval of the exact full revision retains its stated scope. If the
human answers one choice, leave the other choices open. Give one clear next ask
and links to the exact revision. Aim for about one page of chat; use more when the
decision requires it. Group related changes, use verified quantities when useful,
and show a representative screenshot or small comparison table only when it makes
the choice easier. Keep implementation detail in the linked artifact. See the
adaptable [decision and change briefs](reporting.md#chat-briefs).

## Depth

**Quick** uses ready intent, brief Engineer Plan notes, implementation, local
checks, Reviewer judgment, and repair. It is the Build/check/fix loop, not a waiver
of preparation or proof. Acceptance runs when requested; Ship only when authorized.
Recommend Quick when the outcome is clear, effort and complexity are low, accepted
design/contracts suffice, and decisive proof is known. One ticket, few files, or
urgency does not establish those conditions.

A bounded prompt, skill, instruction, or documentation change with no new
executable mechanism defaults to Quick. Full requires a concrete unresolved
interaction, contract, or material risk that Quick cannot cover. If Forge's
process is becoming larger than the requested change, name that concrete risk or
downshift; process artifacts are not evidence of product complexity.

**Full** performs needed Spec shaping, design/contracts, Plan, Build with Review,
and Acceptance through the requested boundary. Recommend it for substantial
effort, uncertainty, interactions, or risk. One Issue can require Full; multiple
coordinated outcomes normally do. Full does not dispatch unused specialists.

A current human request is a ready issue-like object when it states the intended
outcome, relevant boundaries, and observable completion. Do not assign PM merely
because no external ticket exists. When those elements are materially missing,
the initial choice is provisional: PM completes the Issue, then Engineer supplies
technical judgment. Designer and Architect join only under the triggers below,
in that order. Reuse adequate estimates. Do not introduce an estimator, scoring
system, or separate estimation document.

Show changed recommendations before dependent work. The user's depth selection
wins. If Quick cannot cover a demonstrated requirement, name the missing design,
contract, or proof and seek a depth/scope decision, including under Auto unless
depth changes were explicitly delegated. Never silently enlarge the team or omit
required work.

When the human materially narrows or simplifies accepted scope, reassess depth
and staffing before further delegation. A direct instruction to use the simpler
approach supersedes machinery that existed only for the broader design unless the
human explicitly preserves Full depth. Superseded artifacts and assignments do
not trigger specialists, expanded Review, or additional gates.

At every depth, understand the actual flow and accepted outcome, then choose the
first sound route: no change, existing owner or pattern, standard library, native
platform, installed dependency, then the smallest new mechanism. The target
harness may add technique, but cannot weaken accepted meaning or proof. Apply the
same simple-first judgment in Spec, Plan, Build, repair, and Review; it creates no
extra pass or form. [Craft](judges.md#craft-rubric) defines when complexity is earned.

## Workflow sequences

The Coordinator owns conversation, routing, authority, and progress. The following
assignments are actual native subagent jobs, not personas loaded into the
Coordinator. Retain continuing authors and separate contexts for judgment. All
sequences stop at the requested boundary and reuse applicable accepted artifacts.

| Workflow | Spec and Plan | Build | Acceptance |
| --- | --- | --- | --- |
| Project | Multiple outcomes need shared decisions or integration. PM owns product scope and outcome criteria first. Designer follows when experience is triggered. Architect follows with technical project scope/contracts after those upstream artifacts exist. Mixed projects still use this order, not simultaneous authoring. Engineer owns strategy, dependencies, integration, and outcome Issues with PM-authored product criteria. | Engineer assigns Workers to separable bounded outcomes, integrates, and repairs the whole candidate. Reviewer judges that candidate. | QA exercises integrated outcomes, Issue interactions, and affected existing behavior in a separate context. |
| Issue | One item at any effort/complexity. Reuse a ready Issue; otherwise PM authors/completes it, then Engineer assesses. Quick uses brief Plan notes. Full resolves required design, then contracts, then strategy, in that specialist order. Keep this on the Issue unless separate artifacts improve the handoff. | Quick uses Engineer and Reviewer. Full adds the triggered specialists in sequence and Workers only for separable outcomes, under one integrating Engineer. | QA proves the changed outcome and affected regressions, including required design and contracts. |
| Bug | Observed expected/actual mismatch. Engineer owns the bug record, reproduction, falsifiable hypotheses, and distinguishing checks. A reported cause is not established fact. Hotfix changes urgency, not responsibilities or truth. | The same Engineer reproduces, diagnoses, repairs the shared cause, and checks affected callers. Reviewer judges repair and preservation. | QA proves the original reproduction no longer fails and exercises affected behavior. Unrelated green tests are insufficient. |
| Work | A bounded non-software deliverable. Researcher authors evidence work, Designer visual work, or the applicable professional authors the artifact and its production/proof approach. | The author produces the artifact; Reviewer in a separate context checks claims, completeness, and craft with the applicable professional instructions. | A separate acceptance assignment inspects/exercises the final artifact against purpose, sources, and format. Software/browser tests apply only when needed. |

Feature, improvement, polish, technical task, and patch select Issue, never a
compound display label. A standalone mockup selects Work; a mock deciding a
product experience remains within that product's Spec.

Ship reuses the responsible owner for current-evidence checks, closure, and only
authorized publication. There is no mandatory Ship agent. Project Workers receive
outcome boundaries, shared contracts, owned writes, and proof. Run dependency-ready
disjoint work together; serialize shared writes. Worker returns add no gates. An
Issue inside a Project reuses that Project's team and acceptance strategy instead
of recursively launching a complete Project.

## Concrete staffing

Apply these triggers to the requested work, not workflow name or file count.

| Condition | Assignment |
| --- | --- |
| Issue lacks a ready Issue or issue-like object | PM authors/completes the Issue first. Engineer assesses effort after that draft exists, at either depth. |
| New or materially revised journeys, visual direction, or interaction design | Designer authors that Spec portion. Straightforward reuse of accepted design needs no new design assignment. |
| New/changed shared API/event contracts, data ownership, trust boundaries, migration strategy, or cross-system recovery | Architect resolves contracts before dependent implementation. A restorative Bug leaving contracts intact does not trigger new architecture work. |
| A Spec decision needs missing external evidence, competing approaches, or prior art | Researcher investigates named questions with sources and limits. Local tracing remains with Engineer or Architect. |
| Full implementation has separable bounded outcomes | Engineer delegates Workers, shows ownership/sequencing, and retains integration. This governs both Issue and Project. |
| Issue or Bug reveals multiple independently accepted outcomes requiring coordination | Propose Project with evidence; preserve usable work. |
| Full candidate spans multiple implementation outcomes, or a separate Designer or Architect assignment authored a design or contract document whose commitments this implementation must satisfy | Reviewer dispatches one Judge per applicable dimension and integrates original reports. |
| Issue or Bug changes authorization, tenancy, persistent-data integrity, a public contract, or cross-system recovery, without the broader Full condition above | Reviewer dispatches separate Code Review and Spec Judges and directly covers remaining applicable dimensions. |
| Neither expanded-Review condition applies | One Reviewer covers every applicable dimension directly in one compact report. |

Answer the second clause of the first row from the loop record rather than by
inference: there is a separate Designer or Architect assignment, and it authored
a document this candidate had to satisfy. One condition without the other does
not fire it. A Designer who only reused accepted design, or an Engineer who
recorded contracts inside its own Plan, is not a separate authoring assignment.
Two Reviewers reading the same record should reach the same staffing, so do not
expand coverage for defensibility when the record does not show both halves.
Superseded assignments and documents never satisfy an expanded-Review trigger. A
narrow guidance-only candidate uses one Reviewer for all applicable dimensions
unless the current candidate still contains multiple implementation outcomes or
a concrete high-risk contract seam.

When both expanded-Review triggers apply, the Full rule wins and covers every
applicable dimension, including Code Review and Spec. Dimensions remain Code
Review, Design, Quality, Spec, and Craft; see [judges](judges.md) for applicability,
rubrics, and replacement/waiver rules. Explicit user staffing choices take
precedence; any coverage waiver remains visible. If native nesting is unavailable,
the Coordinator dispatches required assignments on the owner's behalf. Missing
required agents, separate context, or proof capability is a gap that holds
dependent work, not permission for author self-Review or self-Acceptance.

## Specialist sequence

Triggered Spec specialists run in dependency order. Listing them at Launch is
not permission to spawn them together.

1. Product Manager authors product intent or the missing Issue.
2. Designer authors experience only after that product intent exists. Design is
   downstream of product.
3. Architect authors contracts only after product intent exists, and after design
   when design was triggered. Architecture is downstream of product and design.
4. Engineer assesses the Issue after the PM draft, then Plans and Builds after
   the required Spec artifacts exist.

Do not run Product Manager, Designer, and Architect in parallel. Later work
needs the earlier artifact; simultaneous authoring invents conflicting scope.

Parallelize other work when it is read-only or writes do not overlap. One
accountable owner integrates all returns.

## Spec and Plan gates

In Guided, brief a new/materially revised Spec in the conversation, link the
exact draft, and wait before dependent Plan or Build. After approval, record
source/revision and run its independent boundary review. A consequential new
Plan is briefed and approved before its boundary review and Build. A boundary
review cannot make a new human decision; consequential revisions return to the
gate. In Auto, the same jobs/checks run within the cited grant without ordinary
human pauses; record delegated progression honestly. When Auto does pause, still
brief.

Accepted artifacts satisfy their gate when identity, approval, and relevance are
recorded. Direct Build over accepted intent authorizes reversible Engineer tactics:
brief faithful Plan notes create no extra human gate or planning team. Consequential
strategy outside that authority requires the appropriate control/authority gate.

The Quick Issue sequence is Launch → reuse a ready Issue or PM prepares it then
Engineer assesses → settle new intent and changed depth → Engineer's brief Plan
and Build → Reviewer → requested QA Acceptance → authorized Ship. Full shapes
Spec in order: Product Manager, then Designer if triggered, then Architect if
triggered; then resolves consequential Plan and coordinates Build with Review
and requested Acceptance.
Plan remains a job, optionally notes on the Issue or under `spec/`. Review is inside
Build; `Forge verify` selects Acceptance. There is no extra Verify phase.

## Example: accepted small Issue

- Workflow: Issue
- Depth: Quick
- Control: Guided
- Agents: Engineer, Reviewer
- Boundary: Build
- Sequence: Spec (reuse) → Plan (brief notes) → Build (including Review)
- Gates: Launch approval; new intent or consequential strategy changes
- Workspace: the selected repository and actual worktree branch

The Issue defines the sidebar-label change and acceptance criteria. Effort and
complexity are low, accepted design suffices, and a focused check proves the change.
Engineer starts with brief notes and builds; Reviewer checks the result separately.
You can change depth, team, or control before starting. Guided waits for Launch
approval; Acceptance and Ship remain outside this request.

At that Launch stop the briefing names the sidebar-label change, what stays the
same, and the ask to start. It does not lead with loop or phase jargon.

## Example: an instruction that does not grant Auto

The user writes, “orchestrate a build of this and let me watch how it goes.”
That asks for delivery and for visibility, and it grants no autonomy, so it is
Guided and the Spec gate stands.

- Workflow: Issue
- Depth: Full
- Control: Guided
- Agents: PM, Engineer, Reviewer
- Boundary: Build
- Sequence: Spec → Plan → Build (including Review)
- Gates: Launch approval; the Spec gate before Plan
- Workspace: the selected repository and actual worktree branch

Present Launch and stop. Do not record the instruction as an Auto grant, and do
not read the request to watch as delegated authority over unseen intent. If the
user then says to carry on without stopping, that is the grant, and the loop
record keeps its exact words.
