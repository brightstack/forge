# Build plan: build-001-contracts - Forge contract and active Build package

BLUF: Add the concise Forge entry, role boundaries, and accepted active Build
package without touching the shared Agent Loop or implementation paths owned by
other Wave 1 Builders.

- Persistence timing: Written at `2026-08-19T02:46:41Z` after the source work and
  candidate commit because Wave Review found that the original direct Build plan
  and result had not been persisted. This document reconstructs the original
  pre-edit assignment; it does not claim to have existed before execution.
- Execution timing: The Builder received and followed this assignment before
  source edits that became candidate `a521e11a1`.
- Issues: User-accepted Forge v1 plan; Wave 1 contract assignment; `FORGE-001`
  created by this Build as part of the accepted package.
- Binding decisions and standards: root `AGENTS.md`;
  `docs/rules/execution-discipline.md`; `docs/rules/writing-style.md`;
  `docs/rules/plans-folder.md`;
  `docs/research/agent-loop-sdlc-2026/decisions.md`;
  `docs/research/agent-loop-sdlc-2026/contracted-adaptive-workflows.md`; and
  `docs/references/agent-loop-failure-modes.md`.
- Starting source: branch `codex/agent-loop-sdlc-vnext`, head
  `7e540c1cfc399b9e661f559314660743c6443c1f`, worktree
  `/Users/marcelowiermann/Code/bright/flash/.worktrees/agent-loop-sdlc-vnext`.
- Original authority boundary: edit only the root `AGENTS.md` Forge App Dispatch
  row; `apps/forge/AGENTS.md`; `apps/forge/README.md`; `apps/forge/agents/**`; and
  `apps/forge/docs/plans/active/build/**`. Do not use harness-authoring procedures,
  edit another path, or commit.
- Assumptions: Forge v1 should preserve the accepted research contract while
  using the user's latest names and runtime decisions as the stronger authority.

## Current flow and reuse

The existing repository had the Agent Loop vNext research and failure-mode evals
but no `apps/forge` package. Reuse their accepted lifecycle, ownership, Wave,
Review, Final Verify, clarification, and authority boundaries. Do not replace the
shared Agent Loop. Create only human-readable Forge authority and role files in
the assigned surface.

## Route

1. Add one root App Dispatch row plus the Forge package entry and concise,
   non-overlapping Manager, Product, Design, Engineering, Reviewer, Research, and
   QA role contracts.
2. Add the active Build package with accepted decisions, Spec, Technical Design,
   Plan, Verification Plan, two factual Issues, and two Wave indexes.
3. Check scoped relative links, forbidden Forge vocabulary, Markdown whitespace,
   and the exact owned file set. Return the direct handoff without committing.

## Proof

| Contract | Check | Expected result |
| --- | --- | --- |
| Owned Markdown is navigable | Scoped Python relative-link check | Every relative target exists |
| Forge naming is consistent | Scoped case-insensitive scan for the previous working name and deprecated agent-runner term | No match in owned Forge files |
| Patch is mechanically clean | `git diff --check --` with the owned paths | Exit 0 |
| Ownership is surgical | `find` and `git diff -- AGENTS.md` | Only the assigned files and one dispatch row |

## Stop conditions

- A requested change outside the dispatched ownership boundary.
- A conflict with an accepted user decision or the exact six-stage lifecycle.
- A requirement for a service, provider adapter, dependency, or semantic
  controller not accepted for Forge v1.

<!-- Builder-owned. Persisted after execution as an explicit Review repair. -->
