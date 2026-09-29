---
id: "c6a4b2f4-19c1-4180-a9cd-cbd8168c3ac7"
code: "INDEX-c6a4b2f4"
type: "index"
title: "Add Muse Code as a supported host"
status: "active"
createdAt: "2026-09-29T04:22:16.715Z"
updatedAt: "2026-09-29T04:22:16.715Z"
---
# Current loop state

As of 2026-09-29.

## Outcome

Forge installs into and is verified to run inside Meta's Muse Code via the
existing default `agents` install, and install docs say so
([brightstack/forge#2](https://github.com/brightstack/forge/issues/2)). Current
boundary: Plan. Plan drafted; Build pending.

## Launch and Status

- Workflow: Issue
- Depth: Quick
- Control: Guided
- Agents: Engineer, Reviewer
- Boundary: Plan
- Sequence: Spec reused (Issue #2); Plan drafted; Build, Acceptance, Ship not started
- Gates: Launch accepted; Plan approved by the human in conversation ("Yes. Approval of the plan"), answers recorded in the Plan; Reviewer boundary review PASS
- Workspace: brightstack/forge, branch `claude/relaxed-davinci-xzvnrg`
- Launch acceptance or Auto grant: human accepted the Launch with "go" in conversation, after a human-accepted scope revision (below)
- Current step: Plan boundary complete; Build pending
- Authority status: Issue #2 plus accepted Launch revision; no new canonical decisions
- Accountable owner: Engineer
- Current candidate: none
- Comparison base: `7625bbf`
- Applied Spec status and receipt: not applicable

Accepted Launch revision (human, before "go"): replace the issue's
"`.claude/skills` present" boundary case with (a) repo with only
`.agents/skills`; (b) (a) plus Forge at user level in `~/.codex/skills` and/or
`~/.claude/skills`, checking for duplicate `/forge` loading; (c) repo with only
`.cursor/skills`, confirming Muse Code does not discover it. install.md names
Muse Code under the default `agents` install and tells `--tools cursor` /
`--tools claude` users to add `agents` (e.g. `forge setup --tools agents,cursor`).
Rationale: per the issue (unverified here), Muse reads project `.agents/skills`
and user-level `~/.claude/skills` and `$CODEX_HOME/skills`, not repo
`.claude/skills` or `.cursor/skills`.

Quick depth fits a docs-only change over existing setup machinery; the proof is
human-run because Muse Code cannot run in the Linux container. The user can
override depth, staffing, or the README question in the Plan.

## Pointers

- Human decisions: Launch revision above (conversation); [decisions](decisions.md) empty
- Accepted or proposed Spec: [Issue #2](https://github.com/brightstack/forge/issues/2)
- Retained accepted baseline and approved change: none
- Selected Issues or work: [Issue #2](https://github.com/brightstack/forge/issues/2); [Plan](spec/plan.md) (human-approved 2026-09-29)
- Build record: [build log](build/log.md) (empty)
- Acceptance record: none
- Canonical Spec or knowledge: none

## Current Gaps

- Muse Code is unavailable in the container; all Muse discovery, validation, and lifecycle proof must come from human-run steps on macOS.
- Muse Code facts in the issue are unverified.

## Next

Human runs the Muse proof on macOS (Plan step 1) and returns the evidence;
the Engineer supplies the runbook when Build is requested.
