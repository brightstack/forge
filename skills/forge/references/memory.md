# Canonical specification and knowledge memory

Forge stores accepted behavior once at `docs/specs/<capability>/SPEC.md`. Supporting
knowledge is a native OKF v0.2 bundle rooted at `docs/knowledge/`. Every
non-reserved `.md` file is a concept with a non-empty `type`; concept types and
directory hierarchy are open. `index.md` and `log.md` are reserved at every
level, and the bundle-root index may declare only `okf_version` frontmatter.

This is distinct from the strict Forge record corpus: `.forge/` workflow files
and `docs/specs/` standing specifications keep their own identities, authority,
and metadata schemas. Knowledge paths remain protected from generic `forge docs`
writes. See the [OKF compatibility boundary](../../../OKF.md) for the supported
consumer and producer claims.

Use [knowledge and proportional preservation](knowledge.md) for the optional
six-topic reading map and the signals -> affected obligations -> selected checks
-> gaps handoff. OKF types stay open and no topic or corpus is mandatory.

## Meaning is prepared before mechanics

The responsible Spec or knowledge specialist reads the base, current canonical
file, source intent, relevant decisions, and every affected requirement and
Given/When/Then scenario. They prepare complete proposed files, identify preserved
meaning, and return conflicts to the human. A heading match or successful CLI
check cannot decide semantic preservation, approval, or implementation truth.

After the responsible human approves changed meaning, the Spec owner may install
the exact prepared standing-Spec and related knowledge bytes through the natural
`Forge spec apply <change>` skill operation. A fast Worker can prepare bounded
whole files; a separate fast checker
performs the existing Spec boundary fidelity check against the retained accepted
baseline, approved change, scenarios, decisions, and source. Use the models and
capabilities the current host exposes, honoring user preferences. Missing
independent checking stays a gap; it does not require a provider default or a
second full Review team.

Early application is a document-only result. Plan and Build still follow. Before
independent Build Review, assemble the complete candidate diff containing actual
code, tests, canonical Spec, and earned factual knowledge edits. Review receives
the retained accepted baseline and approved change separately from the working
files. Acceptance exercises that exact Review-passed candidate. A standalone
authorized document change can stop after Spec apply; it does not imply Build,
runtime acceptance, Ship, or publication.

Human decisions use the guarded command
`forge decision record [LOOP_DECISIONS_PATH] --repo REPO --authorization-file FILE
--body-file FILE [--title TITLE] [--supersedes Dn-or-existing-legacy-id]`. It
assigns the next canonical `D1`, `D2`, or later code, updates the numeric
decisions index, retains a receipt, and optionally links the canonical decision
from the loop record. Omit the loop path for a standalone decision. It never
silently rewrites a prior decision.

## Prepared manifest

`Forge spec apply <change>` is a natural skill operation, not an executable
subcommand. The Spec owner prepares the version 1 manifest and uses `forge memory
verify MANIFEST --repo REPO`, then `forge memory apply MANIFEST --repo REPO` only
after the full input and independent fidelity check pass. Existing generic memory
and KB jobs remain compatible. Natural-language `Forge spec merge` means this same
skill operation; there is no executable Spec apply or merge command.

```json
{
  "version": 1,
  "application": "spec",
  "operation_id": "SPEC-ACCESS-02",
  "authorization_file": ".forge/prepared/access-authority.json",
  "proof": {
    "status": "document-only",
    "source": [".forge/loops/access/spec/change.md"],
    "evidence": [],
    "acceptance": []
  },
  "retained_inputs": [
    {
      "role": "accepted-baseline",
      "source": ".forge/prepared/access-baseline.md",
      "sha256": "<64 lowercase hex characters>"
    },
    {
      "role": "approved-change",
      "source": ".forge/loops/access/spec/change.md",
      "sha256": "<64 lowercase hex characters>"
    }
  ],
  "changes": [
    {
      "path": "docs/specs/access/SPEC.md",
      "kind": "standing-spec",
      "action": "update",
      "base_sha256": "<64 lowercase hex characters>",
      "proposed_file": ".forge/prepared/access-SPEC.md",
      "proposed_sha256": "<64 lowercase hex characters>",
      "metadata_changes": ["updatedAt", "status"]
    }
  ]
}
```

Every proof field is a list of existing repository files or HTTP(S) references.
`source` is always required. `integrated` also requires evidence and acceptance;
`document-only` may leave those lists empty and never claims implemented behavior.
Reference existence is checked, not authenticity or evidentiary sufficiency.

The authorization file is JSON with nonempty `actor`, `source`, `quote`, `scope`,
and ISO `date`. `actor` must be `human`. For a repository-local source, the exact
quote must occur in that file; an HTTP(S) source is retained without a network
authenticity claim.

An `application: spec` manifest requires at least one `accepted-baseline` and one
`approved-change` retained input. An optional `context` input can retain a named Issue, PRD, or
decision source. Local inputs use repository-relative paths and exact SHA-256;
the apply fails if any bytes changed. An HTTPS source uses `sha256: null`; its
address and evidentiary limit are retained, but Forge does not fetch or
authenticate it. Retain only the named authority inputs needed for recovery.

The accepted baseline, current write base, and approved change are distinct. Do
not reconstruct the accepted baseline from HEAD, the comparison base, or current
pre-apply bytes. A copied file or quote preserves evidence; it does not by itself
authenticate human approval.

Each change uses one of these exact Forge mutation kinds and canonical homes:

| Kind | Canonical path |
| --- | --- |
| [`standing-spec`](../assets/standing-spec.md) | `docs/specs/<capability>/SPEC.md` |
| [`concept`](../assets/concept.md) | Any non-reserved `docs/knowledge/**/*.md` |
| [`kb-index`](../assets/kb-index.md) | Any `docs/knowledge/**/index.md` |
| [`kb-log`](../assets/kb-log.md) | Any `docs/knowledge/**/log.md` |
| [`kb-decision`](../assets/kb-decision.md) | Legacy alias for `docs/knowledge/decisions/<name>.md` |
| [`process`](../assets/process.md) | Legacy alias for `docs/knowledge/processes/<name>.md` |
| [`interface`](../assets/interface.md) | Legacy alias for `docs/knowledge/interfaces/<name>.md` |

The generic `concept` mutation kind is independent of the document's open OKF
`type`. Legacy aliases preserve existing manifests without defining a type registry.

`add` uses a null base hash, a proposed file, and its exact proposed hash. `update`
uses the exact current SHA-256 plus a proposed file and proposed hash. `remove`
uses the exact current SHA-256 and null proposed file/hash. A Spec manifest requires
`proposed_sha256` for every installed file so a changed draft fails before any
write. Compatible generic memory manifests may omit it. Updates list every changed
frontmatter field in
`metadata_changes`. Standing-Spec identity and creation metadata remain immutable;
native OKF metadata can change under the same authorization and stale-base checks
while the separate Forge record identity remains stable. Forge writes
the proposed bytes without reserializing unknown YAML or Markdown, including
frontmatter fields it does not interpret.

An explicit identity-preserving rename is one `move` change with `path` naming
the new canonical path, `from_path` naming the old canonical path,
`base_sha256` and `proposed_sha256` both pinning the unchanged bytes,
`proposed_file: null`, and `metadata_changes: []`. The old and new path must have
the same kind, the target must be unused, and the registry identity moves with the
file. Only an `application: spec` manifest accepts moves. Never infer a rename
from headings or content, and do not encode it as a same-ID remove/add pair.

Validation rejects stale bases, repeated operation IDs, no-op updates, duplicate
targets or Forge identities, unsafe paths, and changes that break protected
standing-Spec links. An `application: spec` manifest additionally requires at
least one standing-Spec change and `proof.status: document-only`; it can never
claim integrated delivery. The complete set validates before mutation. Apply
stages files, transfers a registered prepared draft identity
to its canonical home, and records the manifest, human context, hashes, and
prior/removed bytes under `.forge/memory/<operation_id>.json`.

The immutable receipt records `application: spec`, the copied manifest and
manifest hash, authorization/source snapshots, retained input snapshots, and each
result's installed content/hash plus applicable previous or removed content. Its
status remains document-only after later work; Review and Acceptance create their
own candidate-bound evidence instead of rewriting historical provenance.

Participating local CLI mutations share one advisory lock through checks, writes,
and rollback. On failure, rollback undoes only completed writes whose installed
bytes and mode still match; it preserves intervening changes and reports an
incomplete rollback for reconciliation. Registry undo restores only owned entries.
Raw filesystem writers can bypass the advisory lock; this is not an atomic
transaction against external editors or recovery after process termination.

## Focused knowledge commands

`forge kb scaffold PATH --repo REPO --type TYPE --title TITLE --code CODE`
creates a Forge-identified OKF concept draft under `.forge/prepared/`. It cannot
write canonical memory. Applying the reviewed draft transfers its stable identity;
applying an external draft creates a sidecar identity without rewriting its bytes.
Reserved OKF files always keep identity in `.forge/identities.json` rather than
forbidden frontmatter. Forge reports the bundle-relative OKF concept ID separately
from this Forge UUID and readable code.

Identity transfer is limited to a registered `.forge/prepared/` source. Reusing
bytes from a standing Spec, canonical knowledge document, or other registered file
does not move that source's identity; the new record receives its own. Registered
legacy Forge indexes/logs remain inspectable as `forge-legacy` and nonconformant
until an explicit prepared update converts their bytes to native OKF while keeping
their sidecar identity.

`forge kb ask QUERY --repo REPO [--scope KIND ...]` returns lexical references
and explicit unmatched-term or unreadable-corpus gaps. Every retrieved file is a
`working-copy` observation with authority and implementation explicitly not
inferred. When a valid applicable receipt exists, the result includes its receipt,
operation ID, application, document-only proof status, recorded/current hashes,
and `matching` or `diverged` state. Malformed or diverged provenance is an explicit
gap. It does not synthesize a requirement or turn an old receipt into current
delivery truth. `forge kb verify --repo REPO [--scope KIND ...]` consumes the
native OKF bundle, checks required structure and Forge-owned identities, and
reports optional metadata-family, trust, staleness, and local-link conditions as
health output. Missing optional fields, unknown types or keys, and broken links
remain consumable; malformed required structure is reported as an issue.

When present, a bare `verified` mapping is normalized to one event before Forge
derives the advisory `unverified`, `machine-confirmed`, or `human-reviewed`
trust tier. These signals do not grant acceptance, authorization, or permission
to change the repository. Health output also does not establish semantic truth,
source authenticity, implementation compliance, or attestation.

Scopes are the Forge kind names in the table. With no scope, reading and
verification cover all supported canonical views and native knowledge documents.
Multiple scopes use a repeated `--scope` flag.

`forge kb history --repo REPO` reads successful memory receipts under
`.forge/memory/` and returns a concise changelog of applied Spec changes,
knowledge or decision maintenance, and evidenced system delivery. It does not
reconstruct failed operations or claim that a receipt proves semantic compliance.
Use the retained receipt and linked evidence for the exact operation and gaps.
Malformed, incomplete, and failed receipt-shaped files appear as history issues
instead of successful entries. This is structural validation of the retained
receipt envelope; Forge does not re-run its stale-base check against current files
or authenticate old sources while reading history.

A completed bug fix or refactor with no honest Spec or knowledge delta may still
use `forge memory verify` and `forge memory apply` with `changes: []` only when an
actual delivery-history record was requested. This narrow
delivery-only form requires `proof.status: integrated`, human authorization, and
nonempty source, evidence, and acceptance references. It records reviewed delivery
evidence; it does not imply deployment or publication and is not mandatory
paperwork for restorative work. KB add, update, and remove always require at least
one matching canonical knowledge change.

`forge kb add|update|remove MANIFEST --repo REPO` applies a manifest whose every
change matches that verb and targets only `docs/knowledge/`; it uses the same
human authorization and stale-base protections. Standing Spec changes use
`forge memory apply`. The KB operations can create or update prepared concept,
index, and log bytes, but do not import/export a corpus, bootstrap a repository,
or execute `resource`, `computation`, `executor`, or `attester` references.
