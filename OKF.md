# Google OKF v0.2 compatibility

Forge treats `docs/knowledge/` as a native Open Knowledge Format (OKF) bundle.
The bundle root is that directory. This document records the supported format
boundary; Forge workflow records under `.forge/` and standing specifications
under `docs/specs/` keep their own strict identity, authority, and lifecycle
contracts.

## Pinned upstream

The reference is Google's primary [OKF `SPEC.md` at commit
`0b87c52c6ef999286c745e19998fdfcd03d5dbee`](https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/0b87c52c6ef999286c745e19998fdfcd03d5dbee/SPEC.md),
version 0.2, fetched 2026-09-10.
The pinned raw file is 37,748 bytes with SHA-256
`26aa5da029278939f914e578107242d9607d4f2dc5fe153272b82f9ed1030101`.

## Compatibility matrix

The rows below cover upstream requirements that affect a consumer or producer.
“Health” means an inspectable finding or gap; it does not make an otherwise
readable concept unusable.

| Upstream v0.2 requirement | Forge behavior | Result |
| --- | --- | --- |
| Every non-reserved `.md` file has parseable YAML frontmatter. | The native consumer reads Markdown frontmatter with the local YAML parser. Malformed frontmatter is reported as a structural document issue. | Implemented |
| Every non-reserved concept has a non-empty `type`. | `type` is the only required concept field. It must be a non-empty string. | Implemented |
| Concept types are open and unknown types must be tolerated. | No registry or allow-list is used; unknown types are consumed as generic concepts. | Implemented |
| The hierarchy is producer-defined; `index.md` and `log.md` are reserved at every level. | The reader walks nested concepts below `docs/knowledge/`. Reserved files are parsed as index or log records and are never treated as concepts. | Implemented |
| A bundle-root index may contain only `okf_version` frontmatter. Other indexes have no frontmatter. | `docs/knowledge/index.md` accepts an optional `okf_version`; nested indexes reject frontmatter. A version the reader does not recognize becomes a health finding and best-effort reading continues. | Implemented with health |
| An index is optional and a log, when present, uses dated groups. | Missing index/log files are reported as optional health gaps. Present reserved files are structurally checked, including ISO date groups for logs. | Implemented with health |
| Unknown frontmatter keys and missing optional families must not be rejected. | YAML values are retained, unknown keys/types are accepted, and absent `sources`, `generated`, `verified`, lifecycle, or computation metadata remains consumable. Defects or useful omissions may appear in health output. | Implemented with health |
| Consumers must treat a bare `verified` mapping as one verification event. | A mapping is normalized to a one-element event list before deriving the trust tier. | Implemented |
| Consumers may derive advisory trust tiers and staleness from the v0.2 fields. | Trust is reported as unverified, machine-confirmed, or human-reviewed from `verified`; `stale_after` is compared with the observation time and a passed value is reported. These signals never grant Forge approval. | Implemented with health |
| Markdown links may be relative or bundle-relative, and broken links must be tolerated. | Local links are inspected for health and link gaps are surfaced without making a readable bundle fail OKF conformance. Forge mutation safety may still reject a prepared change that would strand a protected canonical link. | Implemented with health |
| Attested Computation fields describe a computation, executor, and attester; OKF does not prescribe packaging or execute them. | Forge parses and preserves those fields but does not run `computation`, `executor`, or `attester` resources and does not issue attestation receipts or verdicts. | Read/preserve only |
| A concept ID is its bundle-relative path without `.md`. | Forge reports that path ID separately from its stable Forge record identity. | Implemented |

## Optional knowledge map

Forge offers six optional reading topics: Domain, Data, Runtime, Core processes,
Operations, and Shared foundations. Use the open OKF `type` field and the concise
[knowledge templates](skills/forge/references/knowledge.md); these labels are
retrieval guidance, not a type registry. Create only topics earned by the work.
An empty corpus, placeholder concept, or exhaustive source copy is unnecessary.

## Consumer boundary

`forge kb ask` searches the native bundle and returns lexical references plus
unmatched or unreadable gaps. `forge kb verify` checks the required envelope,
reserved files, identities owned by Forge, optional metadata families, trust and
staleness signals, and local links. It reports health separately from structural
issues. It does not establish semantic truth, source authenticity, human
acceptance, implementation compliance, or runtime attestation.

`forge kb history` is a read-only view derived from successful memory receipts.
It summarizes applied Spec changes, knowledge or decision maintenance, and
evidenced system delivery. It does not turn a receipt, a manual log, or a KB
query into compliance proof. Malformed, incomplete, and failed receipt-shaped
files are reported as issues rather than history entries. Reading history checks
the retained envelope; it does not revalidate stale bases against current files.

The reader accepts a concept with only `type`, preserves arbitrary frontmatter
fields, and does not require a Forge `id`, `code`, status, timestamp, or one of
Forge's semantic directories for OKF consumption. Registered legacy KB files
remain readable and identity-protected where Forge manages them.

Every result record exposes the OKF path ID and the authoritative Forge
sidecar identity separately. Unregistered external bundles remain consumable and
receive a `missing-forge-identity` health gap; reading never adopts or mutates
them. External `id` and `code` keys are preserved as extensions but do not become
authoritative merely because their names resemble Forge fields.

Registered pre-OKF Forge `index.md` and `log.md` records remain searchable and
identify themselves as `forge-legacy`. Verification reports that their reserved
frontmatter is not OKF-conformant. An authorized update can replace those exact
bytes with native reserved-file structure while preserving the sidecar identity;
Forge never rewrites them during reading.

## Producer and authority boundary

`forge kb scaffold` creates an open-type concept draft under `.forge/prepared/`
with stable `id` and readable `code` extensions. Forge produces or changes
canonical knowledge through a prepared manifest. After human approval, the
natural `Forge spec apply <change>` skill operation can install an associated
knowledge change with at least one standing Spec change by using the existing
memory verify/apply mechanics; KB operations and compatible generic memory operations retain their
existing uses. The human authorization record, independently retained baseline
and approved change, exact prepared UTF-8 bytes, and current/proposed SHA-256
hashes are checked before Spec apply writes anything. The apply path preserves
unknown YAML and Markdown bytes and records document-only provenance for recovery.
It is a controlled writer for the repository's canonical bundle, not an OKF
import/export implementation. Applying a new native
document transfers its registered draft identity or creates an authoritative
sidecar identity for an external draft. Reserved files keep identity only in the
sidecar because OKF forbids that frontmatter. Same-path updates preserve the
sidecar identity even when the open concept `type` changes.

Human decisions use the guarded decision operation. It assigns stable readable
`D1`, `D2`, and later codes, keeps descriptive filenames, updates the numeric
decisions index, records the human source and authorization, and retains a
receipt. Supersession creates a new decision and preserves the prior record. A
loop decisions record can link the canonical decision; standalone recording can
omit that path.

Only a registered source owned under `.forge/prepared/` is an identity-transfer
draft. A protected standing Spec, canonical knowledge file, or other registered
source may supply exact proposed bytes, but the new target receives a new identity
and the source registration remains intact. Native update manifests declare
semantic top-level YAML field changes; standing Specs retain their stricter raw
frontmatter and immutable-identity checks.

Adoption is explicit and non-destructive: existing registered documents are not
rewritten, moved, or retyped automatically. There is no bootstrap or `init`
operation for creating a KB corpus. Standing Specs and `.forge` workflow files
continue to use Forge's strict schemas and authority rules rather than becoming
OKF concepts by implication.

`forge kb ask` labels every retrieved file as a working-copy observation. Matching
or diverged Spec-apply provenance can aid recovery, but never establishes accepted
authority, implementation, Acceptance, or current delivery truth.

The producer does not fetch or export a corpus and never executes a referenced
resource, computation, executor, or attester. A prepared apply proves authorized
byte-level reconciliation and stale-base safety; it does not prove that the
knowledge is semantically correct or that an implementation satisfies it.

Forge uses `yaml` 2.9.0 because the compatibility boundary needs YAML 1.2 nested
values, duplicate-key diagnostics, and bounded alias expansion. Bun's convenience
YAML parser does not expose the document diagnostics and alias limit needed for
this untrusted bundle input.
