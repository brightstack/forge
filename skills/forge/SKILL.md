---
name: forge
description: "Drive a software or general-work outcome through Forge's composable Spec, Plan, Build, Acceptance, and Ship lifecycle. Use when the user explicitly asks to use Forge, asks Forge to explore, spec, plan, build, review, accept, verify, simplify, ship, reconcile a Spec change, or maintain Forge knowledge. Direct phase requests stop at that boundary; importing a ticket, exploring, specifying, or planning never implies Build or Ship authority."
---

# Forge

<activation>
Activate only when the user explicitly invokes Forge or the caller identifies this
skill. Do not infer Forge from an ordinary request to build, review, plan, research,
or write a document.

Natural agent requests are the public interface: “Use Forge to plan this Issue,”
“Forge run acceptance on this candidate in the browser,” “Forge verify this
candidate,” or “Run Forge through delivery.”
They are distinct from the executable `forge` CLI, which provides document,
memory, candidate, and validation mechanics. Never pretend that a shell
command selects professional judgment, grants authority, or advances a phase.
The executable also serves local artifact previews through `forge serve`; this
does not establish rendered inspection, acceptance, or publication.
</activation>

For an explicit direct Plan, continue with [Plan](references/plan.md), applying
the host's teammate and persistence mapping. That procedure contains the bounded
intake and authority contract; the full delivery composition below is not extra
setup for a small Plan.

<setup>
Read the root and applicable nested `AGENTS.md` files in the target repository,
then follow only their relevant links. The target harness owns its languages,
frameworks, package manager, architecture conventions, test commands, and deployment
rules. Retrieve those choices from its instructions, manifests, and existing code;
do not import Forge's own Bun toolchain or another repository's stack. When evidence
is missing, identify the gap rather than inventing a project standard. Pass the
applicable rules to helpers and use them in Review and Acceptance.

Forge's phase references and professional instructions provide provider-neutral
baseline guidance. A specialist skill selected by the user or target harness is
bounded guidance inside the current phase: it cannot change accepted intent, add
a gate, override Review or Acceptance, or expand tool, write, or publication authority.
If a selected specialist is unavailable, disclose the gap. Hold dependent work
when the user or applicable harness requires that specialist unless fallback is
already authorized; an optional selection may use the baseline. Never claim that
the baseline ran the named specialist.

Use the available professional instructions
for the current job from [the Forge agent catalog](../../agents/README.md): Product
Manager for product intent, Designer for experience, Engineer for implementation
and technical judgment, Architect for durable contracts, Researcher for sources
and knowledge hygiene, Reviewer for candidate judgment, and QA for
acceptance. Explorer, Worker, and Judge are temporary helper assignments, not
professional personas.

Read [runtime and delegation](references/runtime.md) before assigning subagents and
[authority and state](references/protocol.md) before creating or resuming a managed
loop. Use the [CLI mechanics guide](references/cli.md) only when a
mechanical operation is needed.
For optional knowledge topics and proportional preservation, use
[knowledge guidance](references/knowledge.md).
</setup>

<launch>
Read [workflows and Launch](references/workflows.md) before starting or resuming.
It owns Project/Issue/Bug/Work selection, Quick/Full depth, concrete native-agent
assignments, and Guided/Auto control. Present the selected names in plain bullets
and one rationale paragraph before specialist dispatch or substantive edits.
Guided is the default: stop at Launch for acceptance. Explicit Auto proceeds
within its cited grant, never by inventing human approval. An accepted Launch is
reused on resume; direct phases retain their requested boundary.
</launch>

<contract>
Full delivery accounts for exactly:

```text
Spec -> Plan -> Build -> Acceptance -> Ship
```

Depth, staffing, artifacts, and proof vary; the phases do not disappear. Existing
accepted evidence may satisfy a phase when its identity and relevance are recorded.
Spec includes intake and discovery. After human approval, the natural skill
operation `Forge spec apply <change>` may apply the exact approved standing-Spec
and related knowledge bytes; the
result stays document-only until Build Review and Acceptance prove it. Build
includes implementation, integration, behavior-preserving simplification,
internal review, independent Review, and coherent repair. Acceptance exercises
the Review-passed candidate. Ship checks the complete accepted candidate once,
records concise closure, and performs only authorized publication.

Each phase is directly callable and stops at its named boundary. Direct Build
includes independent Review but does not claim Acceptance or Ship. Direct
Acceptance uses a current independent Review or first obtains a bounded one over
the same candidate.
Explore, Review, Simplify, Spec apply, the legacy natural wording Spec merge, and
knowledge maintenance are also direct entries; they do not manufacture completion
of the five-phase lifecycle.
</contract>

<approval_gates>
Follow the [workflow gates](references/workflows.md#spec-and-plan-gates).
In Guided, full delivery stops when Forge authors a new or materially revised
Spec or consequential Plan. A later terminal boundary is not artifact approval.

- **Guided Spec gate:** present the exact reviewable Spec draft or revision, then stop
  with human approval as the next action. Do not start Plan, delegate downstream
  work, edit production code, or infer approval. After approval, record the human
  source and approved revision, run the Spec boundary review, and proceed only if
  that review preserves the approved meaning. A consequential revision returns to
  this gate.
- **Guided Plan gate:** present the exact consequential Plan, then stop before Build. Do not
  delegate Build or edit production code until the human approves that Plan. After
  approval, record the source and revision, run the Plan boundary review, and
  proceed only if it preserves the approved strategy. A consequential revision
  returns to this gate.

An existing accepted Spec, ticket, or Plan can satisfy its gate when its identity,
approval, and relevance are recorded. An explicit direct Build or fix request over
a bounded accepted outcome supplies Build authority and does not manufacture a
second Spec or Plan gate for tactical notes. This includes a request that names
accepted intent and expressly authorizes changing the implementation, even when it
also asks for Review or Acceptance. It still returns to the human if implementation
requires changed meaning or a consequential unresolved strategy.

Auto runs those same authoring and boundary-review jobs without ordinary pauses
within the explicit grant. Record delegated authority, not approval of unseen
text. Only the human can supply human approval; silence, status, checks, and
verdicts do not. Auto preserves protected-Spec and publication restrictions and
returns conflicts, new scope, and decisions outside its grant to the user.
</approval_gates>

<routing>
Select the workflow and depth using [workflow definitions](references/workflows.md).
The user's explicit choice wins. Issue does not mean small: PM prepares a missing
or unready Issue with Engineer input at either depth, and Designer/Architect join
under the concrete triggers before dependent implementation.

Route direct entries as follows:

- `explore` -> [Explore](references/research.md)
- `spec` or `spec design` -> [Spec](references/spec.md)
- `plan` -> [Plan](references/plan.md)
- `build`, `fix`, or `simplify` -> [Build](references/build.md); bugs also load
  [bug diagnosis](references/debug.md)
- `review` -> [Review](references/review.md)
- `acceptance`, `verify`, or `verify browser` -> [Acceptance](references/verify.md)
- `ship` -> [Ship](references/ship.md)
- `spec apply`, legacy natural wording `spec merge`, or
  `kb ask|add|update|remove|verify|history` ->
  [Spec and knowledge memory](references/memory.md)

For an unqualified “Forge this” request, determine whether the user requested one
boundary or full delivery. Do not treat a reference, ticket import, draft, mockup,
or exploration as implementation or publication authority. If the requested
terminal outcome is delivery, enter the five-phase lifecycle and advance only as
far as current authority and selected control allow. Guided stops at required
human gates; Auto exercises only its explicit grant.
</routing>

<authority>
Apply authority in this order:

1. Current human instruction and recorded human decisions.
2. Accepted standing specification plus an explicitly approved change.
3. Applicable repository harness and owned technical or design decisions.
4. The accepted Plan or direct bounded assignment.
5. The exact candidate and current observed evidence.
6. Findings, logs, proposals, and descriptive knowledge.

Requirements use explicit Given/When/Then scenarios when behavior matters. The
accepted baseline and approved change remain independent sources of authority;
the current working tree is the write base and observable target, not proof that
its pre-apply contents were accepted.
Findings, source behavior, tests, structural validation, prototypes, synthetic
users, and descriptive knowledge cannot create or rewrite accepted intent. A
consequential conflict or semantic change returns to the human with the evidence,
options, and a recommendation. Reversible tactics remain with the accountable
professional.
Knowledge retrieves authority and records observed facts; it never proves
compliance or acceptance.
</authority>

<composition>
<step n="1" name="Establish the requested boundary">
Identify the requested phase or terminal outcome, workflow, depth, accepted sources,
current state, and authority gaps. For a managed delivery loop, create or resume
the small record described in [protocol](references/protocol.md). Ask only about
consequential choices that cannot be retrieved or inferred safely.
When a change can affect existing behavior, record the compact preservation chain
of signals, affected obligations, selected checks, and gaps.
During Spec, apply a behavioral change only after its human approval is already
available. Retain the accepted baseline, approved change and source independently
from the current files and application receipt.
Apply Guided/Auto gates from the workflow reference. The requested terminal outcome
alone does not let the agent approve its own artifact.
</step>

<step n="2" name="Run the phase at earned depth">
Load only the routed phase reference and relevant professional instructions. One
accountable owner integrates the phase result. Dispatch the concrete workflow
assignments; loading their personas into the Coordinator does not satisfy them.
Keep write ownership disjoint or serialized and return a compact handoff with
authority, candidate, proof, and gaps.
</step>

<step n="3" name="Protect the candidate">
One Engineer owns a software candidate, tactical planning, required Worker
delegation, integration, simplification, internal review, and repairs. A separate
Reviewer owns the independent integrated verdict. The Reviewer selects
the applicable [dimensions and staffing](references/judges.md),
resolves user/harness replacement or disable choices, and covers them directly or
delegates focused clean-context read-only judges. Spec and Craft apply to every
candidate; Code Review, Design, and Quality follow the outcome. One compact report
can cover small work; preserve delegated returns when used. The Reviewer checks
evidence and integrates judgment, never votes. Staffing does not reduce coverage.
Missing required independence or evidence remains a gap. Independence depends on separate relevant
context, authority, candidate binding, and checked evidence, not provider or model
lineage.
</step>

<step n="4" name="Repair coherently and stop finitely">
Admit demonstrated accepted-intent violations as P0 and evidence-supported defects
with a plausible current trigger, material consequence, and scope-aligned remedy
as pragmatic P1. P2 advice does not extend the loop. Return the whole accepted
packet to the Builder, group symptoms by shared cause, repair the coherent outcome,
and reassess affected Review and Acceptance evidence against the changed candidate.

After three substantive Review/Acceptance-to-repair cycles for the packet, or three
substantive repairs within one cycle, stop editing and record a rethink: failed
invariant, common cause, why prior repairs failed, simpler approach, preserved
scope, and discriminating proof. Have an independent Engineer challenge it. If no
supported approach emerges, or the same failure recurs after the rethink, return
`BLOCKED` with the evidence and required decision or missing input. Never relax
accepted intent or rename the candidate to reset the count.
</step>

<step n="5" name="Close only the authorized boundary">
Write concise human-readable artifacts from the linked templates, validate managed
identities and references, and report actual proof. Carry earned domain, data,
runtime, process, operations, or design intent into the canonical proposal during
Spec and complete factual observations before Build Review. A direct phase ends
there.
Full delivery proceeds only with authority for the next phase. Ship never implies
merge, deployment, release, or publication authority the user did not grant.
</step>
</composition>

<reporting>
Use [reporting and failure routes](references/reporting.md). Lead with the result,
exact phase/candidate, evidence, gaps, and next required action. Use the owning
phase's defined disposition; do not promote local checks into independent Review
or actual acceptance.
</reporting>

<checklist>
- Explicit Forge activation and exact requested stopping boundary
- Spec, Plan, Build, Acceptance, and Ship all accounted for in full delivery
- Launch shown; Guided acceptance or explicit Auto grant recorded
- New Spec and consequential Plan gates follow control; human approvals and
  exercised delegated authority remain distinct, with source and revision
- Workflow/depth and concrete agent assignments followed; missing Issue gets PM
- One accountable Builder and a separate integrated-candidate Reviewer
- Current candidate/base, authority, source anchors, runnable proof, and gaps
- Given/When/Then scenarios preserved where behavior matters
- Review distinct from Acceptance; required UI proof uses an actual browser
- Synthetic-user scenarios remain simulated acceptance within accepted scope
- Bug work tests hypotheses and proves the original reproduction
- P0/pragmatic-P1 repair is coherent; P2 does not extend work; finite rethink stop
- Spec and knowledge changes preserve an independent accepted baseline, approved
  delta, source provenance, exact result, and human authority
- Preservation scope records signals -> affected obligations -> selected checks -> gaps
- Builder proposes preservation scope, Reviewer challenges it, and Acceptance exercises
  affected unchanged plus changed or new outcomes
- KB retrieval and structural checks are never reported as compliance proof
- CLI used only for actual supported mechanics; no invented commands or flags
- Early application stays document-only; honest result at the requested boundary,
  with no implied Build, Acceptance, or Ship authority
</checklist>
