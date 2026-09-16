# Build 001 - File mechanics

Implement the standard-library record, Issue, dependency, and validation facts
required by FORGE-002 without adding semantic workflow decisions.

## Contract and assumptions

- `forge init` creates only `index.md` and `decisions.md`; control, authority,
  terminal, and permitted external actions remain explicit facts.
- Issue state is the parent directory of one stable `<ID>.md` file. The Markdown
  `Issue:` and `Depends on:` fields are the only parsed metadata.
- Callers supply evidence paths and candidate identities. Mechanics validate
  presence and consistency, not professional sufficiency.

## Route

1. Add safe root/path helpers, minimal initialization, and locked durable append
   with duplicate-heading rejection.
2. Add unique Issue resolution, legal atomic movement, dependency graph
   validation, and planned ready-set calculation.
3. Add artifact and loop validators for required shape, unique Issue state, and
   exact candidate consistency.
4. Prove the public functions with deterministic `unittest` cases covering
   concurrent append, Auto fields, traversal and symlink escape, transitions,
   missing dependencies, cycles, readiness, and candidate mismatches.

## Proof and stop trigger

Run `python3 -m unittest discover -s apps/forge/tests -p 'test_*.py'` for this
owned slice. Stop if the accepted Markdown contracts cannot express a required
fact without adding another state store or semantic decision.
