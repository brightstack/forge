# Wave 2 Repair Build Plan

- Issues: `FORGE-002`; admitted Review findings `W002-F001`, `W002-F002`, and `W002-F003`
- Starting source: `7b163418e8f8d5c0ff8fae74a24faeab287ac38e`
- Authority: [Wave 2 Review](../../review.md), accepted Forge decisions, Technical Design, and Verification Plan

## Outcome and route

Close the three admitted mechanical gaps without changing Forge's CLI or semantic
workflow boundary. Reuse existing containment, Markdown-field, and process-state
machinery:

1. Make an append without an explicit root discover and validate its enclosing
   initialized Forge run before mutation; preserve explicit-root library use.
2. Make loop validation require a direct mechanically passing Review for every
   closed Wave, bind that Review to the Wave candidate, and bind Final Verify's
   declared Wave Review paths to those actual passing reports.
3. Stop retaining child stdout and stderr in Forge-controlled state so an echoing
   child cannot persist pointer bytes; preserve lifecycle and launch-error facts.

## Proof and stop trigger

Add focused unit and black-box regressions for the three reported reproductions,
then run all Forge unittests, CLI black-box tests, compile, arbitrary-directory
help, scoped links, diff hygiene, terminology checks, and candidate reconstruction.
Stop without widening the repair if accepted authority must change or any finding
cannot close within this single batch.
