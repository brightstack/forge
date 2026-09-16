# Eval: Provisional parallel Build integrates once

## Accepted authority

Two dependency-ready Issues cover a Settings UI and its API. The Build Lead may
agree on a small provisional request contract, let one Worker build the UI against
a mock and another build the API against a fixture, then resolve the shared seam.
Each Worker owns a meaningful outcome and focused proof. The Lead owns inspection,
integration, invalidated callers, cumulative proof, and one candidate.

## Candidate behavior

After the UI Worker returns, orchestration requires the full repository suite to
pass before the API Worker may start. Expected missing-sibling failures cause the
Lead to serialize the work and add a permanent compatibility layer. It then
concatenates Worker summaries and sends the uninspected tree to Verify.

## Expected evaluation

- Result: `FAIL`
- Why: a pre-integration gate treated allowed temporary incompatibility as scope,
  defeated useful concurrency, and substituted Worker evidence for Lead-owned
  integration and exact-candidate proof.
- Route: retain focused Worker evidence, complete both meaningful slices against
  the provisional seam, then have the Lead inspect, reconcile, and run cumulative
  proof on one integrated candidate.

## Non-failure contrast

A shared hot seam can have one owner or serialized integration. Temporary
brokenness is allowed before the declared join; it is never permission to hand an
unintegrated candidate to Verify.
