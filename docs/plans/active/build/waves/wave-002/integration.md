# Wave 2 integration

BLUF: Wave 2 is integrated, mechanically green, and pinned for one independent
Review of the complete Forge candidate.

- Owner: Wave 2 Integration Builder
- Issue: `FORGE-002`
- Candidate: `forge-v1-sha256:d1faecb1411e3a46b30ee952eb0d5164a1690b5f361471eadb9cec5bdc0ad21d`
- Source base: `dc9736b07a582cbcb92bcb4cb82f45d1c36f75f0`
- Review plan: [Wave 2 gate](../../verification.md#wave-2-gate)
- Next: independent Wave Review against this exact candidate

## Direct inputs

| Assignment | Plan | Result | Integration status |
| --- | --- | --- | --- |
| File mechanics | [plan](builds/build-001-mechanics/plan.md) | [result](builds/build-001-mechanics/result.md) | Integrated; owned tests pass |
| Fallback agent process | [plan](builds/build-002-agents/plan.md) | [result](builds/build-002-agents/result.md) | Integrated; owned tests pass |
| CLI fixtures | [plan](builds/build-003-cli-fixtures/plan.md) | [result](builds/build-003-cli-fixtures/result.md) | Prior missing-entry blocker resolved; all black-box tests pass |
| CLI integration | [plan](builds/build-004-integration/plan.md) | [result](builds/build-004-integration/result.md) | Complete |

## Integration result

- `forge/__main__.py` maps every accepted CLI signature to an existing public
  mechanics function. It does not select routes, judge findings, or advance a
  semantic gate.
- `bin/forge` is executable and resolves Forge independently of caller cwd.
- Domain and operating failures return exit `1`. Invalid CLI syntax returns exit
  `2`. Successful commands report concise facts; `issue ready --json` emits
  machine-readable ready facts.
- The complete suite passes with no sibling contract changes and no weakened
  tests.

## Proof

The direct [Build result](builds/build-004-integration/result.md) records the 43
deterministic tests, 10 black-box CLI tests, compile check, arbitrary-cwd smoke,
links, terminology, and diff hygiene. The candidate manifest covers the root
dispatch and all non-generated Forge harness files outside this mutable Build
record.

## Return

Review the complete candidate once against the accepted Spec, decisions,
FORGE-002, repository rules, and Wave 2 gate. Do not Review individual Builds.
