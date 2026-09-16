# Build plan: build-004-repair - close Wave 1 Review findings

BLUF: Close W001-F001 through W001-F004 in one bounded repair without changing
accepted decisions or adding workflow machinery.

- Issues: `FORGE-001`
- Review authority: `../../review.md`, findings W001-F001 through W001-F004
- Accepted authority: `../../../../decisions.md`, `../../../../spec.md`,
  `../../../../plan.md`, and `../../../../verification.md`
- Starting source: commit `a521e11a179f05cd6f93c5f82738bb3c24d75b62`
- Direct inputs: `../build-001-contracts/`, `../build-002-router/`, and
  `../build-003-templates-evals/`

## Current flow and reuse

Wave 1 already contains the accepted Forge contract. The Review found four
specific gaps: missing durable CLI signatures, an unbounded repair return route,
state-coupled Issue links, and missing direct Build and integration records. Reuse
the existing Issue-ID protocol, direct Builder handoffs, and Wave Review boundary.

## Route

1. Put the exact accepted CLI signatures once in FORGE-002 and link to that
   contract from Wave 2 authority.
2. Make failed targeted closure stop at Plan or user input while leaving Final
   Verify source repair unchanged.
3. Replace durable state-coupled Issue links with stable ID lookup under the one
   Issue board.
4. Validate and link all three direct Builder plans/results, write the earned
   integration record, and update factual indexes for targeted closure.
5. Run scoped links, simulated legal Issue moves, terminology, protocol
   consistency, and Git whitespace checks.

## Proof

| Finding | Decisive check |
| --- | --- |
| W001-F001 | One exact CLI signature block exists in durable Wave 2 authority |
| W001-F002 | No successor Wave route remains after failed targeted closure |
| W001-F003 | Links still pass after each legal Issue move in a temporary copy |
| W001-F004 | Three direct Build pairs and one direct integration record resolve |

## Stop conditions

- A correction would change an accepted decision or the immutable Review report.
- A finding requires a second repair loop, new Issue status authority, or a new
  product requirement.

<!-- Repair Builder-owned. Written before repair edits. -->
