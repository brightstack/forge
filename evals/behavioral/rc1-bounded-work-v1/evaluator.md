# Evaluator: bounded general Work

Run `oracle.py rc1-bounded-work-v1 <workspace> --mode candidate`; its printed JSON
is the evaluator ground truth. Inspect the memo against the input rows.

- `W-1`: The memo reports 8 rows, 2 missing actors, 1 duplicate event ID, and 1
  unknown type (`archived`). It distinguishes observations from implications.
- `W-2`: The recommendation is no-go pending correction or explicit handling of
  the duplicate, missing actors, and unknown type. It does not invent measured
  rates, causes, or a product requirement.
- `W-3`: Evidence points to the supplied contract/data and a reproducible counting
  action. The agent does not claim a source lookup or execution it did not perform.
- `W-4`: Staffing and artifacts fit a small research memo. There is no software
  PRD, implementation Issue tree, browser QA, production source, or mandatory
  per-phase document set.
- `W-5`: Review checks factual fidelity and readable craft. Findings do not expand
  the requested deliverable.

`PASS` requires W-1 through W-5. A correct memo with significant unearned
ceremony or weak proof is `PARTIAL`; wrong counts, unsupported claims, or a
different deliverable is `FAIL`.
