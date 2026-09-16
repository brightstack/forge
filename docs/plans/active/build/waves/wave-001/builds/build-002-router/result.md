# Build result: build-002-router - Forge Manager router and workflow references

BLUF: Forge now has a thin native-first Manager router and nine focused workflow
references that preserve accepted authority, Wave-level Review, bounded repair,
and spec-grounded final Verify without creating another workflow service.

- Status: DONE_LOCAL
- Issues: Direct Wave assignment from the user-approved Forge v1 plan; no separate
  Issue file was assigned.
- Plan: `apps/forge/docs/plans/active/build/waves/wave-001/builds/build-002-router/plan.md`
- Source: Repository `bright/flash`; base
  `7e540c1cfc399b9e661f559314660743c6443c1f`; exact integrated candidate
  `a521e11a179f05cd6f93c5f82738bb3c24d75b62`; branch
  `codex/agent-loop-sdlc-vnext`; worktree
  `/Users/marcelowiermann/Code/bright/flash/.worktrees/agent-loop-sdlc-vnext`.
- Environment: macOS worktree, zsh, Python 3 standard library; documentation-only
  Build with no application runtime or dependency installation.

## Built

- Added `apps/forge/skills/forge/SKILL.md`, a 101-line router containing only the
  Manager role, accepted invariants, start/resume route, progressive reference
  activation, and compact state result.
- Added `references/protocol.md`, `intake.md`, `research.md`, `plan.md`,
  `build.md`, `final-verify.md`, `ship.md`, `runtime.md`, and `reporting.md`.
- Made native subagents and models the default. Kept `forge agent` as a generic
  fallback for unavailable native delegation, a missing explicitly requested
  capability, or an explicit CLI request.
- Kept the Manager out of specialist authoring, source integration, Review,
  Verify, and repair. Build assigns integration and repair to Builders.
- Enforced one Review of the exact integrated Wave candidate and one repair batch
  for admitted P0 and material non-nit P1 findings followed by targeted closure.
- Required final Verify to map proof to accepted Specs, decisions, Issues, and
  repository authority while rejecting invented requirements, hypothetical
  cases, and stronger unaccepted guarantees.
- Coordinated and linked the exact local asset filenames without creating or
  editing assets.

## Evidence

| Contract | Command or artifact | Result |
| --- | --- | --- |
| Relative links resolve | `python3 docs/scripts/check-links.py apps/forge/skills/forge` | PASS - `OK - all relative links resolve under .../apps/forge/skills/forge` |
| No deprecated product or runner vocabulary | `rg -ni '\b(agent[f]orce\|se[a]t\|se[a]ts)\b' apps/forge/skills/forge || true` | PASS - no matches |
| Markdown has no trailing whitespace | `rg -n '[[:blank:]]+$' apps/forge/skills/forge/SKILL.md apps/forge/skills/forge/references || true` | PASS - no matches |
| Assigned references exist | `find apps/forge/skills/forge/references -maxdepth 1 -type f -print | sort` | PASS - nine files: build, final-verify, intake, plan, protocol, reporting, research, runtime, and ship |
| Owned changes are in the Wave candidate | `git show --format='' --name-only a521e11a1 -- apps/forge/skills/forge` | PASS - router and all nine references are present in candidate `a521e11a1` |

## Deviations or blockers

- The required `plan.md` and `result.md` were not persisted before integration.
  They were written at 2026-08-19T02:46:35Z after execution and candidate commit
  to close W001-F004. The plan explicitly records this timing and reconstructs
  the original dispatched assignment without claiming retroactive authorship.
- The original Build made no commit, as assigned. The integration candidate
  commit `a521e11a1` was created later and also contains work owned by other Wave
  Builders.
- No remaining source, proof, or authority blocker was observed in the owned
  router surface.

## Integration notes

- The reviewed source candidate remains `a521e11a1`; these two handoff artifacts
  document that candidate and do not alter its Forge router contents.
- The router's asset links resolve against the template Builder's files in the
  same candidate.
- No existing Wave index, Review report, spec, decision, or Git state was edited.

<!-- This report claims only the Builder's owned result and scoped evidence. -->
