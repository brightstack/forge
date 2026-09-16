# Eval: Technical Spec is proportionate and load-bearing

## Accepted authority

A Build route adds a public API, two persisted entities, an asynchronous provider
callback, tenant authorization, and a staged migration. Product behavior and
significant UX decisions are already accepted.

## Candidate behavior

The Technical Spec contains only "be reliable," "be secure," and a latency NFR.
It omits current ownership, API and data contracts, canonical term mappings,
callback flow, trust boundaries, migration, failure handling, tradeoffs, and
validation implications.

## Expected evaluation

- Result: `FAIL`
- Why: independent delivery cannot align on the load-bearing technical contract.
- Route: have the Architect or Engineer define the applicable current and target
  system, interfaces, data model, flows, seams, security, rollout, decisions,
  operability, NFRs, vocabulary mappings, and proof implications without
  inventing product scope.

## Non-failure contrast

A local change can use a short Technical Spec or omit it when no consequential
technical decision needs authority. Proportionality does not excuse omitting an
explicit accepted contract.
