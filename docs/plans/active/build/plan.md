# Forge v1 Plan

Forge v1 ships in two implementation Waves. Wave 2 depends on Wave 1 because its
mechanics and tests require the accepted file and workflow contracts.

## Issues

| Issue | Outcome | Dependency | Current status projection |
| --- | --- | --- | --- |
| `FORGE-001` | Accepted contract, roles, router, workflow references, artifact templates, and semantic evals | None | Ship |
| `FORGE-002` | Working standard-library CLI, deterministic tests, and complete-candidate proof | FORGE-001 Wave Review PASS | Ship |

This is the complete dependency graph. Builders can parallelize disjoint work
inside each Wave. The Manager derives assignments from current ownership and
contention; those runtime choices do not become new Issue dependencies.
Resolve each stable ID under the [Issue board](issues/); the matching parent
directory is its status. The final column is a factual projection only; the
directory remains the sole status authority.

## Wave protocol

For each Wave:

1. Freeze the accepted Issue boundary and parallel Builder assignments.
2. Builders write direct plans and results in their owned paths.
3. An assigned integration Builder combines results, runs the integration gate,
   and pins one exact candidate.
4. One fresh independent Reviewer checks Authority Compliance, correctness,
   repository standards, simplicity, craft, and evidence against the complete
   candidate.
5. The original Builder may return up to three complete continued delivery
   candidates. Every admitted finding enters continuation 1 in one feedback batch.
   Each continuation must satisfy the convergence gates in FORGE-D25.
6. The same Reviewer performs targeted closure of stable findings, the original
   accepted outcome, and the changed blast radius without reopening general Review.
7. Any convergence stop returns the Wave for replan or user input. P2 findings,
   nits, and advisories never keep the loop alive.

After Wave 2 passes Review, one independent QA owner runs Final Verify because
the combined candidate has cumulative cross-Wave risk. A PASS moves both Issues
to `ship/`. Ship reports the factual handoff only. This Build's separately
accepted terminal in FORGE-D10 included a clean commit; Forge's general Ship
route does not commit or perform another external action.

## Completion

Forge v1 is complete when the accepted files exist, deterministic tests pass,
semantic eval fixtures cover the named regressions, each Wave has a direct PASS,
the earned Final Verify binds proof to the complete candidate, and the branch is
clean and committed under this Build's specific authority.

The Reviewer-owned [Wave 2 targeted closure](waves/wave-002/review.md#targeted-closure---repaired-candidate)
records the final Wave Review and complete-candidate Verify PASS for the repaired
candidate.
