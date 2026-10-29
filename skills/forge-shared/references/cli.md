# Executable mechanics

The executable `forge` CLI is a thin local helper. It creates and validates
managed documents, initializes loop records, protects decision operations, checks
or applies prepared memory changes, queries the local knowledge corpus, and runs
candidate identity checks. It also serves a selected artifact directory on localhost.
It does not parse a semantic “forge spec” request,
select a phase or persona, approve meaning, judge a candidate, or advance delivery.

After a public install, the binary lives at `~/.local/bin/forge`. From a project
directory, install skills, then initialize a loop:

```bash
forge setup
forge init LOOP_ID --title TITLE
```

`--repo` defaults to `.`. `setup` copies skills into the project from GitHub, or
from `--pack` when you pass a local package directory. `init` creates loop
records and returns their absolute root. Do not run these from `~/.local/bin`;
that directory is not a pack root.

`--repo` identifies the target application repository/worktree. New loops default
to its gitignored `.forge/loops/<loop-id>/`; init adds the narrow ignore rule
when needed without untracking existing history. Installation location and shell
directory do not change that target. See configuration below for explicit storage.

Use `--loop <id|path>` on loop-aware operations. Relative document paths and
prepared memory inputs resolve inside that selected loop. Source/Git/canonical
paths remain in `--repo`; canonical manifest `change.path` and `from_path` always
refer to that target. Absolute prepared refs are allowed only in the target repo
or selected loop. An explicit loop path must be inside a known loop parent.
Never assume the artifact root is a source repository.

```bash
forge init task --repo /path/to/repo --title Task
forge docs create issue spec/issue.md --repo /path/to/repo --loop task --title Task
forge docs update spec/issue.md --repo /path/to/repo --loop task --set status=ready
forge docs validate --repo /path/to/repo --loop task
```

## Configuration and storage

One optional `forge.yml` at the application root supplies storage and active-engine
model defaults. The file, sections, mappings, roles, and individual model/effort
fields are optional. Empty mappings use defaults; invalid values fail clearly.
There is no shared-config inheritance or installation-pointer setting.

```yaml
storage:
  path: .forge
  loops:
    path: loops
engines:
  codex:
    models:
      main: {model: <host-native-id>, effort: high}
      worker: {effort: low}
      reviewer: {effort: medium}
      judge: {}
```

Model IDs and efforts here are illustrative; use values and combinations the
active host exposes. Each role uses separate optional `model` and `effort`
strings. Only the actual active engine's section applies. The
[native assignment procedure](runtime.md#model-selection) consumes defaults and
validates host capability; configuration does not launch agents or switch the
already-running main model.

`storage.path` defaults to `<target>/.forge`; a relative value resolves from the
application checkout. `storage.loops.path` defaults to `loops`; a relative value
resolves from `storage.path`, while an absolute value selects a loop parent
directly. Existing home-path expansion works for either path. For example,
`storage.path: /records/orchid` with `storage.loops.path: runs` selects
`/records/orchid/runs/<loop-id>/`. This base covers working loop records only.
Canonical Spec/KB files, identities, receipts, and the target mutation lock stay
with the application. Shared loop mutation uses the resolved loop parent's lock;
remote/distributed filesystem locking is not promised.

Legacy `loopsPath` remains a deprecated alias with target-relative, absolute, and
home-path semantics. With both spellings, identical normalized destinations are
accepted with a warning; conflicting destinations fail before mutation. Forge
does not rewrite configuration or move history.

Read-only inspection creates no directories:

```bash
forge config resolve --repo /path/to/app
forge config resolve --repo /path/to/app --engine codex --role reviewer
forge config resolve --repo /path/to/app --engine codex --role worker --effort high
```

The JSON reports `repo`, `storage_path`, `loops_path`, `known_loop_paths`, and
`warnings`. With `--engine`, it also reports `engine`, `role` (default `main`),
resolved `model`/`effort` when present, and `sources` for each field. Explicit
current user fields supplied with `--model` or `--effort` win independently;
otherwise role fields fall back to that engine's `main` fields, then discretion.
The output identifies each configured source or `user`/`discretion`.

Discovery checks the current configured/default parent, local `.forge/loops`, and
the former `~/.forge/repos/<repo-basename>-<realpath-hash>/loops` parent for this
target realpath. A unique existing loop resumes in place; duplicate codes require
an explicit qualified path and show the actual choices. Init refuses to shadow
existing historical codes. No discovery operation migrates, deletes, or merges
records. A moved/deleted checkout's old home key or a previous custom folder needs
an explicit known absolute `storage.loops.path` (or legacy `loopsPath`) to recover
it; Forge does not scan home or guess ownership from names. Retain that location
in handoffs. Use a separate shared parent per application.

Placement does not establish durability. Git does not persist ignored/external
records merely because the surrounding repository was pushed. Retain required
evidence in an authorized durable destination and prove restore before claiming
recovery. Automation-host integration and remote storage are deferred.

## Host setup

Default `--tools` is `agents` (Cursor, Codex, and Muse Code). Claude Code users must pass
`--tools claude`, or pipe the curl installer into `FORGE_TOOLS=claude sh` (the
assignment goes on the `sh`, not on the `curl`), and then read
`.claude/skills/forge/SKILL.md`. Pass `--tools cursor` or a comma-separated
list when a project uses more than one host. Unknown tools fail.

From the Forge package directory in a source checkout, inspect the live contract before using it:

```bash
bun run build:cli
./dist/forge --help
```

The checked-out contract is:

```text
forge setup [--repo REPO] [--tools LIST] [--pack PATH]
forge config resolve --repo REPO [--engine ENGINE] [--role main|worker|reviewer|judge] [--model MODEL] [--effort EFFORT]
forge init LOOP_ID --repo REPO --title TITLE
forge serve DIRECTORY [--port NUMBER] [--json]
forge docs create KIND PATH --repo REPO [--loop LOOP] --title TITLE [--code CODE] [--body-file FILE]
forge docs update PATH --repo REPO [--loop LOOP] [--body-file FILE] [--set KEY=JSON_OR_STRING]
forge docs validate [PATHS...] --repo REPO [--loop LOOP]
forge docs append PATH --repo REPO [--loop LOOP] --heading HEADING --body-file FILE
forge decision record [LOOP_DECISIONS_PATH] --repo REPO [--loop LOOP] --authorization-file FILE --body-file FILE [--title TITLE] [--supersedes Dn-or-existing-legacy-id]
forge candidate --repo REPO [--loop LOOP] [--path PATH ...] [--expect ID]
forge memory verify|apply MANIFEST --repo REPO [--loop LOOP]
forge kb ask QUERY --repo REPO [--scope SCOPE ...]
forge kb verify --repo REPO [--scope SCOPE ...]
forge kb history --repo REPO
forge kb add|update|remove MANIFEST --repo REPO [--loop LOOP]
```

## Artifact previews

`forge serve DIRECTORY` runs a foreground static server bound to `127.0.0.1`.
The directory is explicit and relative to the command's working directory; it
does not use `--repo` or need a Git checkout. The default port is `0`, selecting
an available port. An explicit occupied port fails instead of silently changing.
Read the printed URL; never guess the port. `--json` prints one readiness record
with `root`, `url`, `port`, and `pid` after the socket binds.

Serve the artifact directory containing `index.html` and its local assets. Nested
directories serve their own `index.html` and redirect to a trailing slash so
relative assets resolve. Files are read fresh on reload with caching disabled.
HTML, CSS, JavaScript, images, PDFs, Markdown and other ordinary files retain
their file MIME types; Markdown is served as a file, not converted to HTML.
Missing files or directories without an index return 404; there is no listing or
SPA fallback. Dotfiles and symlinks under the selected root are not served.

Keep the process in a host-owned terminal/session for as long as the preview is
needed. Ctrl+C or SIGTERM closes the server and releases the port. No daemon,
server registry, project command runner, transpilation, Vite installation, or
browser launch is involved. Use the project's existing dev/build pipeline when
an artifact needs framework imports or compilation, then serve its built output
or use that project's running preview. The browser's Reload action picks up file
edits; no live-reload script is injected into artifacts.

Readiness proves a bound local server. The host must open the returned URL and
inspect the actual asset/revision before claiming rendered proof. Keep local
preview lifetime separate from durable artifact paths and external publication.

## Document metadata and edits

The CLI assigns `id` (UUID), readable `code`, immutable `type`, `title`, `status`,
`createdAt`, and `updatedAt`. Codes contain letters/numbers separated by `-`, `_`,
or `.`. Creation/identity fields stay fixed; use `--set` for other metadata.
Spec/Issue scaffolds are drafts. Initialized indexes and logs are active containers;
neither state means that their contents are approved or their claims proved.

Required metadata uses top-level scalar values. CLI values use JSON-compatible
strings, lists, or objects in YAML frontmatter. This is a deliberately scoped reader,
not a general YAML implementation: unknown nested/block metadata is retained
verbatim during ordinary body edits, but is not interpreted as authority or schema.
`--body-file` accepts body-only Markdown; direct file tools may edit the ordinary
body while preserving its frontmatter. On creation, a missing top-level heading
is supplied from `--title`; an existing heading is retained and empty bodies are
rejected. Updates still require a descriptive heading. `docs validate --loop LOOP` with no
paths scans that loop's readable Markdown/frontmatter identity, uniqueness, and
links; no JSON loop/Issue registry is required. Pass paths to check specific
records. Canonical Spec/KB registry semantics remain separate. CLI identity fields
stay immutable, but structural scans cannot compare a raw ID/code edit against
historical registration or prove human approval.

Edit ordinary document bodies using normal file tools, then validate relevant
managed paths. A decision authorization file is JSON with `actor: "human"`, a
local transcript path or URL in `source`, an actual `quote`, bounded `scope`,
and an ISO `date`. The operation checks a local quote and embeds the context; it
does not authenticate the human. Generic document updates cannot create or
overwrite decision authority.

`forge decision record [LOOP_DECISIONS_PATH]` records the authorized decision in
the canonical decisions bundle, assigns the next readable `D1`, `D2`, or later
code, updates the numeric decisions index, and retains a memory receipt. When a
loop decisions path is supplied, it also records the canonical reference there.
The path may be omitted for standalone recording. `--supersedes` accepts a
canonical D-number or an existing legacy decision identity; supersession creates
a new record and preserves the prior one.

After human approval, specification and associated knowledge reconciliation is
prepared by a qualified specialist and checked for boundary fidelity. The natural
skill request `Forge spec apply <change>` then uses the existing executable
`forge memory verify MANIFEST --repo REPO` and `forge memory apply MANIFEST --repo
REPO` with `application: spec`. Natural-language `Forge spec merge` maps to the
same skill operation; there is no executable Spec apply or merge alias. Generic
memory and explicit delivery-history jobs omit that discriminator and remain
compatible. `forge kb ask`
queries the canonical local corpus and must return cited sources and explicit gaps.
Read [memory](memory.md) for the prepared-change contract and current exact syntax.

`forge kb history` is receipt-derived. It summarizes successful applied memory
operations from `.forge/memory/`; it does not treat a manual log, a failed
operation, or structural validation as shipped behavior or compliance proof.
Malformed or incomplete receipts are reported as issues. An integrated delivery
with no canonical document delta can be recorded explicitly through `forge memory
verify` and `forge memory apply` with an empty `changes` list plus human
authorization and nonempty source, evidence, and acceptance references. KB write
verbs reject empty changes. This receipt does not imply deployment or publication.

Canonical `docs/specs` and `docs/knowledge` are protected from generic document
writes. Prepare drafts under a loop or another ordinary path, pin proposed hashes
and independently retained authority inputs, then use memory verify/apply after approval.
Its document-only receipt does not establish implementation, Review, Verify,
or Ship.

Candidate identity excludes `.forge` loop mechanics by default, avoiding
self-invalidating verdict writes. It includes tracked, untracked, deleted, mode,
and symlink state for selected paths. Include changed accepted Spec/decision paths
explicitly with repeated `--path`, or separately pin their exact accepted
revision in the packet.

Candidate relative `--path` values remain target-repository paths even with
`--loop`; an external artifact selection uses an absolute path inside the selected
loop. This prevents external storage from redirecting code candidate identity.

Treat `--help` from the checked-out version as authoritative. Do not invent a
command or substitute shell writes for a protected operation. CLI success
establishes only the mechanical claim named by that operation.
