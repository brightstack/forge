# Build result: build-003 - templates and semantic evals

BLUF: Forge now has a concise artifact-template set and semantic regression pack covering the accepted authority, Review, runtime, and Final Verify boundaries.

- Persistence timestamp: 2026-08-19T02:46:50Z
- Execution timing: The implementation and original checks preceded this durable handoff. This result was persisted afterward to close Wave Review finding `W001-F004`.
- Status: `DONE_LOCAL`
- Issue: `FORGE-001`, Wave 1 assignment 3
- Plan: `apps/forge/docs/plans/active/build/waves/wave-001/builds/build-003-templates-evals/plan.md`
- Source candidate: commit `a521e11a1`
- Environment: local Forge worktree; Markdown and shell checks only

## Owned files

- `apps/forge/skills/forge/assets/`: 17 templates for root, phase, and Wave indexes; decisions and log; Spec, Design Brief, Technical Design, Project Plan, and Verification Plan; Issue; Build plan and result; Wave Review; Final Verify; Acceptance; and release.
- `apps/forge/evals/README.md`: semantic evaluation contract.
- `apps/forge/evals/cases/`: nine cases for requirement laundering, invented cases, Manager role collapse, wrong evidence, unauthorized Auto, per-Issue Review leakage, speculative guarantees, native-first runtime, and the Final Verify boundary.

## Built

- Compressed the research templates to one job per artifact and removed old terminology and unnecessary ceremony.
- Made Wave Review admit only evidenced P0 and material P1 findings with authority, reachability, direct evidence or causal trace, material impact, and the smallest in-contract correction.
- Kept stable finding IDs, one repair batch, and targeted closure. Findings are not capped; work that does not fit one batch routes out.
- Made Final Verify check the complete candidate against accepted artifacts without inventing requirements or turning missing proof into PASS.

## Evidence

| Contract | Command or artifact | Result |
| --- | --- | --- |
| Candidate contains the owned files | `git show --stat a521e11a1 -- apps/forge/skills/forge/assets apps/forge/evals` | PASS: 27 files and 686 inserted lines |
| Template inventory | `find apps/forge/skills/forge/assets -maxdepth 1 -type f -name '*.md'` | PASS: 17 files, 494 lines |
| Eval inventory | `find apps/forge/evals -type f -name '*.md'` | PASS: 10 files, 192 lines |
| Markdown tables | Scoped `awk` column-count check over all owned Markdown | PASS: no inconsistent table rows |
| Titles | First non-empty line check over all owned Markdown | PASS: every file has an H1 title |
| Style and terminology | Scoped `rg` checks for trailing whitespace, deprecated naming, `Supervisor`, and forbidden dash characters | PASS: no matches |
| Links | Scoped Markdown-link search | PASS: no file links to resolve; templates use explicit path placeholders |
| Candidate identity | `git diff --exit-code a521e11a1 -- apps/forge/skills/forge/assets apps/forge/evals` | PASS: owned files match candidate `a521e11a1` |

## Deviations or risks

- The durable `plan.md` and `result.md` were missing from the original handoff and were added after implementation. Their timestamps and execution timing state this directly.
- These are human-readable contracts. The semantic cases require an evaluator; they are not prompt-prose unit tests.
- No source, test, skill router, workflow reference, git state, or existing report was changed by this handoff completion.

## Integration notes

- The router can link the 16 agreed asset filenames directly. `log.md` is the only additional template.
- No further integration work is required for this assignment.
