# Comparative review: Forge phase topology

BLUF: Keep the paired Phase Lead and Review Lead design. It combines the strongest
shared pattern across Codex Ultra, Claude Code Ultracode, BMAD, and Pocock's
skills: dynamic focused agent trees behind one accountable synthesizer. Forge's
distinct contribution should remain the stable outer SDLC, authority chain,
frozen candidate, independent verdict, and small artifact surface.

This is review evidence, not accepted implementation authority. It compares the
proposal in [decisions.md](decisions.md) and the paired-lead brief used by four
independent Sol xhigh analysts.

## Comparative result

| System | What transfers well | What Forge should not copy |
| --- | --- | --- |
| Codex Ultra | Model-directed bounded delegation, focused contexts, concurrency caps, follow-up, synthesis, multi-lens review | Arbitrary nesting, shared-write concurrency, summary-as-proof, Ultra as a generic model tier |
| Claude Code Ultracode | Task-specific dynamic graphs, parallel and pipeline barriers, adversarial verification, per-task model/worktree choices | Agent-team shared task lists, peer/self-claim coordination, per-unit verifier explosion, host workflow scripts as Forge artifacts |
| BMAD Method | Conditional process depth, personas separated from workflows, durable context, readiness by content, parallel review lenses | Per-story review and status artifacts, Developer-owned review/patching, mandatory persona theater, installer/module ecosystem |
| Pocock skills | Progressive disclosure, clarification frontiers, one source of truth, vertical tickets, independent Spec and Standards review axes | Mandatory/exhaustive grilling, review per ticket, unreconciled reports, recursive skill discovery, skill sediment |

## What the evidence supports

### 1. Stable outer graph, dynamic inner graph

Forge should mechanically preserve route, phase order, accepted inputs, artifact
ownership, candidate identity, and gates. Inside a phase, its Lead should create
an ephemeral task graph based on the actual work. That graph may fan out,
pipeline, follow up, stop, or re-route without becoming a durable Forge artifact.

This is the closest common denominator between Codex Ultra's root synthesis and
Claude Code's dynamic workflows. BMAD and Pocock add evidence for conditional
depth and progressive disclosure, but neither supplies Forge's integrated Wave
topology.

### 2. Paired accountability at work-producing boundaries

Each work-producing phase should have:

1. A Phase Lead that plans, delegates, inspects, and integrates one phase
   candidate.
2. A fresh Review Lead that freezes that candidate, commissions independent
   read-only Judges by material quality dimension, validates their evidence, and
   publishes one verdict.

The pattern stops there. Verify is the review side of Build, not an object that
spawns a reviewer-of-the-reviewer. Ship only creates the PR and needs a mechanical
preflight, not another semantic review phase.

### 3. Parallelize before completion, but not before authority

A Lead may start work against stable contracts before adjacent implementation is
complete. It may also parallelize exploratory work while an upstream artifact is
being authored. Only authoritative integration waits for hard prerequisites.

Examples:

- Product Spec writing can run parallel user, repository, competitor, ontology,
  and failure-mode exploration.
- Design and Technical exploration may begin before Product Spec completion, but
  cannot finalize decisions that depend on unsettled product intent.
- UI and API Workers may build concurrently against an accepted interface or
  dummy service contract.
- Shared schema, security, tenancy, or public-contract authority stays with the
  Lead or owning Spec; Workers do not converge it by negotiation.

### 4. Workers and Judges need different mechanics

Workers own coherent outcomes, can plan locally, edit multiple files, test, and
debug. The Builder owns shared contracts, hot seams, integration, cumulative
proof, and the sole candidate.

Judges are read-only evidence gatherers. They cannot spawn Judges, invoke Verify,
repair source, or publish verdicts. Their base instructions should enforce
no-recursion and least tools mechanically where the host permits.

### 5. Personas should encode judgment, not theater

BMAD supports identity, role, communication style, and principles. OpenAI and
Pocock both favor lean, focused instructions. Forge should retain personality
matrices and mental models only for core persona agents and only when each element
changes a named decision posture. Workers and Judges remain lean task bots.

Greetings, icons, menus, biographies, and character flourishes do not belong in
task execution unless an evaluation demonstrates a decision-quality benefit.

## Recommended Forge topology

```text
Forge orchestrator
  -> Phase Lead
       -> dynamic Researchers / specialists / Workers
       -> inspect and integrate
       -> one frozen phase candidate
  -> Review Lead
       -> dynamic read-only Judges by risk
       -> validate and reconcile evidence
       -> one verdict
  -> gate: continue, repair, authority gap, or human decision
```

Use native host subagents as the baseline. A host may implement the inner graph
with Codex Ultra or a Claude dynamic workflow when available, but host runtime
scripts, thread trees, task lists, and transcripts remain non-authoritative.

## Adopt

- One accountable synthesizer on each side of the phase boundary.
- Dynamic outcome-sized delegation with exact authority and proof pointers.
- Separate contexts and least tools for contributors.
- Synthesis barriers before a phase candidate or verdict is published.
- Conditional artifacts and content-based readiness.
- One source of truth with progressive disclosure.
- One integrated Wave review, never review per Worker or Issue.
- Short-lived worktree isolation when concurrent writes or environments require
  it.
- Resume only from an accepted phase artifact or exact Wave candidate; revalidate
  that its inputs remain current.

## Adapt

- Keep every phase's Review Lead, but choose Judge count and lenses by actual
  risk. Do not require five Judges merely because five are available.
- Default to read-heavy parallelism. Permit parallel implementation only after
  the Lead owns interfaces, overlap, and integration order.
- Treat `mechanical | standard | deep` as semantic model needs. Ultra and
  Ultracode combine reasoning with orchestration policy and must be explicit host
  execution choices, not automatic meanings of `deep`.
- Preserve BMAD-style persona fields as a minimum, then add mental models or
  decision posture only where behavioral evaluations justify them.
- Use Pocock-style clarification inside Intake: retrieve facts, ask the current
  decision frontier, record it once, and stop interviewing.

## Reject

- Agent-team shared task boards, self-claiming, peer task locks, and distributed
  candidate ownership.
- Formal packets, staffing plans, subagent transcripts, workflow scripts, or
  worktree manifests as Forge product artifacts.
- Per-contributor review, verifier-per-file defaults, and recursive review.
- Reviewer-applied source fixes or Builder-owned verdicts.
- Shared mutable checkout writes without explicit ownership.
- Mandatory memlogs, sprint ledgers, retrospectives, exhaustive story catalogs,
  or compatibility machinery in the kernel.
- Automatic continuation through an authority gap.

## Evaluate before locking expensive defaults

Run matched representative tasks across:

1. One strong agent.
2. Phase Lead with ordinary native subagents.
3. Phase Lead using Codex Ultra or Claude dynamic workflow execution.
4. Fresh Reviewer plus Judges versus Builder-owned review.
5. Lean professional role instructions versus full persona matrices.
6. Fresh per-Issue sessions versus one Wave Lead with outcome-owning Workers.

Measure obligation coverage, escaped defects, unowned decisions, integration
conflicts, reopened authority, review precision, human turns, artifact count,
elapsed time, tokens, and cost. More agents, more checks, or fewer wall-clock
minutes are improvements only when the integrated outcome remains better.

## Reports

- [Codex Ultra](comparisons/codex-ultra.md)
- [Claude Code Ultracode](comparisons/claude-ultracode.md)
- [BMAD Method](comparisons/bmad.md)
- [Pocock skills](comparisons/pocock-skills.md)

## Evidence limits

OpenAI documents its Responses multi-agent beta as similar to Codex Ultra but
does not publish Ultra's private scheduler or convergence heuristic. Anthropic
documents Ultracode and dynamic workflows, but its examples are guidance rather
than comparative evidence. BMAD and Pocock sources are maintainer/practitioner
methods, not controlled evaluations. The recommendations above identify strong
topology alignment and explicit risks; they do not establish that Forge will
outperform simpler controls without the proposed matched trials.
