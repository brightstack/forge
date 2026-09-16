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
dimensions from the [judge selection and rubrics](skills/forge/references/judges.md).
Use [workflow staffing](skills/forge/references/workflows.md#concrete-staffing)
to assign Reviewer and required Judges, and preserve their reports. The sibling
[forge-code-review](skills/forge-code-review/SKILL.md) skill is the portable
standalone leaf for an explicitly requested code-only review; it ends at its own
read-only Code Review verdict and never starts Forge Review or Acceptance.

## Runtime contract

Full delivery accounts for `Spec → Plan → Build → Acceptance → Ship`. Spec owns
intake. Build owns implementation, integration, simplification, internal review,
independent Review, and correction. Acceptance owns actual candidate proof. Each
phase can be invoked directly and stop. Explore, Review, Simplify, Spec apply, the
legacy natural wording Spec merge, and KB maintenance are direct operations
without implied full-delivery status.

Start with [Launch](skills/forge/references/workflows.md): Workflow is Project,
Issue, Bug, or Work; Depth is Quick or Full; Control is Guided or explicitly Auto.
Guided waits before dispatch, then at new Spec/consequential Plan gates. Auto
exercises its grant without inventing approval or overriding protected-Spec rules.
An Issue's complexity governs depth; PM prepares a missing/unready Issue with
Engineer input. Plan remains a job and can be brief notes. All behavioral Spec
changes preserve explicit Given/When/Then scenarios.

One accountable Engineer integrates software work. A separate clean-context
Reviewer in the same host owns the read-only verdict over the integrated
candidate. A clean-context QA professional owns Acceptance. Use professional
instructions and the concrete workflow assignments; do not require provider/model
diversity, unused specialists, or one gate per Worker.

## Boundaries

- Current human instruction and recorded decisions own intent.
- Standing Spec plus approved delta owns durable behavior.
- Repository harness and accepted design/technical decisions govern execution.
- Findings, code, tests, logs, prototypes, and knowledge evidence cannot create
  requirements.
- Direct Explore, Spec, Plan, Review, Acceptance, Spec apply/merge, and KB work stop at
  the requested boundary.
- Importing a ticket or producing a mock does not authorize Build.
- Review PASS and local checks do not establish Acceptance.
- UI acceptance uses actual browser interaction and accepted visual comparison.
- Synthetic users stay within accepted scope and do not simulate research authority.
- Approved Spec apply installs target meaning during Spec with document-only
  provenance; Build Review and Acceptance prove the complete candidate.
- Ship executes only authorized publication and concise complete-candidate closure.

Fix aligned P0 and pragmatic P1 findings through coherent whole-outcome repair.
P2 does not extend the loop. Apply the shared three-cycle/three-substantive-repair
rethink trigger across Review and Acceptance, then stop automatic repair if the same
failure recurs after independent challenge.

## Ownership

- `skills/forge/SKILL.md`: public routing and lifecycle composition.
- `skills/forge-code-review/SKILL.md`: standalone Code Review leaf and portable
  direct-review boundary.
- `skills/forge/references/judges.md`: applicable judge dimensions, selection,
  replacement, disable, waiver, and report integration guidance.
- `skills/forge/references/`: phase, authority, runtime, host, and memory guidance.
- `skills/forge/assets/`: concise human-facing managed-document templates.
- `skills/forge/references/design-studies.md` and `assets/design-study.html`:
  codebase-grounded single-page studies; HTML is an ordinary linked visual asset,
  with revision and authority in the existing visual record.
- `agents/`: professional perspectives and temporary helper instructions.
- `src/` and compiled `dist/forge`: strict TypeScript/Bun mechanics with embedded templates.
- `src/serve.ts`: read-only artifact serving through the embedded Bun runtime.
- `tests/`: deterministic behavior; no prompt-sentence assertions.
- `evals/`: semantic routing, authority, judgment, and lifecycle behavior.

The CLI may initialize records; create, update, append, and validate documents;
record canonical D-number decisions from disclosed local authorization context;
calculate candidate identity; apply approved prepared Spec changes; verify/apply
generic memory changes; query,
validate, update, and read receipt-derived history for the canonical KB. It never
launches agents or chooses phases, personas, findings, remedies, or verdicts.

Preserve Forge `id`, `code`, and record-kind identities in
`.forge/identities.json`; report them separately from an OKF concept's path ID and
open `type`. Generic document writes cannot modify protected
decisions or canonical `docs/specs` and `docs/knowledge`. Candidate checks
exclude loop mechanics by default and include selected source and accepted
authority paths. Semantic reconciliation belongs to an accountable specialist and
independent review; mechanical success proves structure and stale-base safety only.

## Verification

From the Forge package directory (Bun, Git, Python 3, and POSIX tools required):

```bash
bun run check
bun run build:cli
FORGE_TEST_BINARY="$PWD/dist/forge" bun test ./tests
git diff --check
```

See [the extraction audit](STANDALONE.md) for the standalone package boundary.

Instruction behavior needs behavioral evaluation. Deterministic tests cover only
mechanics, metadata, templates, path safety, and candidate facts.
