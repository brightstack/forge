# Install Forge

The public install is one curl: a compiled CLI at `~/.local/bin/forge`, then
`forge setup` copies the latest skill pack from GitHub into this project.

macOS and Linux only. Windows and npm are out of this release.

## Curl

Run this from the project directory you want Forge in. Default host is
`.agents` (Cursor and Codex):

```bash
curl -fsSL https://get.brightstack.ai/forge/install.sh | sh
```

Claude Code:

```bash
curl -fsSL https://get.brightstack.ai/forge/install.sh | FORGE_TOOLS=claude sh
```

The installer:

1. Downloads a checksummed gzipped binary for darwin/linux x64/arm64.
2. Writes `~/.local/bin/forge` and makes it executable.
3. Invokes that absolute path: `~/.local/bin/forge setup --repo "$PWD"`.

It does not edit shell rc files. If `~/.local/bin` is not on PATH, it prints
the export line. Setup still runs because the installer calls the binary by
absolute path.

Public URLs:

- `https://get.brightstack.ai/forge/install.sh`
- `https://get.brightstack.ai/forge/releases/latest/forge-$os-$arch.gz`
- `https://get.brightstack.ai/forge/releases/latest/SHA256SUMS`

Checksum mismatch fails closed.

## Setup versus init

`forge setup` installs skills into the project. `forge init` creates a loop.
They are different commands.

```bash
forge setup
forge init LOOP --title "A readable title"
```

`--repo` defaults to `.`. Run both from the project directory, not from
`~/.local/bin`. The binary directory is not a skill pack and must not receive
`skills/` or `agents/`.

Default `--tools` is `agents` (Cursor and Codex). Other hosts:

```bash
forge setup --tools claude
forge setup --tools cursor
forge setup --tools agents,claude,cursor
```

Unknown tools fail. Setup overwrites only Forge-owned names (`skills/forge`,
`skills/forge-code-review`, `agents`, `OKF.md`). Other skills stay.

Default setup fetches the latest default branch of
https://github.com/brightstack/forge into a temp directory, copies the pack, and
deletes the temp tree. Git is required for that fetch and for `forge candidate`.
If GitHub is unreachable, the command fails with a clear error.

`--pack <dir>` skips the network and copies from a local package tree (this
checkout, or CI):

```bash
forge setup --pack /path/to/forge
```

`--pack` must point at the Forge package layout: `skills/forge`,
`skills/forge-code-review`, `agents/`, and `OKF.md` at that root. It is not the
directory that holds the `forge` binary.

## First use

After install, from a project directory:

```bash
forge setup
forge init LOOP --title "A readable title"
forge docs create issue spec/issue.md --title "A readable issue"
forge docs validate
forge candidate
```

`init` does not require git. `candidate` does. Restart the agent if a new
skill directory is not visible.

Give the agent the `forge` path when a request creates or validates managed
Forge state. Skill invocation happens in agent chat. The executable does not
select phases.

## LLM paste prompt

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
   curl -fsSL https://get.brightstack.ai/forge/install.sh | FORGE_TOOLS=claude sh
   If the installer says ~/.local/bin is not on PATH, tell the human how to add
   it. Do not edit shell rc files.
2. If `forge` is already installed, run `forge setup --tools claude` from this
   project directory.
3. Read `.claude/skills/forge/SKILL.md` and use it as the Forge workflow for
   this request. Follow this repository's own harness after that.
4. Ask the human for the stopping boundary if they did not name one.
```

## Build from source

Contributors with this package checkout:

```bash
bun install --frozen-lockfile
bun run build:cli
./dist/forge setup --pack . --repo /path/to/project
```

Document templates are compiled into the binary. Skills stay on GitHub or in
`--pack`. Do not copy skills next to the binary.
