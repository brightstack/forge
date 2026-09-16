# BMAD Method v6.11.0 comparative review

Forge should borrow BMAD's right-sized planning, durable context, and parallel review lenses, but reject its per-story review ownership, artifact multiplication, and installation machinery. Those choices conflict with Forge's frozen Wave candidate, separate Review Lead, and small kernel.

## 1. What the compared system actually does

**Version and facts.** As checked on 2026-08-30, GitHub marks [BMAD Method v6.11.0](https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v6.11.0) as the latest release. This review uses that tag as the comparison point. v6.11.0 made `bmad-build` the official implementation path, consolidated review and research skills, folded implementation readiness into sprint planning, and retired several older roles and commands.

BMAD organizes delivery into four phases: optional Analysis, Planning, Solutioning, and Implementation. Workflows can run directly as skills or through a named agent. A clear change can enter Build directly; larger initiatives can add PRD, UX, architecture, epics, stories, a readiness gate, sprint tracking, and an epic retrospective. The [versioned workflow map](https://github.com/bmad-code-org/BMAD-METHOD/blob/v6.11.0/docs/reference/workflow-map.md) lists the artifacts and the Phase 4 path.

The default BMM roster has five persona agents: Analyst, Product Manager, Architect, Developer, and UX Designer. There is no default Reviewer persona. Review and QA workflows sit on the Developer menu. Agent launchers maintain character across a session. Their configurable model is concrete, not an abstract "personality matrix": name/title, role, identity, communication style, principles, persistent facts, activation steps, icon, and menu. Amelia's [v6.11 agent launcher](https://github.com/bmad-code-org/BMAD-METHOD/blob/v6.11.0/src/bmm-skills/agents/bmad-agent-dev/SKILL.md) and [persona configuration](https://github.com/bmad-code-org/BMAD-METHOD/blob/v6.11.0/src/bmm-skills/agents/bmad-agent-dev/customize.toml) are representative.

`bmad-build` investigates, plans, implements, launches independent reviewers, triages findings, routes patches back to implementation, verifies again, and commits one session-sized unit. The current guide describes a typical unit as one goal, about 500 changed production lines in a small handful of files. A standalone [code review](https://docs.bmad-method.org/build/review-a-change/) runs four parallel layers by default, validates each finding, and routes it to patch, defer, or human decision. It can apply patches. For larger work, [planning paths](https://docs.bmad-method.org/plan/choose-a-planning-path/) repeat that unit per story, preserve a `SPEC.md`, `stories.yaml`, and story records, and add integration checks plus an acceptance-oriented retrospective at the epic boundary.

The planning-to-build gate is `bmad-sprint-planning`: it reads available artifacts by content and returns PASS, CONCERNS, or FAIL before creating or updating `sprint-status.yaml`. Missing optional artifacts are not failures unless the stories depend on them. [The official gate description](https://docs.bmad-method.org/plan/break-work-into-stories-and-track-it/) is explicitly conditional.

## 2. Strong matches with Forge

**Assessment based on the facts above.**

- Both systems make process depth conditional. BMAD says trivial edits can skip the method and larger work adds shared context without changing the implementation primitive. This supports Forge's Work, Build, and Bug Fix routes and its "every artifact must earn its existence" rule.
- Both preserve downstream authority through files. BMAD's canonical `SPEC.md`, architecture spine, stable decision IDs, story links, and verified `AGENTS.md` project context align with Forge's accepted Spec bundle, Plan graph, canonical ontology, and exact authority pointers.
- Both use independent, parallel review specialists whose findings are reconciled in one triage. BMAD's review layers closely match Forge Judges as focused evidence gatherers, although BMAD does not assign that triage to a separate Reviewer persona.
- Both recognize integration as a distinct risk. BMAD calls for cross-story integration checks and an epic retrospective; Forge binds cumulative proof to one integrated Wave candidate.
- BMAD's persona structure validates Forge's proposed role, identity, communication style, principles, and domain judgment fields. BMAD also separates named personas from workflow skills, which supports Builder, Simplifier, and Debugger as Engineer assignments rather than new personalities.

## 3. Material differences or contradictions

**Assessment and inference.**

1. **Review ownership conflicts.** BMAD reviews every Build unit inside the implementation workflow, lets triage apply patches, and exposes review through the Developer persona. Forge requires a frozen integrated candidate, a separate Reviewer Agent, read-only Judges, and findings returned to the Builder. Copying BMAD's ownership would erase Forge's independent sides.
2. **The unit of scale differs.** BMAD decomposes an epic into session-sized stories and leaves a durable record for each. Forge lets a Wave Builder dynamically delegate larger coherent outcomes, then retains only the integrated candidate and verdict. BMAD's model favors replay and autonomous backlog polling; Forge favors integration ownership and low record entropy.
3. **Lifecycle shape differs.** BMAD has four broad phases with direct entry and optional workflows. It has no distinct Simplify phase or PR-only Ship terminal. Build commits locally and can offer to push or create a PR. Forge's seven-phase Build route makes verified simplification and narrowly authorized shipping explicit.
4. **Artifact surface differs.** A full BMAD project can produce brief/addendum, PRD/addendum/memlog, two UX spines plus memlog, architecture spine, epics, stories, readiness verdict, sprint status, per-story implementation records, and retrospective. Forge's flat conditional Spec bundle, one Plan package, Wave candidate, proof, and verdict are intentionally smaller.
5. **Persona roster differs.** BMAD always installs Analyst, PM, Architect, Developer, and UX personas. Forge makes Reviewer core, activates Architect and Researcher only when earned, and treats Workers and Judges as non-persona bots. BMAD's current schema contains identity and principles, but no explicit mental-model or decision-posture structure. Forge's richer persona format is an extension, not a faithful copy.

## 4. Failure modes Forge should avoid copying

**Inference from BMAD's documented mechanics.**

- **Gate multiplication:** Review inside every story Build, optional extra code-review passes, readiness, integration checks, and retrospective can repeat coverage. The cost grows with story count even when one Wave review would expose the same defects.
- **Artifact as progress:** Status YAML, memlogs, story records, validation reports, and retrospectives can become work products whose maintenance competes with product work. BMAD v6.11's own consolidation is evidence that this surface had grown.
- **Split accountability:** A workflow that builds, commissions review, triages, patches, and commits can claim independence at the subagent level while one parent still owns both sides.
- **Persona theater:** Mandatory greetings, icons, persistent character, and menus add tokens and interaction steps. The official sources provide no evidence that those elements improve task judgment. Strong role heuristics are the transferable part.
- **Harness operational burden:** Layered TOML overrides, generated skill files, render snapshots, `uv`, compatibility shims, modules, and installer migrations create a product to maintain around the delivery method. Forge's small bundled kernel should not inherit that ecosystem burden.
- **Premature fragmentation:** A nominal 500-line/session unit can turn tightly coupled work into many stories, reviews, and handoffs. Local correctness can rise while integration risk and total ceremony rise with it.

## 5. Concrete recommendations

- **Adopt:** conditional, content-based readiness. Missing Design or Technical material should fail only when an accepted obligation depends on it.
- **Adopt:** canonical intent and architecture spines with stable pointers, plus an epic/Wave-level evidence review of cumulative behavior.
- **Adopt:** parallel review lenses and explicit triage that validates consequences before admitting findings.
- **Adapt:** use BMAD's persona fields as a minimum, then add Forge's mental models and decision posture only where they change decisions. Drop mandatory character greetings, icons, and menus from task execution.
- **Adapt:** preserve BMAD's resumption idea only at the Wave candidate level. Do not persist Worker staffing, transcripts, or one lifecycle record per delegated outcome.
- **Reject:** Developer-owned review, reviewer-applied patches, and formal review per Worker or Issue. Keep Reviewer ownership and send one reconciled finding set back to the Builder.
- **Reject:** default memlogs, sprint-status ledgers, compatibility shims, and an installable module ecosystem in the Forge kernel.
- **Evaluate:** run matched Forge-versus-BMAD scenarios for a direct fix, a coupled multi-file feature, and a multi-Wave project. Measure accepted defects, integration failures, human decisions, artifact count, inference cost, and elapsed time. BMAD's own docs recommend empirical A/B review evaluation; Forge should use the same standard before copying expensive gates.

## 6. Source and evidence limitations

The stable tag is pinned, but BMAD's live documentation and `main` had advanced beyond v6.11.0 when checked. I used tag sources for version claims and live official guides where they clarify current operating guidance; those guides can drift. The review covers core BMM and mentions BMad Loop only as an optional orchestrator, not as a full second comparison. BMAD's published quality and productivity claims are maintainer claims, not independent benchmarks. No comparable execution traces or cost data were available. Forge is an accepted proposal, not a measured implementation, so recommendations identify topology fit and risk rather than proven outcome superiority.
