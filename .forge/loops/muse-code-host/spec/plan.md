---
id: "296809ae-94d3-4350-af35-9b38a344d200"
code: "PLAN-296809ae"
type: "plan"
title: "Add Muse Code as a supported host"
status: "draft"
createdAt: "2026-09-29T04:22:16.848Z"
updatedAt: "2026-09-29T04:22:16.848Z"
---
# Add Muse Code as a supported host

## Summary

Prove, on a human-run macOS machine with Muse Code, that the existing default
`forge setup` (`--tools agents`, writing `.agents/skills/...`) already gives
Muse Code the same `/forge` lifecycle, then, only if that proof passes, name
Muse Code in the host docs. No code, tool value, or skill-corpus change is
planned. Authority: [brightstack/forge#2](https://github.com/brightstack/forge/issues/2)
plus the human-accepted Launch revision recorded in the [loop index](../index.md).

## Context

- Issue #2 owns outcomes, acceptance criteria, non-functional limits, and open
  questions; this Plan does not restate them. Its Muse Code facts (skill roots,
  `muse skills validate`, lead/subagent worktrees, observers) are the issue
  author's 2026-09-29 claims and are unverified by this loop.
- Accepted Launch revision (human, before "go"): replace the issue's
  "`.claude/skills` present" boundary case with setups (a)–(c) below, and have
  install.md tell Cursor-only and Claude-only users to add `agents`
  (e.g. `forge setup --tools agents,cursor`).
- Current flow: `src/setup.ts` maps `agents|claude|cursor` to `.agents|.claude|.cursor`
  and copies `skills/forge`, `skills/forge-code-review`, `agents/`, `OKF.md` under
  the chosen root; default is `agents`. That is already Muse's claimed project
  path, so the reusable machinery is the whole install path.
  `references/runtime.md` already says the host owns spawning/scheduling and
  Forge reports gaps the host cannot provide — the natural framing for any
  subagent/observer limitation.
- Constraint: the Coordinator's Linux container cannot run Muse Code (macOS or
  Windows, paid plan). Forge itself is macOS/Linux only (install.md), so the
  human proof machine must be macOS; Windows Muse users are out of reach.

## End State

A macOS user with Muse Code runs the default Forge install, invokes `/forge` and
`/forge-code-review`, and gets the same lifecycle as other hosts; a Quick loop
has run end to end there with its records returned as evidence; Muse subagent
and observer interaction is either shown compatible or documented as a known
limitation; install.md and `references/cli.md` name Muse Code under the default
`agents` install and tell `--tools cursor` / `--tools claude` users to add
`agents`. Nothing claims support that the human-run evidence did not show.

## Plan

1. **Human-run Muse proof (gate for everything else).** On the user's macOS
   machine, in a small real repository, run the checks in *Integration and
   Proof* and return the evidence listed there. The Engineer supplies a short
   runbook; the human executes it.
2. **Decide from evidence.** If every stopping condition below is clear,
   proceed to 3. Otherwise return to the human with the recorded failure.
3. **Docs edit.** Update the host sentences in install.md (lines 11 and 55
   area) and `skills/forge/references/cli.md` (line ~22): Muse Code joins
   Cursor and Codex under `agents`; add one sentence that Cursor-only or
   Claude-only installs must add `agents` for Muse Code. Add a concise
   known-limitation note only if step 1 found one. Setup help text in
   `src/cli.ts` lists tool values, not hosts, and stays unchanged.
4. **Container checks, simplify, independent Review**, then Acceptance using the
   returned Muse records by reference.

## Integration and Proof

Container-runnable (Coordinator/Engineer, Linux):

- `bun run check`, `bun run build:cli`, `FORGE_TEST_BINARY="$PWD/dist/forge" bun test ./tests`,
  `git diff --check` — must stay green; the docs edit touches no tested string
  (`tests/setup.test.ts` asserts tool parsing and written paths only).
- `forge setup --pack . --repo <tmp>` for `agents`, `agents,cursor`, and
  `cursor` alone: confirm `.agents/skills/{forge,forge-code-review}/SKILL.md`
  exist only when `agents` is selected, and SKILL.md frontmatter is plain
  `name` + `description` with relative internal links. This proves the paths the
  docs will name; it cannot prove Muse discovery.

Human-run on macOS with Muse Code (return: command transcripts or screenshots,
Muse version, and the loop's `.forge/loops/<id>/` records):

- `forge setup` in a real repo succeeds; `muse skills validate` on both skills
  passes (record exact output either way).
- Setup (a), `.agents/skills` only: `/forge` and `/forge-code-review` appear and
  activate the correct skill; no collision with `/plan`, `/grill`, `/taste`,
  `/threejs`.
- Setup (b), (a) plus Forge at user level in `~/.codex/skills` and/or
  `~/.claude/skills`: record whether `/forge` loads once or twice and which copy
  wins.
- Setup (c), `.cursor/skills` only (`--tools cursor`): confirm Muse does **not**
  discover `/forge`, which justifies the "add `agents`" doc sentence.
- One Quick-depth loop end to end on a small real change, producing the
  expected index/log/Plan/Build/Review records.
- During that loop, observe (i) whether Forge's Engineer/Reviewer dispatch runs
  under Muse's lead/subagent worktree model without two competing orchestrators,
  and whether separate clean-context Review is actually achieved; (ii) whether
  Muse's verification observer duplicates or contradicts Forge Review.

Proof distinguishes the change: (c) negative plus (a) positive show the docs'
host mapping is real rather than inferred from the issue.

## Proportional Preservation

- Signals: docs-only edits to install.md and a skill reference
  (`references/cli.md`, which ships in the installed corpus); no API, type,
  persistence, or test-expectation change.
- Affected obligations and preserved outcomes: existing Cursor, Codex, and Claude
  Code install instructions and the `agents` default stay correct; setup
  behavior and `--tools` values are unchanged; the cli.md edit is generic host
  documentation, not a Muse-specific corpus change.
- Selected checks: the container suite above; human-run (a)–(c) and the Quick
  loop.
- Gaps: no Muse Code in the container, so discovery, validation, and lifecycle
  proof exist only as returned human evidence; Windows Muse is untestable
  because Forge does not support Windows.

## Risks and Open Decisions

- Stopping conditions — return to the human, do not add a `muse` tool value or
  alter the skill corpus: `muse skills validate` rejects unmodified SKILL.md;
  setup (b) double-loads `/forge` or picks a stale user-level copy; setup (a)
  fails to discover the skills, so `agents` is insufficient; Muse's lead
  orchestration prevents Forge dispatch or clean-context Review in a way a
  documented limitation cannot honestly cover; any Muse fact from the issue
  proves false in a way that changes the docs' claim.
- Open (human): README.md also names hosts ("Cursor and Codex" at lines 28,
  53, 87 and host-specific paste prompts) but is outside the issue's criteria.
  Include it in the docs edit or leave it?
- Open (human): if (b) double-loads, is a documented "install in one place"
  note acceptable, or is that a stop?
- Open (human, from issue): whether Forge should constrain Muse's multi-worker
  default; this Plan only observes and documents.
- Risk: without the Muse evidence the docs edit must not ship; Build is blocked
  on step 1.
