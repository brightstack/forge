# Wave 1 integration

BLUF: The Integration Builder validated the three original Builder handoffs,
integrated the four admitted Review corrections, and prepared one exact repair
candidate for targeted closure.

- Owner: Wave 1 Integration Builder
- Original candidate: `a521e11a179f05cd6f93c5f82738bb3c24d75b62`
- Initial Review: [W001-F001 through W001-F004](review.md)
- Repair plan: [build-004-repair plan](builds/build-004-repair/plan.md)
- Repair result: [build-004-repair result](builds/build-004-repair/result.md)
- Closure candidate: the commit containing this record; the Reviewer records its
  exact hash before targeted closure

## Direct inputs

| Assignment | Plan | Result | Validation |
| --- | --- | --- | --- |
| Contract and roles | [plan](builds/build-001-contracts/plan.md) | [result](builds/build-001-contracts/result.md) | Pair exists, owned scope is named, source is `a521e11a1`, and retrospective persistence is explicit |
| Router and workflows | [plan](builds/build-002-router/plan.md) | [result](builds/build-002-router/result.md) | Pair exists, owned scope is named, source is `a521e11a1`, and retrospective persistence is explicit |
| Templates and evals | [plan](builds/build-003-templates-evals/plan.md) | [result](builds/build-003-templates-evals/result.md) | Pair exists, owned scope is named, source is `a521e11a1`, and retrospective persistence is explicit |

These records were written by their original Builders after Review exposed the
missing durable handoff. Their timing fields state that fact. This integration
record does not claim they existed before the original candidate.

## Integrated repair

- W001-F001: the Technical Design now owns the one exact Wave 2 CLI signature
  contract. FORGE-002, Wave 2, and runtime guidance link to it.
- W001-F002: failed targeted closure stops at Plan or user input. Final Verify's
  separately accepted source-repair route remains intact.
- W001-F003: durable records cite stable Issue IDs and the Issue board root.
  Status remains the single matching Issue file's parent directory.
- W001-F004: the Wave index links all direct Build pairs, this integration record,
  and the direct repair plan and result.

## Integration evidence

| Check | Result |
| --- | --- |
| Three original plan/result pairs, source identity, and timing disclosure | PASS |
| Complete Markdown links and anchors | PASS |
| Every legal Issue move in isolated temporary copies | PASS |
| Exact CLI signature block occurs once | PASS |
| Forbidden successor repair route absent; Final Verify repair route present | PASS |
| Operational Forge terminology and writing-style scans | PASS; one immutable Builder result names the term it searched for as historical evidence |
| `git diff --check` | PASS |

## Return

Request targeted closure from the original Reviewer against the exact commit that
contains this record. Keep FORGE-001 in `review/` until that Reviewer returns PASS.

<!-- Direct Integration Builder record. It does not alter the immutable Review. -->
