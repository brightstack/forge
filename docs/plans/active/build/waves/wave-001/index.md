# Wave 1 - Contract and harness

- Status: `CLOSED`
- Issue: `FORGE-001` in the [Issue board](../../issues/)
- Original candidate: `a521e11a179f05cd6f93c5f82738bb3c24d75b62`
- Closure candidate: `ac3403a42ad53fe8370372cd9b13412f5a0724d0`
- Review plan: [Wave 1 gate](../../verification.md#wave-1-gate)
- Initial Review: [four admitted P1 findings](review.md)
- Targeted closure: [PASS](review.md#targeted-closure)
- Repair: [build-004-repair](builds/build-004-repair/plan.md)
- Integration: [direct integration record](integration.md)
- Repair batch: spent
- Blocker: none
- Next: Wave 2 is dependency-released.

## Parallel assignments

1. App entry, accepted Build package, and role instructions.
2. Thin Forge router and progressive workflow references.
3. Artifact templates and semantic failure-mode evals.

Direct Build handoffs:

1. [Contracts plan](builds/build-001-contracts/plan.md) and
   [result](builds/build-001-contracts/result.md).
2. [Router plan](builds/build-002-router/plan.md) and
   [result](builds/build-002-router/result.md).
3. [Templates and evals plan](builds/build-003-templates-evals/plan.md) and
   [result](builds/build-003-templates-evals/result.md).
4. [Review repair plan](builds/build-004-repair/plan.md) and
   [result](builds/build-004-repair/result.md).

An assigned integration Builder resolves links and vocabulary, runs scoped checks,
and pins the candidate. One fresh Reviewer then returns PASS or material findings.
One repair Builder can fix all admitted P0 and material P1 findings in one batch,
followed by targeted closure from the same Reviewer.

The Manager records assignments and links direct results. It does not write,
integrate, Review, or repair any assignment itself.
