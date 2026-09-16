---
title: Forge standalone dependency audit
createdAt: 2026-09-10
updatedAt: 2026-09-10
status: reviewed
---

# Standalone dependency audit

Forge's executable, source, templates, personas, and deterministic tests do not
import code or packages from elsewhere in the monorepo. The remaining
outside-folder references support development of Forge inside this monorepo.

## Dependency boundary

| Surface | Requirements |
| --- | --- |
| Compiled CLI | Embedded Bun runtime (including localhost artifact serving), Commander, the `yaml` 2.9.0 parser, and templates; POSIX file locking through Bun FFI; Git for candidate snapshots |
| Source/build/check | Package-local `package.json`, `bun.lock`, `tsconfig.json`, Bun, Commander, `yaml` 2.9.0, TypeScript, and Bun types |
| Deterministic tests | Bun, Git, Python 3 for fixture setup, and POSIX file-system facilities including `mkfifo` |
| Behavioral evals | Package-local fixtures, Python standard library, Git for staging, Bun for the JavaScript sample projects, and an agent host with the capabilities selected for the trial |
| Agent workflow | `skills/forge/` and `skills/forge-code-review/` together with sibling `agents/`, package-local `OKF.md`, the target repository's applicable harness, and accepted intent |

No external service, database, workspace dependency, API key, OpenSpec installation,
OKF service, provider adapter, or agent-process launcher is needed for the local
mechanics. OKF frontmatter parsing is local and uses the bundled `yaml` dependency.
Native subagents and browser tools are capabilities supplied by the hosting coding
agent when selected.

## Stack independence

The active skills, phase references, personas, and templates impose no target
application-framework or service requirement. Forge reads the target repository's
harness, manifests, and existing code for its package manager, language, frameworks,
architecture, tests, and deployment rules, and passes the relevant rules to helpers.
Forge's own Bun implementation and its JavaScript eval fixtures do not prescribe a
target stack, provider, or model family.

The bundled package contains both the composable lifecycle skill and the
standalone `forge-code-review` leaf. The lifecycle skill owns Forge Review and
integrates applicable judge reports. The leaf runs only when explicitly selected
for a code-only review and returns its own Code Review verdict without invoking
the lifecycle, Acceptance, or repair.

The leaf's isolated dependency boundary is `skills/forge-code-review/` plus
`agents/reviewer/` and the target repository's applicable harness. It does not
require the lifecycle skill, its phase references, or `OKF.md`. Full Forge
delivery still ships both skill directories, the sibling agent catalog, and the
package-local `OKF.md` together.

Canonical paths (`.forge/`, `docs/specs/`, and `docs/knowledge/`) belong to the Forge
record contract. Configurable locations remain deferred beyond RC1.

## Native OKF boundary

`docs/knowledge/` is a native OKF v0.2 bundle rooted at that directory. The
consumer accepts non-reserved Markdown concepts with only a non-empty `type`,
unknown fields and types, optional metadata, arbitrary nesting, and unresolved
links. It reports malformed envelopes and optional family, staleness, and link
conditions as structural or health output. The [compatibility note](OKF.md) pins
the upstream specification and lists the exact producer and consumer limits.

Forge's producer is the prepared memory writer. Human authorization, exact UTF-8
bytes, and SHA-256 stale-base checks protect writes; unknown bytes are preserved.
There is no generic OKF import/export, corpus bootstrap, resource execution, or
attestation runner. Existing registered knowledge remains readable and
identity-protected, and migration requires an explicit non-destructive prepared
change. `.forge/` records and `docs/specs/` remain Forge-managed documents with
their existing identity and authority rules.

## Remaining monorepo development references

- `AGENTS.md` has four links to the RC1 development plan in
  `../../docs/plans/active/forge-rc1/`. Keep the plan in the repository's root harness.
  Remove that monorepo-only section when extracting Forge; it is not part of the
  skill's target-repository instructions.
- The repository's `docs/scripts/check-links.py` is an additional documentation check from
  the monorepo root. It is not required by package install, build, check, or tests.
- The existing `docs/` and `examples/` trees retain prototype plans, research, and
  historical examples. They are not current runtime authority. Select what belongs
  in the future public repository instead of copying historical records wholesale.

Commands in the active CLI and RC1 eval guides now run from the Forge package
directory. No `apps/forge` prefix is required by those operations.

## Extraction proof

On 2026-09-10, copied the package's tracked files and current additions into a
fresh temporary directory outside the monorepo, without `node_modules`, `dist`,
root harness files, or Git metadata. Installed from its own frozen lockfile and ran:

```bash
bun install --frozen-lockfile
bun run check
bun run build:cli
FORGE_TEST_BINARY="$PWD/dist/forge" bun test ./tests
```

Frozen install, strict checking, and compilation passed; all 58 tests passed with
489 assertions. Full evidence is recorded in the RC1 OKF implementation note. This proves local package
independence on macOS; it does not establish Linux, Windows, every agent host,
or behavioral acceptance across arbitrary technology stacks.

## Release boundary

MIT is selected in `LICENSE` and package metadata. Commander's and `yaml`'s
notices are retained in `THIRD_PARTY_NOTICES.md`; binary publication must also
retain notices for the exact embedded Bun runtime and its libraries. Dependency
notices remain with any development packages that are distributed.

Copy source, package files, both skills, sibling `agents/`, package-local `OKF.md`,
tests/evals, README, and
license/notice files for extraction. Rebuild `dist/`; do not copy `node_modules`,
`*.bun-build`, Python caches, or private local run artifacts. The package remains
private and no registry publication, external repository creation, or binary
release is implied.
