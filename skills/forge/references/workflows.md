# Workflows and Launch

Read this before starting or resuming Forge work. Workflow identifies the outcome;
depth follows effort, complexity, uncertainty, and risk. Control determines human
pauses. These choices are independent and do not change the requested boundary.

## Launch

Read enough of the request, supplied artifacts, current state, and target harness
to choose the workflow and identify available capabilities. Before specialist
dispatch or substantive artifact/source edits, show a short bullet list:

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
Reviewer. These are prose names, not code enums.

After all bullets, write one short paragraph explaining the workflow, depth, and
team choices: effort/complexity evidence, unresolved uncertainty, each specialist's
responsibility, who starts next, and what the user can override. For Auto, cite
the instruction granting it. List roles before spawning and record actual host
agent IDs afterward; show models/effort only when selected or exposed by the host.
Future Worker counts depend on Plan. State the delegation rule at Launch, then
show actual ownership and the integrating Engineer before dispatching Workers.

**Guided is the default.** Present Launch and stop for the user to accept or edit
the workflow, depth, team, and control. An explicit current acceptance of an
already displayed Launch satisfies this gate. Launch approval does not approve an
unseen Spec or consequential Plan. Resume retains accepted choices without a new
ceremony. Routine follow-ups inside the accepted assignment do not relaunch.

**Auto requires an explicit instruction for this run**, such as “full auto” or
“run autonomously through Acceptance.” Show Launch, then proceed through ordinary
Launch, Spec, and Plan gates within that grant. Record exercised delegated
authority and its source, never human approval of unseen text. “Build this,”
“deliver this,” urgency, and silence alone do not select Auto. Independent
boundary checks, Review, and Acceptance still run.

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

## Depth

**Quick** uses ready intent, brief Engineer Plan notes, implementation, local
checks, Reviewer judgment, and repair. It is the Build/check/fix loop, not a waiver
of preparation or proof. Acceptance runs when requested; Ship only when authorized.
Recommend Quick when the outcome is clear, effort and complexity are low, accepted
design/contracts suffice, and decisive proof is known. One ticket, few files, or
urgency does not establish those conditions.

**Full** performs needed Spec shaping, design/contracts, Plan, Build with Review,
and Acceptance through the requested boundary. Recommend it for substantial
effort, uncertainty, interactions, or risk. One Issue can require Full; multiple
coordinated outcomes normally do. Full does not dispatch unused specialists.

For an Issue without a ready Issue or issue-like object, the initial choice is
provisional. After Launch, PM creates/completes the Issue and records acceptance,
effort/complexity, uncertainty, selected depth, specialist assignments, and proof.
Engineer supplies technical judgment; Designer and Architect join under the
triggers below. This preparation also applies to Quick and technical tasks. Reuse
adequate estimates. Do not introduce an estimator, scoring system, or separate
estimation document.

Show changed recommendations before dependent work. The user's depth selection
wins. If Quick cannot cover a demonstrated requirement, name the missing design,
contract, or proof and seek a depth/scope decision, including under Auto unless
depth changes were explicitly delegated. Never silently enlarge the team or omit
required work.

## Workflow sequences

The Coordinator owns conversation, routing, authority, and progress. The following
assignments are actual native subagent jobs, not personas loaded into the
Coordinator. Retain continuing authors and separate contexts for judgment. All
sequences stop at the requested boundary and reuse applicable accepted artifacts.

| Workflow | Spec and Plan | Build | Acceptance |
| --- | --- | --- | --- |
| Project | Multiple outcomes need shared decisions or integration. PM owns product scope and outcome criteria; Architect owns technical project scope/contracts; mixed projects use both. Engineer owns strategy, dependencies, integration, and outcome Issues with PM-authored product criteria. | Engineer assigns Workers to separable bounded outcomes, integrates, and repairs the whole candidate. Reviewer judges that candidate. | QA exercises integrated outcomes, Issue interactions, and affected existing behavior in a separate context. |
| Issue | One item at any effort/complexity. Reuse a ready Issue; otherwise PM authors/completes and estimates it with Engineer input. Quick uses brief Plan notes. Full resolves required design, contracts, dependencies, and strategy. Keep this on the Issue unless separate artifacts improve the handoff. | Quick uses Engineer and Reviewer. Full adds the triggered specialists and Workers only for separable outcomes, under one integrating Engineer. | QA proves the changed outcome and affected regressions, including required design and contracts. |
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
| Issue lacks a ready Issue or issue-like object | PM authors/completes and assesses it with Engineer input, at either depth. |
| New or materially revised journeys, visual direction, or interaction design | Designer authors that Spec portion. Straightforward reuse of accepted design needs no new design assignment. |
| New/changed shared API/event contracts, data ownership, trust boundaries, migration strategy, or cross-system recovery | Architect resolves contracts before dependent implementation. A restorative Bug leaving contracts intact does not trigger new architecture work. |
| A Spec decision needs missing external evidence, competing approaches, or prior art | Researcher investigates named questions with sources and limits. Local tracing remains with Engineer or Architect. |
| Full implementation has separable bounded outcomes | Engineer delegates Workers, shows ownership/sequencing, and retains integration. This governs both Issue and Project. |
| Issue or Bug reveals multiple independently accepted outcomes requiring coordination | Propose Project with evidence; preserve usable work. |
| Full candidate spans multiple implementation outcomes or interdependent design and technical contracts | Reviewer dispatches one Judge per applicable dimension and integrates original reports. |
| Issue or Bug changes authorization, tenancy, persistent-data integrity, a public contract, or cross-system recovery, without the broader Full condition above | Reviewer dispatches separate Code Review and Spec Judges and directly covers remaining applicable dimensions. |
| Neither expanded-Review condition applies | One Reviewer covers every applicable dimension directly in one compact report. |

When both expanded-Review triggers apply, the Full rule wins and covers every
applicable dimension, including Code Review and Spec. Dimensions remain Code
Review, Design, Quality, Spec, and Craft; see [judges](judges.md) for applicability,
rubrics, and replacement/waiver rules. Explicit user staffing choices take
precedence; any coverage waiver remains visible. If native nesting is unavailable,
the Coordinator dispatches required assignments on the owner's behalf. Missing
required agents, separate context, or proof capability is a gap that holds
dependent work, not permission for author self-Review or self-Acceptance.

## Spec and Plan gates

In Guided, present a new/materially revised Spec and wait before dependent Plan or
Build. After approval, record source/revision and run its independent boundary
review. A consequential new Plan is presented and approved before its boundary
review and Build. A boundary review cannot make a new human decision; consequential
revisions return to the gate. In Auto, the same jobs/checks run within the cited
grant without ordinary human pauses; record delegated progression honestly.

Accepted artifacts satisfy their gate when identity, approval, and relevance are
recorded. Direct Build over accepted intent authorizes reversible Engineer tactics:
brief faithful Plan notes create no extra human gate or planning team. Consequential
strategy outside that authority requires the appropriate control/authority gate.

The Quick Issue sequence is Launch → reuse a ready Issue or PM prepares/estimates
one → settle new intent and changed depth → Engineer's brief Plan and Build →
Reviewer → requested QA Acceptance → authorized Ship. Full shapes Spec, resolves
consequential Plan, then coordinates Build with Review and requested Acceptance.
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
