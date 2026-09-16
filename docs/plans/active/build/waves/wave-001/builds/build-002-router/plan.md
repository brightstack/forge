# Build plan: build-002-router - Forge Manager router and workflow references

BLUF: Create only the thin Forge Manager router and progressively loaded workflow
references, preserving native-first dispatch, specialist ownership, one Review
per Wave, one bounded repair batch, and one final Verify.

- Persistence timing: Written 2026-08-19T02:46:35Z after the source edits and
  candidate commit to repair missing Wave handoff W001-F004. This records the
  actual pre-edit assignment and route; it does not claim the file existed before
  execution.
- Issues: Direct Wave assignment from the user-approved Forge v1 plan; no separate
  Issue file was assigned.
- Binding decisions and standards: `apps/forge/docs/plans/active/build/spec.md`,
  `apps/forge/docs/plans/active/build/decisions.md`,
  `docs/research/agent-loop-sdlc-2026/contracted-adaptive-workflows.md`,
  `docs/research/agent-loop-sdlc-2026/decisions.md`,
  `docs/research/agent-loop-sdlc-2026/pocock-osmani-clarification-research.md`,
  `docs/references/agent-loop-failure-modes.md`,
  `docs/rules/execution-discipline.md`, and `docs/rules/writing-style.md`.
- Starting source: Base `7e540c1cfc399b9e661f559314660743c6443c1f`
  on branch `codex/agent-loop-sdlc-vnext` in
  `/Users/marcelowiermann/Code/bright/flash/.worktrees/agent-loop-sdlc-vnext`.
- Assumptions: Other Wave Builders own `apps/forge/agents/`,
  `apps/forge/skills/forge/assets/`, and `apps/forge/evals/`; this Build may link
  their anticipated paths but must not create or edit them.

## Current flow and reuse

The accepted research already defines the lifecycle, decision rights, planning
levels, Wave boundary, Review-versus-Verify split, clarification policy, runtime
priority, and file protocol. Reuse those decisions rather than designing another
workflow. Keep `SKILL.md` to Manager role, invariants, routing, progressive
activation, and compact state. Put each phase procedure in one focused reference.

Original write boundary:

- Own only `apps/forge/skills/forge/SKILL.md` and
  `apps/forge/skills/forge/references/**`.
- Do not use the repository create-skill procedure.
- Do not edit assets, evals, agent roles, plan records, source outside the owned
  paths, or Git state.
- Do not commit.

Original language and behavior locks:

- Use `Forge` only. Never use the previous product name or deprecated runner
  term.
- Default to native subagents and models. Use the generic CLI fallback only when
  native delegation is unavailable, lacks an explicitly requested capability,
  or the user explicitly requests a CLI.
- Keep the exact lifecycle `Intake -> Research -> Plan -> Build -> Verify -> Ship`.
- The Manager never authors, integrates, Reviews, verifies, or repairs specialist
  work.
- Plan is conditional; Review occurs once per Wave; final Verify occurs once;
  Auto preserves rigor and clarification occurs at commitment boundaries.

## Route

1. Read the binding rules and accepted research, then extract only the Manager's
   routing and authority contract.
2. Write a thin `SKILL.md` plus focused references for protocol/state,
   Intake/routing, Research, Plan, Build/Waves/Review, final Verify, Ship,
   runtime, and concise reporting/failure routes.
3. Link anticipated local artifact templates, coordinate exact names with their
   Builder, and avoid duplicating professional craft manuals.
4. Run scoped relative-link, forbidden-term, and trailing-whitespace checks.

## Proof

| Contract | Check | Expected result |
| --- | --- | --- |
| All router and reference links resolve | `python3 docs/scripts/check-links.py apps/forge/skills/forge` | `OK` with no broken relative links |
| Forge vocabulary only | `rg -ni '\b(agent[f]orce\|se[a]t\|se[a]ts)\b' apps/forge/skills/forge || true` | No matches |
| Clean Markdown lines | `rg -n '[[:blank:]]+$' apps/forge/skills/forge/SKILL.md apps/forge/skills/forge/references || true` | No matches |
| Progressive reference set exists | `find apps/forge/skills/forge/references -maxdepth 1 -type f -print | sort` | Exactly the nine assigned workflow references |

## Stop conditions

- A requested behavior conflicts with the user-approved Forge v1 plan or current
  accepted decision authority.
- Completing the router requires editing outside the assigned write boundary.
- Template names cannot be coordinated without inventing or creating assets.
- A material product, authority, release, or one-way decision is missing.

<!-- Builder-owned. Persisted after execution as an explicit protocol repair. -->
