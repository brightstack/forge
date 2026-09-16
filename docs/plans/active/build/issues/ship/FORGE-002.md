# FORGE-002 - CLI and mechanical proof

- Issue: `FORGE-002`
- Kind: `Feature`
- Depends on: `FORGE-001` - Wave 1 Review must pass before CLI Build starts

## Outcome

Forge has a standard-library CLI that safely manages file mechanics and can run a
generic fallback agent command, with deterministic tests and complete-candidate
proof.

## Acceptance

- The implementation matches the exact [Wave 2 CLI
  contract](../../technical-design.md#wave-2-cli-contract).
- Shared record appends do not interleave or duplicate a heading under concurrent
  use.
- Issue movement validates prior state, legal transitions, evidence, and path
  containment before one atomic rename.
- Dependency readiness detects missing IDs and cycles and returns only factually
  ready planned Issues.
- The fallback agent lifecycle is provider-neutral, accepts its pointer through
  stdin, and keeps transient state outside the repository.
- Tests cover path and symlink escape, Issue transitions, dependencies, candidate
  identity, Auto boundaries, and fallback process lifecycle.
- Complete-candidate Wave Review and Final Verify pass.

## Proof

- Exact deterministic test command and result.
- Temporary-fixture CLI smoke run.
- Wave Review report bound to the exact candidate.
- Final Verify report bound to the complete exact candidate.
