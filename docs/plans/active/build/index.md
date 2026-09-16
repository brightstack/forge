# Forge v1 Build

Forge v1 reached Ship with both Waves closed and complete-candidate Verify
passed. This package is the accepted authority and evidence for the
implementation under `apps/forge`.

## Current state

- Phase: `Ship`
- Control: `guided`
- Authorized terminal: clean committed branch and factual handoff
- Current Wave: none - all planned Waves are closed
- Closed Waves: [Wave 1 - Contract and harness](waves/wave-001/index.md) and
  [Wave 2 - CLI and mechanical proof](waves/wave-002/index.md)
- Current candidate: `forge-v1-sha256:b74fb43356cdded4dc324de5b72779bbd67815628c36be0cff416a5bdc701b36`
- Final verification: [Reviewer-owned complete-candidate PASS](waves/wave-002/review.md#targeted-closure---repaired-candidate)
- Blocker: none
- Next: provide the authorized factual handoff.

## Accepted authority

- [Decisions](decisions.md) - invariant user choices and authority limits.
- [Spec](spec.md) - product and workflow outcome.
- [Technical design](technical-design.md) - minimum harness architecture.
- [Plan](plan.md) - Issues, dependencies, and Wave sequence.
- [Verification](verification.md) - Wave Review and Final Verify contracts.

## Issue board

- `backlog/` - proposed but not accepted.
- `planned/` - accepted and dependency-ready when prerequisites pass.
- `in-progress/` - active Build, integration, or Builder continuation.
- `review/` - participating in Wave Review.
- `verify/` - Wave Review passed and awaiting Final Verify.
- `ship/` - Final Verify passed and ready for the authorized Ship action.
- `cancelled/` - removed by an accepted decision.

Blocked is a condition in this index or the owning Wave index, not another status.
The Issue path is the single source of status. Issue metadata is the single source
of dependency truth.
