# Forge

**Give your coding agent a delivery process you can trust.**

[![Beta](https://img.shields.io/badge/status-beta-yellow)](https://github.com/brightstack/forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

From [Bright](https://www.brightstack.ai).

> **Beta.** Forge is early and we improve it daily. Skills, records, and CLI
> behavior can still change. Follow [the GitHub repo](https://github.com/brightstack/forge)
> for the latest.

Forge turns an agreed outcome into working, reviewed, accepted software. It
combines composable agent skills, professional personas, Markdown artifacts, and
a small CLI for bookkeeping.

```text
Spec  ->  Plan  ->  Build  ->  Acceptance  ->  Ship
                  -> simplify, review, repair
```

Start with a project, an issue, a bug, or a quick patch. Use the whole lifecycle
or call one phase. Forge follows **your repository's stack and standards**.

## Install

macOS and Linux. Default host is `.agents` (Cursor and Codex):

```bash
curl -fsSL https://get.brightstack.ai/forge/install.sh | sh
```

Claude Code:

```bash
FORGE_TOOLS=claude curl -fsSL https://get.brightstack.ai/forge/install.sh | sh
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

**Cursor or Codex** (writes `.agents`):

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
   FORGE_TOOLS=claude curl -fsSL https://get.brightstack.ai/forge/install.sh | sh
   If the installer says ~/.local/bin is not on PATH, tell the human how to add
   it. Do not edit shell rc files.
2. If `forge` is already installed, run `forge setup --tools claude` from this
   project directory.
3. Read `.claude/skills/forge/SKILL.md` and use it as the Forge workflow for
   this request. Follow this repository's own harness after that.
4. Ask the human for the stopping boundary if they did not name one.
```

Humans can paste one of these:

**Cursor or Codex**

> Install Forge in this repo with `curl -fsSL https://get.brightstack.ai/forge/install.sh | sh`, then read `.agents/skills/forge/SKILL.md` and use Forge for this request. Stop after Plan unless I ask you to build.

**Claude Code**

> Install Forge in this repo with `FORGE_TOOLS=claude curl -fsSL https://get.brightstack.ai/forge/install.sh | sh`, then read `.claude/skills/forge/SKILL.md` and use Forge for this request. Stop after Plan unless I ask you to build.

The lowercase `forge` executable handles managed records, validation, candidate
snapshots, and memory writes. It does not select phases, so there is no
`forge plan` or `forge build` shell command.

## Prompt your agent

Name the stopping boundary.

**Claude Code**

> `/forge` Use Forge to plan this accepted issue: `<issue>`. Stop after Plan.

**Cursor**

> `/forge` Use Forge to build this accepted issue: `<issue>`. Include
> simplification and independent Review. Stop before Acceptance and Ship.

**Codex**

> `$forge` Use Forge to run Acceptance on the current reviewed candidate.
> Exercise the real behavior and stop before Ship.

| Request | Result |
| --- | --- |
| `Forge explore …` | Evidence, options, and unanswered questions |
| `Forge spec …` | Product, design, technical, issue, bug, or work intent |
| `Forge plan …` | Implementation approach |
| `Forge build …` | Implementation, review, and repair |
| `Forge review …` | Read-only engineering verdict |
| `Forge acceptance …` | Actual acceptance, including browser QA when needed |
| `Forge ship …` | Authorized publication |

Guided is the default: Forge waits before dispatch, then at a new Spec and a
consequential Plan. Asking for full delivery does not pre-approve unseen work.

Depth lives in [Launch](skills/forge/references/workflows.md). Records live under
`.forge/` in the **target** repository. See the
[record contract](skills/forge/references/protocol.md) and
[CLI guide](skills/forge/references/cli.md).

## Develop

```bash
bun install --frozen-lockfile
bun run check
bun run build:cli
FORGE_TEST_BINARY="$PWD/dist/forge" bun test ./tests
```

## License

[MIT](LICENSE). Copyright 2026 Bright. Dependencies and attributed source retain
their own licenses. See [third-party notices](THIRD_PARTY_NOTICES.md).
