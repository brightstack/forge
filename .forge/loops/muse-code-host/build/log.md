---
id: "6a77ea79-af9b-42f1-9e19-31790659b1a5"
code: "BUILD-LOG-6a77ea79"
type: "build-log"
title: "Build and independent Review"
status: "active"
createdAt: "2026-09-29T04:22:16.799Z"
updatedAt: "2026-09-29T04:22:16.799Z"
---
# Build and independent Review

<!-- Append candidate and Review entries when Build begins. -->

## Candidate: C1 docs host mapping

### Packet and Ownership

- Selected outcomes: Issue #2 docs outcome, limited to Plan step 3 as approved by the human after step 1 evidence; Plan step 2 decision: validate passes, (a) discovers both skills after workspace trust, (c) negative, and the Quick loop ran with separate subagents; (b) met its stopping condition (selecting the second `/forge` entry runs the user-level copy) and returned to the human, who chose to document it and track a warning in brightstack/forge#3
- Accepted authority: [Issue #2](https://github.com/brightstack/forge/issues/2), accepted Launch revision in the [loop index](../index.md), accepted [Plan](../spec/plan.md), and the human's docs-scope instructions after step 1 (setup (b) documented rather than fixed; `forge setup` warning tracked in [brightstack/forge#3](https://github.com/brightstack/forge/issues/3))
- Builder: Engineer
- Delegated work and owned boundaries: none
- Comparison base: `510fe415942e861300baab02e7cee51d00039941` (HEAD); working tree uncommitted
- Candidate identity: `git:510fe415942e861300baab02e7cee51d00039941:sha256:f97926da19571c84f8c3793792c6b6d539c22a1d4a4dc5055fcf5549d4377c80` (`forge candidate --path README.md --path install.md --path skills/forge/references/cli.md`)
- Retained accepted baseline and approved delta: `None.`
- Spec-apply receipt and document-only result hashes: `None.`
- Complete actual code/test/canonical Spec/KB/decision diff: `None.` Docs only: `README.md`, `install.md`, `skills/forge/references/cli.md`.

### Build, Integration, and Simplification

- Implemented: install.md names Muse Code under the default `agents` host (curl section, `--tools` section, `.agents` paste-prompt heading); tells `--tools cursor` / `--tools claude` users to add `agents` (`forge setup --tools agents,cursor`); First use notes the workspace trust prompt and the install-in-one-place / duplicate `/forge` guidance. README.md adds Muse Code to the default-host line and both `.agents` headings, plus a `/forge` Muse Code prompt example. `references/cli.md` changes only the host parenthetical to "Cursor, Codex, and Muse Code".
- Integrated: single-owner docs edit; `src/cli.ts` help text, setup code, tests, and the rest of the skill corpus unchanged.
- Simplification: kept cli.md to the parenthetical rather than adding a sentence; README carries no trust or duplicate notes and defers to install.md, which it already links. No Muse Auto-review statement (unreported).
- Builder checks: `bun run check` pass; `bun run build:cli` pass; `FORGE_TEST_BINARY="$PWD/dist/forge" bun test ./tests` 76 pass, 5 skip, 0 fail (81 tests, 12 files); `git diff --check` clean. `dist/forge setup --pack . --repo <scratch>`: `agents` writes `.agents/skills/{forge,forge-code-review}/SKILL.md`, no `.cursor`; `agents,cursor` writes both roots; `cursor` writes `.cursor` only, no `.agents`. Both SKILL.md files have plain `name` + `description` frontmatter; no absolute or URL links in `forge/SKILL.md`. No `.forge/mutation.lock` or `.forge/.gitignore` left in the repo.
- Known proof gaps: Muse discovery, validation, and lifecycle are human-run evidence only (below); Muse Auto-review interaction with Forge Review not yet reported, so the docs say nothing about it; Windows Muse untestable (Forge is macOS/Linux only).

Human-run evidence (macOS, Muse Code 1.4.1 (1.4.1-R4503.1), 2026-09-29, reported in conversation):

- Default public install (`--tools agents`) wrote `.agents/skills/forge` and `.agents/skills/forge-code-review`; `muse skills validate <path>` returned `valid` for both.
- Project skills are skipped until the workspace is trusted (`project-skills-untrusted`); the interactive trust prompt persists; `muse --trust-workspace` applies to one run only.
- Setup (a): trusted, `/` lists `/forge` and `/forge-code-review` as `project` skills; both invoked; `/forge-code-review` ran read-only and resolved `.agents/agents/reviewer/instructions.md`.
- Setup (b): with `~/.codex/skills/forge`, `muse skills list --source all` reports `skill-shadowed`, but the `/` menu lists `/forge` twice; Enter loads the project copy, selecting the other entry loads the user-level copy. Human decision: document it; no code change.
- Setup (c): `--tools cursor` only gives "No skills found" for project skills.
- One Quick loop ran through Acceptance in Muse Code: Launch waited; Engineer, Reviewer, and QA ran as separate Muse subagents; loop records created and validated with the `forge` CLI; no competing Muse orchestration observed.

### Preservation Scope

- Builder proposal: signals -> affected obligations -> selected checks -> gaps: docs-only edits including one installed-skill reference -> existing Cursor, Codex, Claude Code install instructions and `agents` default stay correct; setup behavior unchanged -> container suite plus three setup runs -> Muse proof is human-run only.
- Paths that narrow discovery: `README.md`, `install.md`, `skills/forge/references/cli.md`.
- Exported contracts or actual semantics that expand discovery: `None.` No tool value, CLI help, or setup path changed.
- Changed or new outcomes, affected unchanged outcomes, and material failures: new: docs name Muse Code under `agents`, the add-`agents` rule, trust and duplicate notes; unchanged: other hosts' instructions; no failures.
- Relevant prior evidence reused and reason: human-run Muse evidence above, because Muse Code cannot run in the Linux container.

### Independent Review

- Reviewer: Reviewer (separate clean context, read-only), two rounds
- Reviewed actual candidate, retained baseline, approved delta, and canonical result: round 1 on C1 (`…f97926da…`), round 2 on `git:510fe415942e861300baab02e7cee51d00039941:sha256:197c4ecd760e95a8f81246c28ebea88d5bd695f6c0740e5d8f083dbffc951b28`; identity recomputed by the Reviewer both times; base `510fe41`; authority = Issue #2, accepted Plan, human decisions (setup (b) documented, [brightstack/forge#3](https://github.com/brightstack/forge/issues/3))
- Lenses and evidence: Spec, Craft, Quality covered directly; Code Review and Design NOT_APPLICABLE (no code, tests, or UI changed); full doc diff and evidence fidelity checked
- Findings and dispositions: round 1 REVISE — P1 install.md named `~/.claude/skills` beyond the setup (b) evidence (fixed, see Repair); P2 cli.md wrap (fixed). Round 2: no findings
- Verdict: PASS on `git:510fe415942e861300baab02e7cee51d00039941:sha256:197c4ecd760e95a8f81246c28ebea88d5bd695f6c0740e5d8f083dbffc951b28`

### Repair or Rethink

- Failed invariant or common cause: Review REVISE, P1: install.md named `~/.claude/skills` as a user-level duplicate to remove, but setup (b) evidence covered only `~/.codex/skills/forge`; the claim rested on the unverified issue and could lead a Claude Code user to delete a working user-level Forge. P2: cli.md host paragraph exceeded the file's ~80-column wrap.
- Whole-packet correction: install.md now says "remove the user-level copy (for example under `~/.codex/skills`)"; cli.md paragraph re-wrapped with unchanged wording. No other doc names `~/.claude/skills` as a duplicate.
- Preserved commitments: all C1 host-mapping, add-`agents`, trust, and install-in-one-place guidance; no Muse Auto-review statement.
- Invalidated and reused proof: C1 identity invalidated; re-ran `bun run check` (pass), `git diff --check` (clean), `dist/forge docs validate` (pass). Test suite and setup runs reused: the repair touches only prose, no tested string or setup path.
- New candidate: `git:510fe415942e861300baab02e7cee51d00039941:sha256:197c4ecd760e95a8f81246c28ebea88d5bd695f6c0740e5d8f083dbffc951b28` (`forge candidate --path README.md --path install.md --path skills/forge/references/cli.md --repo .`)
- Reassessment: first repair cycle; P1 fixed at its source (evidence scope), no rethink trigger.
- Stop reason or next discriminating proof: independent Review round 2 PASS; loop stops at Build boundary pending human approval to commit and push.
