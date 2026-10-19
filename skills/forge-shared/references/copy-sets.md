# Copying Spec or Review

Preserve the relative layout `skills/<folder>/` beside `agents/<role>/`. Copy
ordinary files and package-level `OKF.md` beside `skills/` and `agents/`; no dependency manifest, selective installer, or unrelated phase
is required. Full setup installs the complete pack.

## Spec only

Copy `skills/forge-spec/` and `skills/forge-shared/`, then these professional
folders: `product-manager`, `designer`, `architect`, `engineer`, `researcher`, and
`reviewer`. Copy the `explorer` and `worker` helpers only when delegating those
jobs. Each folder retains `instructions.md`. Spec's boundary rubric and return
alias are in its own folder; it does not invoke integrated implementation Review.

Read `skills/forge-spec/SKILL.md` as the direct entrypoint. This copy set does not
include a native slash-command registration: use the host installation recipe
when literal `/forge:spec` is required. A copied folder alone proves neither host
recognition nor behavioral success. Direct Spec stops at its proposal/check.

## Review only

Copy `skills/forge-review/`, `skills/forge-shared/`, and
`skills/forge-code-review/`. Copy professional folders `reviewer` and `designer`, plus the `judge` helper. Read `skills/forge-review/SKILL.md` as the
direct entrypoint. Its rubrics and selected Code Review leaf are included; Build,
Spec, Verify, and Ship phase folders are unnecessary. A repository-selected
replacement may have its own explicitly declared support.

Review receives accepted authority and the exact candidate from its caller; it
does not run Spec, repair the candidate, or initiate Verify. Unsupported host
registration or missing tools remain visible gaps. Apply the target repository's
harness through [target-harness.md](target-harness.md) and the shared return checks.
The receiving Reviewer/Judges read the actual selected leaf and applicable target
rule/reference paths; copying the bundle alone is not evidence they did so.

## Optional memory mechanics

Shared canonical-memory guidance documents approved Spec apply and KB operations.
Direct Spec and Review do not run them. If explicitly invoking those mechanics,
use an installed Forge executable and its package-level `OKF.md` compatibility
reference; retain protected canonical-write and exact approval checks. The copy
sets above need no CLI to inspect plain artifacts and return a bounded result.
