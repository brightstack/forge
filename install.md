# Install Forge

The public install is one curl: a compiled CLI at `~/.local/bin/forge`, then
`forge setup` copies the matching skill pack from GitHub into this project.

macOS and Linux, on x64 and arm64.

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

Run `forge --version` to see the installed CLI's Forge package version. The
version is embedded from `package.json` when the executable is built. Setup
fetches the skills from the public repository's `v<version>` tag, so skills and
CLI come from the same release; a matching version number alone does not prove
that their files match a source checkout.

## Update

Install and update are the same command: run the installer again from the
project, with the same `FORGE_TOOLS` hosts you installed. It replaces the binary,
then setup replaces Forge's own skills and its shared `.forge/references/`,
`.forge/templates/`, and `.forge/agents/`. Other skills, custom agents, loop
records, memory receipts, and `forge.yml` stay. Restart the agent afterwards.

### Updating from older versions

- A 0.1.x CLI fetches skills from `main` and has no `forge context`, which every
  skill now runs first. The CLI is shared across projects but skills are not, so
  run the installer again in every project that has Forge. From 0.2.0 on, setup
  fetches the skills tagged with the CLI's own version. A 0.1.x `forge setup` now
  fails with `skill pack not found … expected skills/forge-shared/…`; that means
  the CLI is old, not that the repository is broken. Run the installer.
- `.forge/identities.json` is retired; Forge no longer reads or writes it. If it
  exists, make sure each listed canonical document's frontmatter carries that
  entry's `id` (and, for `docs/specs` Specs, its `type`), copying it in when
  missing or different. Keep an OKF concept's own `type`; reserved `index.md` and
  `log.md` files need nothing. Run `forge docs validate` and `forge kb verify`,
  then delete `.forge/identities.json`.
- Canonical decisions no longer get global `D1`, `D2` codes. Existing decisions
  keep their D-code text and filenames; new ones are identified by the UUID `id`
  in their frontmatter. Readable D-codes now exist only inside a loop's
  `decisions.md`.

An agent can do either from one line:

```text
Read https://forge.brightstack.ai/install.md and follow it.
```

That page is written for an agent to read and follow: it selects the hosts that
already have Forge, runs the installer, checks `forge --version` and
`forge context`, migrates a retired `.forge/identities.json`, and reports other
leftovers from older installs without deleting them. The site also serves a docs index at
https://forge.brightstack.ai/llms.txt.

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

Unknown tools fail. Setup installs Forge's shared material once per project:
`references/` (including `okf.md`), `templates/`, and the professional catalog
`agents/` go to the application root's `.forge/references/`, `.forge/templates/`,
and `.forge/agents/`, whatever `forge.yml` `storage.path` says (that setting only
places loop records). Only the Forge skill folders go into each host's `skills/`.
Setup rewrites the pack's relative links to match; a shared file that links into a
skill points at the first selected host. It replaces only those Forge-owned
folders and never touches `.forge/loops/`, `.forge/memory/`, `.forge/prepared/`,
`forge.yml`, or the host's own `agents/` folder. Earlier installs wrote the
catalog to `<host>/agents/` and `<host>/OKF.md` and the shared support to
`<host>/skills/forge-shared/`; setup removes the old `forge-shared` skill folder
and leaves the other two alone, so compare them with `.forge/agents/` and delete
them by hand once you have checked they are not yours.
Claude setup also registers the native phase commands below. Other skills stay. Internal `forge-eval` tooling is not
part of this runtime pack.

Default setup fetches the `v<version>` tag of https://github.com/brightstack/forge
(the version `forge --version` prints) into a temp directory, copies the pack, and
deletes the temp tree. Git is required for that fetch and for `forge candidate`.
If GitHub is unreachable or the tag does not exist, the command fails with an error
that names the tag and suggests `--pack`.

`--pack <dir>` skips the network and copies from a local package tree (this
checkout, or CI):

```bash
forge setup --pack /path/to/forge
```

`--pack` must point at the Forge package layout: the complete runtime skill set
under `skills/`, plus `references/`, `templates/`, `agents/`, and
`commands/claude/forge/` at that root. It is not the directory that holds the
`forge` binary. The skill folders are `forge`, `forge-spec`, `forge-plan`,
`forge-build`, `forge-review`, `forge-simplify`, `forge-verify`, `forge-ship`, and
`forge-code-review`. Shared contracts live in focused `authority.md`,
`pragmatism.md`, `severity.md`, `repair.md`, and `target-harness.md` references;
phase procedures load the relevant owner directly. Target harness routing carries
actual app rule/reference/check paths into professional and Judge assignments.

## Select an installation outside the application

The normal setup above colocates Forge's pack with the application. A complete
external pack can instead be selected through the application's harness or an
actual supported host registration. Keep three paths explicit: installation,
application checkout, and selected loop storage. Directory names and sibling
layout carry no meaning.

For example, a pack at `/opt/delivery/kiln` can serve an application at
`/work/products/orchid`. Put an explicit pointer in that application's `AGENTS.md`:

```markdown
For Forge work, read /opt/delivery/kiln/skills/forge/SKILL.md and its linked
resources. This application remains the target; follow this AGENTS.md and the
applicable nested instructions for implementation and checks. Pass
--repo /work/products/orchid to Forge mechanics.
```

Start the host in the application and have it read the actual linked entrypoint.
The complete pack's sibling `references/`, `templates/`, `agents/`, and skill
assets must remain readable by the owner and its native subagents. Use the host's real
registration if available; if it cannot discover external skills, the local
harness pointer is the thin entrypoint. Missing access is a capability gap.
Shell CLI availability does not establish skill discovery or colon invocation.

```bash
forge config resolve --repo /work/products/orchid
forge init sample --repo /work/products/orchid --title "Sample change"
forge docs validate --repo /work/products/orchid --loop sample
```

To follow a curated harness instead of the application's root maps, set
`harness.path` in the application's `forge.yml`:

```yaml
harness:
  path: docs/factory
```

Forge then starts at `docs/factory/AGENTS.md` (else `CLAUDE.md`) and reads the root maps or nested
instructions only where that harness routes to them. The skills run
`forge context` to get this; run it yourself to see what agents will follow:

```bash
forge context --repo /work/products/orchid
```

From inside the application, `forge context` without `--repo` finds the same
target, the way Git finds its repository.

With no application configuration, records still go to
`/work/products/orchid/.forge/loops/sample/`. Read `forge.yml` only from the
application root; it does not locate the installation. The external installation
or factory's implementation standards never replace the application's harness,
Specs, canonical knowledge, tests, or QA customizations. An alternative is the
existing `forge setup --repo /work/products/orchid --pack /opt/delivery/kiln`,
which copies the complete pack into application discovery directories.

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

Preserve the relative `skills/`, `references/`, `templates/`, and `agents/`
layout. Copy whole named folders, including their references and assets:

- Spec: `skills/forge-spec/`, `references/`, `templates/`, the
  `agents/{product-manager,designer,architect,engineer,researcher,reviewer}/`
  professional folders, and `agents/{explorer,worker}/` when delegated. Roles are loaded only
  when the work triggers them; no Build or Review phase is required.
- Review: `skills/forge-review/`, `references/`, `templates/`,
  `skills/forge-code-review/`, and `agents/{reviewer,designer,judge}/`.

`references/okf.md` covers shared knowledge/memory. Include the relevant native
command file when using Claude colon invocation. The target repository's harness
still owns implementation standards. A copy set's presence proves packaging;
exercise the requested operation before claiming behavioral acceptance.
The owning [copy-set guide](references/copy-sets.md) explains
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

`init` does not require Git. `candidate` does. New loop records default to the
application's gitignored `.forge/loops/LOOP/`. Init adds a narrow ignore rule
when needed without untracking existing files. To select another loop parent,
use the application's optional root `forge.yml` before initialization:

```yaml
storage:
  path: /records/orchid
  loops: {path: runs}
```

Here records go under `/records/orchid/runs/LOOP/`. `storage.path` defaults to
`.forge` and resolves from the application; `storage.loops.path` defaults to
`loops` and resolves from that base. Absolute loops paths override the base;
home paths work. `--repo` always identifies the target source/canonical repository.
`--loop LOOP` selects its record directory separately, and loop document paths
are relative to that directory. Canonical documents, receipts, and the target
lock stay in the application. The old `loopsPath` spelling remains a deprecated
alias; conflicting old/new destinations fail before mutation.

Unique existing loops at the current parent, local `.forge/loops`, or former
home parent for this checkout resume in place. Duplicate codes require an explicit
qualified path; initialization refuses to shadow historical codes. A previous
custom parent or an old home parent after moving a checkout needs its explicit
known path. Setup never migrates history. See the
[configuration contract](references/cli.md#configuration-and-storage)
for inspection, recovery, and optional per-engine model/effort defaults consumed
by [native dispatch](references/runtime.md#model-selection).

Ignored or external records need an authorized durable copy and demonstrated
restore before claiming recovery. A Git push alone does not retain them.
Automation-host integration and remote storage remain deferred.

Memory operations also accept `--loop`: manifests and prepared input references
resolve within that loop, while canonical target paths stay repository-relative.
Use `Forge spec apply <change>` after exact approval; its procedure prepares and
checks `forge memory verify` before `forge memory apply`. `Forge finish <loop>`
uses that guarded operation for approved unapplied meaning at actual completion.
Neither is a shell subcommand. See [the memory contract](references/memory.md).

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
