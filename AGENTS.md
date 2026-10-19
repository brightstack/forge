# Forge

Forge is an agent-invoked delivery skill with professional instructions,
human-readable templates, deterministic local mechanics, and behavioral evals.
Its CLI also serves a selected artifact directory through a foreground localhost
preview. Browser interaction and screenshots remain host capabilities.
It is not an application server, semantic command router, workflow daemon, or
agent-process launcher.

## Development and runtime

When developing or running Forge inside a host repository, that repository's
applicable `AGENTS.md` hierarchy and linked standards govern implementation. They
are not runtime dependencies of the portable skill.

Enter runtime behavior through [skills/forge/SKILL.md](skills/forge/SKILL.md) and
load only the relevant phase references, professional instructions, and templates.

Forge Review is the ordinary integrated review route. It selects applicable
dimensions from the [judge selection and rubrics](skills/forge-review/references/judges.md).
Use [workflow staffing](skills/forge-shared/references/workflows.md#concrete-staffing)
to assign Reviewer and required Judges, and preserve their reports. The sibling
[forge-code-review](skills/forge-code-review/SKILL.md) skill is the portable
standalone leaf for an explicitly requested code-only review; it ends at its own
read-only Code Review verdict and never starts Forge Review or Verify.

## Runtime contract

Full delivery follows `Spec -> [Build <-> Review] -> Simplify -> Verify -> Ship`.
Spec owns intake. Plan remains a job, with brief Engineer notes for Quick work and
an available direct skill. Build owns implementation, integration, internal review,
independent Review, and correction. After that loop passes, a separate Engineer
owns Simplify before QA; changes receive affected proof and independent delta
Review bound to the resulting complete candidate, while no-op retains prior
Review. The Verify skill owns actual outcome proof. Each phase can be
invoked directly and stop. Direct Build/Review stops before Simplify unless also
authorized. Explore, Review, Explain, Finish, Spec apply, the
legacy natural wording Spec merge, and KB maintenance are direct operations
without implied full-delivery status.

Start with [Launch](skills/forge-shared/references/workflows.md): Workflow is Project,
Issue, Bug, or Work; Depth is Quick or Full; Control is Guided or explicitly Auto.
Guided waits before dispatch, then at new Spec/consequential Plan gates. Auto
exercises its grant without inventing approval or overriding protected-Spec rules.
An Issue's complexity governs depth. A clear current request can supply ready
intent; PM fills missing product intent only. Bounded guidance-only changes
default to Quick, and material simplification triggers a depth/staffing reassessment.
Plan remains a job and can be brief notes. All behavioral Spec changes preserve
explicit Given/When/Then scenarios.

One accountable Engineer integrates software work. A separate clean-context
Reviewer in the same host owns the read-only verdict over the integrated
candidate. QA owns distinct Verify evidence; instruction-only work with no
separate outcome to exercise reuses Review and deterministic checks by reference.
Use professional instructions and the concrete workflow assignments; do not
require provider/model diversity, unused specialists, or one gate per Worker.

## Boundaries

- Current human instruction and recorded decisions own intent.
- Standing Spec plus approved delta owns durable behavior.
- Repository harness and accepted design/technical decisions govern execution.
- Findings, code, tests, logs, prototypes, and knowledge evidence cannot create
  requirements.
- Direct Explore, Spec, Plan, Review, Simplify, Verify, Explain, Finish, Spec apply/merge, and KB work stop at
  the requested boundary.
- Importing a ticket or producing a mock does not authorize Build.
- Review PASS and local checks do not establish Verify.
- UI acceptance uses actual browser interaction and accepted visual comparison.
- Synthetic users stay within accepted scope and do not simulate research authority.
- Spec records approved meaning without routine canonical writes. Explicit Spec
  apply owns one proportional adversarial read plus existing guarded memory
  mechanics; routine Finish invokes that operation once at actual work completion.
- Ship executes only authorized publication and concise complete-candidate closure.

Fix aligned P0 and pragmatic P1 findings through coherent whole-outcome repair.
P2 does not extend the loop. Apply the shared three-cycle/three-substantive-repair
rethink trigger across Review and Verify, then stop automatic repair if the same
failure recurs after independent challenge.

## Ownership

- `skills/forge/SKILL.md`: public routing and lifecycle composition.
- `skills/forge-{spec,plan,build,review,simplify,verify,ship}/`: owning phase skills,
  references, and deliberate templates.
- `skills/forge-code-review/SKILL.md`: standalone Code Review leaf and portable
  direct-review boundary.
- `skills/forge-review/references/judges.md`: applicable judge dimensions, selection,
  replacement, disable, waiver, and report integration guidance.
- `skills/forge-shared/`: focused `authority.md`, `pragmatism.md`, `severity.md`,
  `repair.md`, and `target-harness.md` contracts, plus returns, workflows, runtime,
  records, and memory support; it is not a discoverable skill or one combined
  standards manual. Target harness routing supplies actual applicable app standards
  and check paths to every assigned agent.
- Phase-owned `assets/` plus `skills/forge-shared/assets/`: managed-document
  templates with stable CLI keys.
- `skills/forge-spec/references/design-studies.md` and
  `skills/forge-spec/assets/design-study.html`:
  codebase-grounded single-page studies; HTML is an ordinary linked visual asset,
  with revision and authority in the existing visual record.
- `agents/`: professional perspectives and temporary helper instructions.
- `src/` and compiled `dist/forge`: strict TypeScript/Bun mechanics with embedded templates.
- `src/serve.ts`: read-only artifact serving through the embedded Bun runtime.
- `commands/claude/forge/`: native `/forge:<phase>` adapters to owning skills.
- `tests/`: deterministic behavior; no prompt-sentence assertions.
- `evals/`: semantic routing, authority, judgment, and lifecycle behavior.

The CLI may initialize records; create, update, append, and validate documents;
record canonical D-number decisions from disclosed local authorization context;
calculate candidate identity; apply approved prepared Spec changes; verify/apply
generic memory changes; query,
validate, update, and read receipt-derived history for the canonical KB. It never
launches agents or chooses phases, personas, findings, remedies, or verdicts.

New loops default to `~/.forge/repos/<repository-key>/loops/<loop>/`; root
`forge.yml` can set `loopsPath` to another parent. `--repo` identifies the target
repository and `--loop` selects its records. Existing `.forge/loops/` history
stays in place. Loop identities and loop-local codes come from readable Markdown
frontmatter scans under the mutation lock, without a JSON Issue registry.

Preserve Forge `id`, `code`, and record-kind fields through CLI updates. The loop
scan does not detect a raw identity edit against original registration. Canonical
Spec/KB identities retain their separate `.forge/identities.json` safeguards;
report them separately from an OKF concept's path ID and open `type`.
Generic document writes cannot modify protected decisions or
canonical `docs/specs` and `docs/knowledge`. That guard binds the CLI rather
than the filesystem: an agent with write access can edit a decision record
directly, and `docs validate` checks structure, identity, and links rather than
authenticity, so it will not report the edit. Git history is the authority
record for what a human actually approved. `kb ask` does report canonical
knowledge whose working-copy bytes diverge from their last receipt. Candidate
checks exclude loop mechanics by default and include selected source and
accepted authority paths. Semantic reconciliation belongs to an accountable
specialist and independent review; mechanical success proves structure and
stale-base safety only.

## Verification

From the Forge package directory (Bun, Git, and POSIX tools required):

```bash
bun run check
bun run build:cli
FORGE_TEST_BINARY="$PWD/dist/forge" bun test ./tests
git diff --check
```

Instruction behavior needs behavioral evaluation. Deterministic tests cover only
mechanics, metadata, templates, path safety, and candidate facts. The behavioral
suite under `evals/` is not published with this package, so a public clone can
run the mechanics but not the evidence for instruction quality.
