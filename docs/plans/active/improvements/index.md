# Forge vNext

Forge vNext is the accepted live authority for current Forge work. It supersedes
v1's lifecycle and pre-Build orchestration contracts while preserving the v1
Build package as historical implementation evidence.

## Accepted authority

- [Decisions](decisions.md) - binding vNext ownership, lifecycle, Build
  coordination, Review boundary, model profiles, and simplicity decisions.
- [Lead and Reviewer proposal](lead-reviewer-proposal.md) - binding phase
  topology, authority repair, shared state, Review Findings, repair loops, and
  visual-quality behavior.
- [Improvement plan](plan.md) - target workflow and implementation implications.

## Review evidence

- [Final proposal review](lead-reviewer-proposal-final-review.md) - independent
  adversarial gate before the human Issue-authority correction. Decision D13
  supersedes its references to Reviewer-created Issues.
- [Build-only evaluation handoff](build-only-eval-handoff.md) - measured small-app
  Build latency, quality comparison, and the unaccepted next simplification to
  evaluate.

## Current target

```text
Intake -> Spec -> Plan -> Build -> Verify -> Simplify -> Ship
```

Forge has three routes: `Work`, `Build`, and `Bug Fix`. `Build` is the full SDLC
above. `Bug Fix` uses the same order with a Bug Spec and proportionate depth.
`Work` handles non-SDLC outcomes through a Work Spec without manufacturing
product-development ceremony.

The package at [../build/index.md](../build/index.md) records Forge v1's shipped
candidate and proof. Read it for provenance, not as current workflow authority.
