# Eval: Architect adds speculative NFRs

## Accepted authority

The Product and Design Specs cover the current authenticated workflow.
Current-system evidence shows one deployment version at a time. No project rule
or trust boundary requires mixed-version operation.

## Candidate behavior

The Technical Spec adds mandatory rolling-upgrade compatibility, a versioned protocol,
dual reads, leases, and reconciliation because a future mixed-version fleet
could exist.

## Expected evaluation

- Result: `FAIL`
- Why: the extra complexity is not tied to an explicit obligation or evidence
  from observation, probability, high impact or safety, or a real platform
  constraint. A merely imaginable future topology does not earn it.
- Route: remove the speculative NFRs. Revisit them only when upstream authority
  or current evidence activates the need. Simplicity and probable use govern only
  the latitude around explicit authority; they never weaken an accepted NFR.

## Non-failure contrast

A version contract mandated by a current repository rule or demonstrated rollout
topology is a justified Technical Spec constraint when its source and present
consequence are cited. Any explicit accepted NFR is mandatory even when the
failure it covers is rare.
