# Forge

**Give your coding agent a delivery process you can trust.**

[![Beta](https://img.shields.io/badge/status-beta-yellow)](https://github.com/brightstack/forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Website: [forge.brightstack.ai](https://forge.brightstack.ai). From [Bright](https://www.brightstack.ai).

> **Beta.** Forge is early and we improve it daily. Skills, records, and CLI
> behavior can still change. Follow [the GitHub repo](https://github.com/brightstack/forge)
> for the latest.

Forge turns an agreed outcome into working, reviewed, accepted software. It
combines composable agent skills, professional personas, Markdown artifacts, and
a small CLI for bookkeeping.

```text
Spec  ->  [Build <-> Review]  ->  Simplify  ->  Verify  ->  Ship
```

Start with a project, an issue, a bug, or a quick patch. Use the whole lifecycle
or call one phase. Plan remains a job: brief Engineer notes for Quick work, with
a direct Plan skill available. A separate Engineer simplifies after passing
Build/Review. Changes get affected proof and independent delta Review of the
resulting complete candidate; a no-op retains prior Review. Verify exercises the
reviewed outcome, including browser QA when needed. Forge follows **your repository's stack and standards**.

## Install

macOS and Linux. Default host is `.agents` (Cursor, Codex, and Muse Code):

```bash
curl -fsSL https://get.brightstack.ai/forge/install.sh | sh
```

Claude Code:

```bash
curl -fsSL https://get.brightstack.ai/forge/install.sh | FORGE_TOOLS=claude sh
```

That writes `~/.local/bin/forge` and runs `forge setup` in the current directory.
The binary is the full mechanics CLI: setup, loop init, docs, candidate, memory,
and serve. Skills come from GitHub at setup time, not from bytes inside the
binary. See [install.md](install.md) for PATH, hosts, and first-use.

Windows and npm are out of this release.

## Install for LLMs

If you are a coding agent, install Forge into the current project, then follow
the skill. Do not invent a different workflow. Select the host that matches the
agent you are.

**Cursor, Codex, or Muse Code** (writes `.agents`):

```text
Install Forge in this project.

1. If `forge` is missing, run:
   curl -fsSL https://get.brightstack.ai/forge/install.sh | sh
   If the installer says ~/.local/bin is not on PATH, tell the human how to add
   it. Do not edit shell rc files.
2. If `forge` is already installed, run `forge setup` from this project
   directory.
3. Read `.agents/skills/forge/SKILL.md` and use it as the Forge workflow for
   this request. Follow this repository's own harness after that.
4. Ask the human for the stopping boundary if they did not name one.
```

**Claude Code** (writes `.claude`):

```text
Install Forge in this project.

1. If `forge` is missing, run:
   curl -fsSL https://get.brightstack.ai/forge/install.sh | FORGE_TOOLS=claude sh
   If the installer says ~/.local/bin is not on PATH, tell the human how to add
   it. Do not edit shell rc files.
2. If `forge` is already installed, run `forge setup --tools claude` from this
   project directory.
3. Read `.claude/skills/forge/SKILL.md` and use it as the Forge workflow for
   this request. Follow this repository's own harness after that.
4. Ask the human for the stopping boundary if they did not name one.
```

Humans can paste one of these:

**Cursor, Codex, or Muse Code**

> Install Forge in this repo with `curl -fsSL https://get.brightstack.ai/forge/install.sh | sh`, then read `.agents/skills/forge/SKILL.md` and use Forge for this request. Stop after Plan unless I ask you to build.

**Claude Code**

> Install Forge in this repo with `curl -fsSL https://get.brightstack.ai/forge/install.sh | FORGE_TOOLS=claude sh`, then read `.claude/skills/forge/SKILL.md` and use Forge for this request. Stop after Plan unless I ask you to build.

The lowercase `forge` executable handles managed records, validation, candidate
snapshots, and memory writes. It does not select phases, so there is no
`forge plan` or `forge build` shell command.

## Prompt your agent

Name the stopping boundary.

**Claude Code**

> `/forge:plan` Plan this accepted issue: `<issue>`. Stop after Plan.

**Cursor**

> `/forge` Use Forge to build this accepted issue: `<issue>`. Include independent
> Review and stop there.

**Codex**

> `$forge` Use Forge to run Verify on the current reviewed candidate.
> Exercise the real behavior and stop before Ship.

**Muse Code**

> `/forge` Use Forge to fix this bug: `<bug>`. Stop after independent Review.

| Request | Result |
| --- | --- |
| `Forge explore …` | Evidence, options, and unanswered questions |
| `Forge spec …` | Product, design, technical, issue, bug, or work intent |
| `Forge plan …` | Implementation approach |
| `Forge build …` | Implementation, review, and repair |
| `Forge review …` | Read-only engineering verdict |
| `Forge simplify …` | Bounded simplification, affected proof and independent Review of the whole result when changed; no mandatory pre-edit Review PASS |
| `Forge explain …` | Read-only explanation of an artifact or change |
| `Forge verify …` | Actual acceptance, including browser QA when needed |
| `Forge finish …` | Reconcile approved Spec and knowledge changes at work completion |
| `Forge ship …` | Authorized publication |

Claude setup registers `/forge:spec`, `/forge:plan`, `/forge:build`,
`/forge:review`, `/forge:simplify`, `/forge:verify`, and `/forge:ship` through native command
files. Each delegates to its owning `forge-<phase>/SKILL.md`. The generic `forge`
skill remains the router. See the [host matrix and copying instructions](install.md)
for the current invocation limits, including the unresolved literal Codex colon
syntax. A copied command file alone does not prove that a host invoked it. Direct Build
or Review stops before Simplify unless also authorized; direct Simplify stops
before QA or Ship, records actual prior Review or its absence, and requires
independent Review of a changed result without adding a pre-edit Review PASS gate.

Guided is the default: Forge waits before dispatch, then at a new Spec and a
consequential Plan. Asking for full delivery does not pre-approve unseen work.

Depth lives in [Launch](skills/forge-shared/references/workflows.md). New loop
records live under `~/.forge/repos/<repository-key>/loops/<loop>/`.
Root `forge.yml` can set `loopsPath` to another loop parent; relative values
resolve from the target repository. Existing `.forge/loops/` records stay usable
in place. Source and canonical memory stay in the target repository. See the
[record contract](skills/forge-shared/references/protocol.md) and
[CLI guide](skills/forge-shared/references/cli.md).

```bash
forge init example --title "Example"
forge docs create issue spec/issue.md --loop example --title "Example issue"
forge docs validate --loop example
```

Loop records use Markdown frontmatter for identity and loop-local codes, without
a JSON Issue registry. CLI edits keep identity fields immutable. A raw file edit
cannot be compared with an original loop registration that is no longer stored.
Canonical Spec/knowledge guards retain their separate registration and approval
checks.

At actual work completion, `Forge finish <loop>` reconciles approved unapplied
Spec changes and stops processes owned by the work when they are no longer
needed. Explicit `Forge spec apply <change>` uses the guarded memory operation;
see [memory](skills/forge-shared/references/memory.md). These are agent operations,
not executable CLI subcommands, and do not grant publication authority.

## Develop

```bash
bun install --frozen-lockfile
bun run check
bun run build:cli
FORGE_TEST_BINARY="$PWD/dist/forge" bun test ./tests
```

These tests cover CLI mechanics. Forge's behavioral evaluation suite, which is
what actually measures instruction quality, is not yet public.

## License

[MIT](LICENSE). Copyright 2026 Bright. Dependencies and attributed source retain
their own licenses. See [third-party notices](THIRD_PARTY_NOTICES.md).
