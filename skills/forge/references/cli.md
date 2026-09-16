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
records. Do not run these from `~/.local/bin`; that directory is not a pack root.

Default `--tools` is `agents` (Cursor and Codex). Claude Code users must pass
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
forge init LOOP_ID --repo REPO --title TITLE
forge serve DIRECTORY [--port NUMBER] [--json]
forge docs create KIND PATH --repo REPO --title TITLE [--code CODE] [--body-file FILE]
forge docs update PATH --repo REPO [--body-file FILE] [--set KEY=JSON_OR_STRING]
forge docs validate [PATHS...] --repo REPO
forge docs append PATH --repo REPO --heading HEADING --body-file FILE
forge decision record [LOOP_DECISIONS_PATH] --repo REPO --authorization-file FILE --body-file FILE [--title TITLE] [--supersedes Dn-or-existing-legacy-id]
forge candidate --repo REPO [--path PATH ...] [--expect ID]
forge memory verify|apply MANIFEST --repo REPO
forge kb ask QUERY --repo REPO [--scope SCOPE ...]
forge kb verify --repo REPO [--scope SCOPE ...]
forge kb history --repo REPO
forge kb add|update|remove MANIFEST --repo REPO
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
rejected. Updates still require a descriptive heading. `docs validate` with no paths checks the
explicit `.forge/identities.json` corpus; pass paths to check a specific draft.

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
Its document-only receipt does not establish implementation, Review, Acceptance,
or Ship.

Candidate identity excludes `.forge` loop mechanics by default, avoiding
self-invalidating verdict writes. It includes tracked, untracked, deleted, mode,
and symlink state for selected paths. Include changed accepted Spec/decision paths
explicitly with repeated `--path`, or separately pin their exact accepted
revision in the packet.

Treat `--help` from the checked-out version as authoritative. Do not invent a
command or substitute shell writes for a protected operation. CLI success
establishes only the mechanical claim named by that operation.
