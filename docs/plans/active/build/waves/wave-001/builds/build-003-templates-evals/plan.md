# Build plan: build-003 - templates and semantic evals

BLUF: Adapt the existing Agent Loop research into a minimal Forge artifact set and semantic regression pack without changing workflow authority.

- Persistence timestamp: 2026-08-19T02:46:50Z
- Execution timing: This is a retrospective persistence of the plan established by the dispatch before edits began. The work ran before this file existed; this file does not claim otherwise.
- Issue: `FORGE-001`, Wave 1 assignment 3 in `wave-001/index.md`
- Binding authority: the user's Forge v1 plan; the Builder dispatch; `contracted-adaptive-workflows.md`; `review-and-final-verification-design.md`; `agent-loop-failure-modes.md`; and the proposed file-protocol templates
- Starting source: commit `7e540c1cf` in the `agent-loop-sdlc-vnext` worktree
- Ownership boundary: only `apps/forge/skills/forge/assets/**` and `apps/forge/evals/**`
- Excluded: skills, workflow references, application code, tests, other plan files, commits, and the existing Agent Loop

## Current flow and reuse

The research templates already defined the artifact boundaries. Reuse those contracts, remove old terminology and ceremony, and keep one human-readable template per earned artifact. Express failure modes as semantic Markdown cases rather than prompt-wording tests.

## Route

1. Inspect only the routed research and existing templates.
2. Create concise Forge templates for indexes, authority records, Plan artifacts, Build handoffs, Wave Review, Final Verify, Acceptance, and release.
3. Create semantic cases for the nine required authority, orchestration, runtime, and proof regressions.
4. Check filenames, Markdown structure, tables, terminology, and owned-path scope.

## Proof

| Contract | Check | Expected result |
| --- | --- | --- |
| Required template coverage | Inventory `apps/forge/skills/forge/assets/*.md` | 17 templates, including the 16 routed assets and `log.md` |
| Required eval coverage | Inventory `apps/forge/evals/**/*.md` | Eval contract plus nine named cases |
| Review admission | Inspect `review.md` | Stable IDs and all five admission fields; one repair batch; no finding-count cap |
| Terminology and formatting | Scoped searches and Markdown table check | No deprecated naming, forbidden dash characters, whitespace errors, or malformed tables |

## Stop conditions

- Stop rather than invent product behavior, proof obligations, or new workflow stages.
- Route any required edit outside the ownership boundary to the Manager.
