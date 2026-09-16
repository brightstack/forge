# Wave 2 - CLI and mechanical proof

- Status: `CLOSED`
- Issue: `FORGE-002` in the [Issue board](../../issues/)
- Dependency gate: [Wave 1 Review PASS](../wave-001/review.md#targeted-closure)
- Original candidate: `forge-v1-sha256:d1faecb1411e3a46b30ee952eb0d5164a1690b5f361471eadb9cec5bdc0ad21d`
- Closure candidate: `forge-v1-sha256:b74fb43356cdded4dc324de5b72779bbd67815628c36be0cff416a5bdc701b36`
- CLI authority: [Wave 2 CLI contract](../../technical-design.md#wave-2-cli-contract)
- Review plan: [Wave 2 gate](../../verification.md#wave-2-gate)
- Integration: [direct integration record](integration.md)
- Initial Review: [three admitted P1 findings](review.md)
- Targeted closure: [PASS](review.md#targeted-closure---repaired-candidate)
- Repair: [build-005-repair](builds/build-005-repair/plan.md)
- Repair batch: spent
- Blocker: none
- Next: complete-candidate Verify passed; proceed to the authorized factual Ship
  handoff.

## Accepted work lanes

1. Record, Issue, dependency, and validation mechanics.
2. Generic fallback agent lifecycle.
3. Deterministic tests, route fixtures, and semantic eval fixtures.

These lanes define outcomes, not permanent assignments. The Manager records the
exact Builders and owned paths when dispatching against the current runtime.

An assigned integration Builder wires `bin/forge`, runs the complete suite, and
pins the candidate. Wave Review examines the complete Forge package, not only the
Wave 2 diff. After at most one repair batch and targeted closure, the passed
candidate enters one Final Verify.

## Direct Build handoffs

1. [File mechanics plan](builds/build-001-mechanics/plan.md) and
   [result](builds/build-001-mechanics/result.md).
2. [Fallback agent plan](builds/build-002-agents/plan.md) and
   [result](builds/build-002-agents/result.md).
3. [CLI fixtures plan](builds/build-003-cli-fixtures/plan.md) and
   [result](builds/build-003-cli-fixtures/result.md).
4. [Integration plan](builds/build-004-integration/plan.md) and
   [result](builds/build-004-integration/result.md).
5. [Review repair plan](builds/build-005-repair/plan.md) and
   [result](builds/build-005-repair/result.md).
