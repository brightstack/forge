# Build 004 - Wave 2 integration

Wire the accepted Forge CLI to the three completed Wave 2 Build lanes, prove the
black-box contract, and pin one exact candidate for independent Wave Review.

## Ownership

- Issue: `FORGE-002`
- Primary paths: `forge/__main__.py`, `bin/forge`, this Build directory,
  `wave-002/integration.md`, and factual Wave, root, Plan, and Issue state.
- Compatibility edits outside primary paths are limited to defects exposed by
  the accepted black-box contract. Do not add semantics or weaken tests.

## Plan

1. Map every accepted CLI signature to the existing public mechanics API with
   `argparse`, concise factual output, JSON only where requested, and stable
   operational failures.
2. Make `bin/forge` executable and independent of the caller's working
   directory.
3. Run the complete deterministic suite, compile checks, black-box smoke,
   scoped documentation and terminology checks, candidate and status checks,
   and diff hygiene.
4. If all integration proof passes, move `FORGE-002` from `in-progress` to
   `review`, pin the exact candidate, and hand the complete Wave to an
   independent Reviewer.

## Stop condition

Stop for Plan or user input if the accepted CLI cannot be wired without changing
semantic authority, adding state, or weakening an accepted contract.
