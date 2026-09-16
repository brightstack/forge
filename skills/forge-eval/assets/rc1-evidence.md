---
id: <evidence-id>
code: <readable-code>
type: eval-evidence
status: not-run
---

# RC1 behavioral evidence: <case and trial>

BLUF: `NOT RUN` until the cited native action or candidate check exists.

- Case/version: <case ID and task/fixture digests>
- Candidate/base: <exact commit/digest and dirty state>
- Workspace: <absolute staged path>
- Forge candidate: <revision/digest>
- Host/model/effort/tools: <actual profile>
- Trial agent: <native ID>
- Independent Reviewer/Verifier: <native IDs or NOT RUN>
- Started/ended: <timestamps or unavailable>

| Check | Status | Direct evidence |
| --- | --- | --- |
| Seed integrity | NOT RUN | <command/output> |
| Candidate deterministic oracle | NOT RUN | <command/output> |
| Native delegation and integration | NOT RUN | <action log/agent IDs> |
| Independent Review | NOT RUN | <candidate packet/verdict/action log> |
| Runtime or artifact acceptance | NOT RUN | <actions, expected/observed, output> |
| Visual acceptance when applicable | NOT RUN | <URL, viewport, state, screenshot> |
| Authority and scope preservation | NOT RUN | <artifact diff and source anchors> |
| Repair/rethink when applicable | NOT RUN | <findings, disposition, new candidate> |

## Candidate changes and handoff

- Changed behavior/artifact: <facts>
- Integration seams: <facts>
- Commands actually executed: <commands and exit/output pointers>
- Gaps and unavailable evidence: <facts>
- Stop reason: <completed/input/budget/infrastructure/other>

## Evaluator verdict

- Verdict: `NOT RUN | PASS | PARTIAL | FAIL | INVALID | ERROR`
- Material check evidence: <case check IDs and pointers>
- Limitations: <sample, host, isolation, telemetry>
- Claim boundary: guided evidence for this exact candidate and case; not a
  comparative benchmark unless a separate matched eval plan says otherwise.
