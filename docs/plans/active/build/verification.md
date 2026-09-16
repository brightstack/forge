# Forge v1 Verification Plan

Verification uses one combined Review per Build Loop candidate or exact
integrated Full SDLC Wave. Final Verify is conditional. This Forge v1 Build
earned one because its two Waves and file mechanics created cumulative proof that
only the complete candidate could satisfy. Verification does not Review each
Issue, assignment, plan, or file independently.

## Wave Review

The Reviewer is independent of every Builder and integration author for that
candidate. Review reads the accepted Spec, decisions, relevant Issue, repository
instructions, exact diff, affected callers, and current test evidence.

Check six required lenses in one coherent report:

1. Correctness - reachable defects, unsafe state changes, broken callers, and
   evidence that does not prove the claimed path.
2. Authority Compliance - trace relevant human decisions forward through Spec,
   active Design, active Technical Design, Plan and Issues, implementation, and
   proof; trace every downstream obligation back to accepted authority.
3. Repository fit - applicable rules, adopted conventions, dependencies, and
   path boundaries are followed.
4. Simplicity - no unnecessary service, abstraction, duplicated state, provider
   adapter, ceremony, or speculative recovery machinery.
5. Craft - the candidate is coherent, maintainable, complete, and professionally
   finished inside accepted Builder latitude.
6. Evidence - direct checks cover the accepted actor, behavior, candidate, and
   environment without stale or contradictory claims.

When a candidate contains UI components or materially changes UI, the same
Reviewer also applies a professional taste lens. Judge observable hierarchy,
composition, typography, spacing, states, interaction coherence, and finish
against accepted visual authority and repository taste. Personal preference and
new visual requirements do not become findings.

An unsupported material contract is `AUTHORITY_GAP` for Product, Design, or
Architecture. The Reviewer does not turn it into an implementation blocker.

Activate Security only for a concrete trust-boundary trigger. Activate visual
matching only for accepted visual authority and a representative rendered
surface.

A P0 or P1 finding must cite:

- the accepted or repository authority;
- a reachable trigger and causal path;
- direct evidence or the narrow decisive check;
- material impact; and
- the smallest in-contract correction.

Omit nits, preferences, hypothetical scale concerns, and equally valid tactics.
Resume the original Builder with every admitted finding in one feedback batch.
The Builder can return at most three continued delivery candidates. Every
continuation must preserve the complete original outcome. Targeted closure uses
the same Reviewer, checks stable findings, outcome preservation, and the changed
blast radius, and reruns only invalidated checks.

- Continuation 1 handles all concrete, local, material findings together.
- Continuation 2 requires an open original finding or local correction regression and a
  different supported hypothesis.
- Continuation 3 requires a narrower, better-understood, demonstrably converging
  correction.
- Stop for two similar failed fixes, growing blast radius or findings, an
  equal-or-higher regression, authority or architecture change, contradictory
  evidence, or failed continuation 3. P2 findings and nits never continue the loop.

### Wave 1 gate

- Package name and all durable vocabulary use Forge.
- The package is agent-invoked and native-first; CLI is fallback and mechanics.
- Lifecycle, roles, Plan levels, Issue states, Wave protocol, clarification, Auto,
  and shipping authority agree across direct artifacts.
- Manager instructions exclude specialist writing, source, integration, Review,
  and QA.
- Router, references, templates, roles, and semantic evals are concise,
  progressively loaded, and free of invented obligations.
- Scoped links and forbidden-term checks pass.

### Wave 2 gate

- The CLI surface matches the accepted command contract.
- File mutation is path-safe, atomic where required, and factual.
- Dependency readiness detects missing IDs and cycles without choosing Waves.
- Fallback agent lifecycle is provider-neutral and does not persist pointer input.
- Deterministic tests pass and do not assert prompt wording.
- The complete Forge package still passes the Wave 1 contract.

## Conditional Final Verify

Activate a fresh QA owner only when meaningful cumulative or high risk, a
distinct environment, or final-only proof remains after Review. A Build Loop
Reviewer may exercise the accepted journey when that is the remaining proof and
no distinct boundary exists. Full SDLC normally earns one complete-candidate
Final Verify after all Waves.

For this two-Wave Forge candidate, one fresh QA owner checks:

1. Run the complete deterministic test command recorded by the CLI Builder.
2. Exercise initialization, concurrent append, legal and illegal Issue movement,
   dependency-ready output, loop validation, and generic agent start, status,
   wait, and stop on temporary fixtures.
3. Inspect the resulting run tree and confirm candidate identities and Issue
   state agree with direct records.
4. Run applicable semantic eval fixtures for requirement laundering, Review
   authority, Manager role collapse, invented cases, Auto authority, wrong
   evidence, per-Issue Review leakage, and speculative guarantees.
5. Confirm the exact candidate contains no uncommitted or unreported source.

Final Verify returns PASS only when required evidence is current and coherent.
A source failure returns the affected Wave to its original Builder as a delivery
continuation. An authority failure returns to Plan. An environment-only failure
records the limitation and reruns only the affected proof when the environment is
available.

## Ship evidence

Record the exact candidate, commands and results, Review reports, Final Verify
report or justified skip, known limitations, and working-tree status. Do not
create a PR, merge, deploy, publish, or claim production completion.
