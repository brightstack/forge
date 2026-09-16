# Read-only code review

Review the exact candidate diff from `HEAD` to the working tree. The change
extracts event-key construction while preserving deduplication behavior.

Inspect `AGENTS.md`, all changed code, its callers, supplied tests, and the public
representative input under `inputs/`. You may run non-fixing checks and focused
probes. Do not edit the repository, repair the candidate, start a delivery
lifecycle, or claim Acceptance. Return an evidence-backed code-review verdict
with findings ordered by severity; a clean verdict is valid.
