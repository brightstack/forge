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
- Boundary: Plan, then Build on the human's later request (Acceptance and Ship not requested)
- Sequence: Spec reused (Issue #2); Plan approved; Build with independent Review PASS; Finish recorded; Acceptance and Ship not run
- Gates: Launch accepted; Plan approved by the human in conversation ("Yes. Approval of the plan"), answers recorded in the Plan; Reviewer boundary review PASS
- Workspace: brightstack/forge, branch `claude/relaxed-davinci-xzvnrg`
- Launch acceptance or Auto grant: human accepted the Launch with "go" in conversation, after a human-accepted scope revision (below)
- Current step: complete; human approved push, opened as PR #4, and merged it; Issue #2 closed
- Authority status: Issue #2 plus accepted Launch revision; no new canonical decisions
- Accountable owner: Engineer
- Current candidate: `git:510fe415942e861300baab02e7cee51d00039941:sha256:197c4ecd760e95a8f81246c28ebea88d5bd695f6c0740e5d8f083dbffc951b28`, committed as `69ea3b0` and merged to `main` in `a925be0`
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

- Muse Code proof is human-run on macOS with Muse Code 1.4.1 only; Windows untested.
- A `forge setup` warning for duplicate user-level copies is left open as [brightstack/forge#3](https://github.com/brightstack/forge/issues/3).

## Next

None for this loop. Follow-up lives in brightstack/forge#3.
