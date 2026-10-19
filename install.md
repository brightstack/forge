# Install Forge

The public install is one curl: a compiled CLI at `~/.local/bin/forge`, then
`forge setup` copies the latest skill pack from GitHub into this project.

macOS and Linux only. Windows and npm are out of this release.

## Curl

Run this from the project directory you want Forge in. Default host is
`.agents` (Cursor, Codex, and Muse Code):

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

Default `--tools` is `agents` (Cursor, Codex, and Muse Code). Other hosts:

```bash
forge setup --tools claude
forge setup --tools cursor
forge setup --tools agents,claude,cursor
```

Muse Code discovers the `.agents` install. Add `agents` when selecting another
host, for example `forge setup --tools agents,cursor`. Its earlier public
integration was verified with Muse Code 1.4.1; this revised phase pack has not
been revalidated in that host. Trust the workspace before loading project skills;
if Forge appears twice, select the project entry rather than a stale user copy.

Unknown tools fail. Setup replaces the Forge runtime skills and shared support,
the Forge `agents/` catalog, and `OKF.md`. Claude setup also registers the native
phase commands below. Other skills stay. Internal `forge-eval` tooling is not
part of this runtime pack.

Default setup fetches the latest default branch of
https://github.com/brightstack/forge into a temp directory, copies the pack, and
deletes the temp tree. Git is required for that fetch and for `forge candidate`.
If GitHub is unreachable, the command fails with a clear error.

`--pack <dir>` skips the network and copies from a local package tree (this
checkout, or CI):

```bash
forge setup --pack /path/to/forge
```

`--pack` must point at the Forge package layout: the complete runtime skill set,
`commands/claude/forge/`, `agents/`, and `OKF.md` at that root. It is not the
directory that holds the `forge` binary. The runtime folders are `forge`,
`forge-spec`, `forge-plan`, `forge-build`, `forge-review`, `forge-simplify`, `forge-verify`,
`forge-ship`, `forge-code-review`, and the non-discoverable `forge-shared` support
bundle under `skills/`. Shared contracts live in focused `authority.md`,
`pragmatism.md`, `severity.md`, `repair.md`, and `target-harness.md` references;
phase procedures load the relevant owner directly. Target harness routing carries
actual app rule/reference/check paths into professional and Judge assignments.

## Phase invocation and host support

| Host | Registration and invocation | Verification boundary |
| --- | --- | --- |
| Claude Code | Setup copies thin command files to `.claude/commands/forge/`; `/forge:spec`, `/forge:plan`, `/forge:build`, `/forge:review`, `/forge:simplify`, `/forge:verify`, and `/forge:ship` delegate to their named skills with the original request. | Claude 2.1.283 discovery listed the original six colon commands. Simplify and the renamed Verify adapter lack host-discovery proof. The semantic invocation probe stopped before model execution because the host was unauthenticated; phase behavior still needs authenticated proof. |
| Codex | Setup installs discoverable named skill folders in `.agents/skills/`. | Literal `/forge:<phase>` support remains unverified. Do not count another spelling or installation alone as passing this requested interface. |
| Cursor | Setup installs the runtime folders under `.agents/skills/` by default or `.cursor/skills/` with `--tools cursor`. | Literal colon invocation has no verified registration in this pack. |

Claude's [native command naming documentation](https://code.claude.com/docs/en/skills#how-a-skill-gets-its-command-name)
defines the nested command path's colon name. These adapters load the same phase
skills; they do not duplicate workflow logic or grant Auto control. Restart the
agent when required for newly installed entrypoints to appear.

## Copy only Spec or Review

Preserve the relative `skills/` and sibling `agents/` layout. Copy whole named
folders, including their references and assets:

- Spec: `skills/forge-spec/`, `skills/forge-shared/`, the
  `agents/{product-manager,designer,architect,engineer,researcher,reviewer}/`
  professional folders, and `agents/{explorer,worker}/` when delegated. Roles are loaded only
  when the work triggers them; no Build or Review phase is required.
- Review: `skills/forge-review/`, `skills/forge-shared/`,
  `skills/forge-code-review/`, and `agents/{reviewer,designer,judge}/`.

Include `OKF.md` for shared knowledge/memory references and the relevant native
command file when using Claude colon invocation. The target repository's harness
still owns implementation standards. A copy set's presence proves packaging;
exercise the requested operation before claiming behavioral acceptance.
The owning [copy-set guide](skills/forge-shared/references/copy-sets.md) explains
the direct-operation and optional-memory boundaries.

## First use

After install, from a project directory:

```bash
forge setup
forge init LOOP --title "A readable title"
forge docs create issue spec/issue.md --loop LOOP --title "A readable issue"
forge docs validate --loop LOOP
forge candidate
```

`init` does not require Git. `candidate` does. New loop records default to
`~/.forge/repos/<repository-key>/loops/LOOP/`. To select another loop parent,
put this in the target repository's root `forge.yml` before initialization:

```yaml
loopsPath: ./work-records
```

Relative paths resolve from the target repository; absolute and `~/` paths also
work. `--repo` always identifies the target source/canonical repository.
`--loop LOOP` selects its record directory separately, and loop document paths
are relative to that directory. A bare loop ID resumes an existing legacy
`.forge/loops/LOOP/` before looking in the configured new location. Explicit
legacy paths stay in place; setup never migrates history.

Memory operations also accept `--loop`: manifests and prepared input references
resolve within that loop, while canonical target paths stay repository-relative.
Use `Forge spec apply <change>` after exact approval; its procedure prepares and
checks `forge memory verify` before `forge memory apply`. `Forge finish <loop>`
uses that guarded operation for approved unapplied meaning at actual completion.
Neither is a shell subcommand. See [the memory contract](skills/forge-shared/references/memory.md).

Give the agent the `forge` path when a request creates or validates managed
Forge state. Skill invocation happens in agent chat. The executable does not
select phases.

## LLM paste prompt

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

## Build from source

Contributors with this package checkout:

```bash
bun install --frozen-lockfile
bun run build:cli
./dist/forge setup --pack . --repo /path/to/project
```

Document templates are compiled into the binary. Skills stay on GitHub or in
`--pack`. Do not copy skills next to the binary.
