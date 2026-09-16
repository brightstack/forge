# Plan: implement Forge vNext

BLUF: Replace the mixed v1/vNext harness with the accepted small Forge kernel:
three routes, one seven-phase lifecycle, one accountable Lead and independent
Reviewer at each work-producing boundary, dynamic Workers and Judges, simple
shared artifacts, and minimal mechanics that enforce facts without pretending to
make professional judgments.

## Authority

- [Accepted decisions](decisions.md)
- [Lead and Reviewer proposal](lead-reviewer-proposal.md)
- [Adversarial proposal gate](lead-reviewer-proposal-final-review.md)

Historical files under [../build/](../build/) remain evidence only.

## Target

```text
Routes: Work | Build | Bug Fix
Build:  Intake -> Spec -> Plan -> Build -> Verify -> Simplify -> Ship

phase
  -> Lead plans, delegates, and integrates one candidate
  -> Reviewer selects mechanical checks and read-only Judges
  -> one verdict and gate
```

Research, Debug, Impeccable, Ponytail, and execution discipline are internal
capabilities, not lifecycle phases. Ship creates the pull request and does nothing
else.

## Kernel

Keep one public `forge` orchestration skill with internal Intake, Spec, Plan,
Build, Debug, Verify, Simplify, and Ship instructions plus the Build-loop
protocol. Preserve the canonical artifact templates' purpose and information
model while fixing broken paths and field mismatches. Bundle the small Impeccable,
Ponytail, and execution-principle guidance Forge needs. Remove duplicate wrapper
skills and stale lifecycle terminology after their useful behavior is folded into
the kernel.

Every runnable agent lives at `agents/<name>/instructions.md`. Persona agents are
Product Manager, Designer, Engineer, Reviewer, Architect, and Researcher. Worker
and Judge are lean task bots. `Lead` is an assignment. Builder, Debugger, and
Simplifier are Engineer instances using the corresponding internal skill.

## Behavior to implement

- One Lead owns each phase candidate and may dispatch specialists or Workers for
  meaningful outcomes. The Spec Lead integrates one coherent conditional bundle.
- Recorded human decisions and accepted meaning never change without the human.
  A Lead-routed domain specialist may repair a Spec artifact when that meaning
  already determines the correction; the repair creates a new candidate and
  invalidates affected downstream review.
- Plan creates the complete Issue graph. After Plan Review, Build may regroup
  and sequence reviewed Issues and create ephemeral Worker tasks, but cannot add
  Issues. Issue frontmatter stays limited to `issue`, `title`, `labels`,
  `priority`, `estimate`, and `dependsOn`; Plan owns shared seams, Wave design,
  and proof strategy.
- Workers may build concurrently against provisional interfaces, mocks, fixtures,
  or stubs. Temporary breakage is allowed before Lead integration.
- One Reviewer owns phase quality. It chooses applicable mechanical checks and
  read-only Judges, always checks Spec and project-harness compliance, and issues
  one verdict over the complete candidate.
- UI with accepted visual authority requires rendered inspection by a Visual QA
  Judge for material fidelity, visible defects, and representative responsive
  states. Pixel perfection is required only when explicitly specified.
- Review Reports contain issue-like Findings with explicit Reviewer provenance,
  typed `Bug | Feedback` and prioritized `High | Medium | Low`. Findings never
  enter the Plan Issue graph or become requirements. The Lead records fix,
  different resolution, or cancellation with rationale in the repair plan. The
  Reviewer reads it before accepting or reopening a Finding.
- Each of at most three repair loops builds and reviews the complete outcome.
  Prior findings are additional signal, never the next round's scope.
- Simplify preserves behavior and returns semantic changes to Build. Ship creates
  only the PR.

## Mechanics

Retain path containment, atomic Issue moves, dependency readiness, exact candidate
binding, one Review verdict, and provider-neutral fallback process control. Add
only the minimum facts needed for the accepted contract: canonical routes and
phases, frozen Plan Issue set, Review Finding provenance/type/priority,
three-loop ceiling, and
repository-native accepted-Spec identity. Mechanics never select roles, classify
findings, choose remedies, or judge quality.

Trim stale validation rather than extending the old protocol. Templates and
validators must agree, with one integration test proving that generated canonical
artifacts validate. Spec templates use the accepted human-readable spine and
delete unearned conditional sections. Prompt prose belongs in artifacts and
behavioral evals, not wording-lock unit tests.

## Proof

1. Run all deterministic Forge tests against the shipped templates and mechanics.
2. Check every live Forge Markdown link with a worktree-safe command.
3. Run Python compilation and diff hygiene.
4. Run behavioral eval cases for route/lifecycle selection, authority repair,
   provisional parallel Build, no per-Issue Review, Review Finding disposition,
   whole-outcome repair, harness compliance, visual QA, and PR-only Ship.
5. Freeze one integrated candidate for independent Review. Repair only admitted
   High or justified Medium findings while continuing to target the full accepted
   outcome.
