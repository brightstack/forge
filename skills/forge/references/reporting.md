# Reporting and failure routes

Lead with the achieved result and requested boundary. Name the exact candidate or
artifact, accepted sources, actual evidence, material gaps, and next required
action. Link direct records instead of reproducing long histories or agent chatter.

Use these dispositions:

- `PASS`: the exact artifact or candidate satisfies this phase's contract.
- `REVISE`: a bounded correction inside accepted intent is required.
- `FAIL`: actual acceptance demonstrated a required behavior or constraint fails.
- `RETHINK`: the mechanism or causal explanation must change before more edits.
- `READY_FOR_USER`: a human decision, semantic authority, or ungranted external
  action is required.
- `BLOCKED`: access, environment, dependency, or required evidence prevents an
  honest result.
- `INCONCLUSIVE`: the current acceptance seat cannot judge and a replacement or
  different capability may still resolve the gap.
- `STOPPED`: the user stopped the work.

Review PASS means no admitted blocking finding at the inspected candidate.
Acceptance PASS means the actual Review-passed outcome met applicable acceptance evidence.
Neither means Ship occurred. A structural document check establishes structure,
not semantic correctness or runtime behavior.

For work in progress, report `Done`, `Evidence`, `Gaps`, and `Next`. Omit
empty sections, unchanged status, prompt transcripts, token counts, raw agent
rosters, and speculative follow-on work.

At a human gate, follow the [gate briefing](workflows.md#gate-briefing). That
guidance is chat reporting only. Do not treat a path, heading list, or loop ID
as the briefing, and do not save it as a loop record. At completion, use the same
clarity for actual changes, material exceptions, preserved behavior, proof, gaps,
and the next action. The examples below are shapes to adapt, not required text,
headings, word counts, or tables.

## Chat briefs

**Decision brief example:** “The proposal lets a member reopen a completed task
from its row. **Added:** Reopen returns the task to the active list. **Preserved:**
completion history and permissions. The draft also proposes deleting history
after 30 days; that is a separate retention change. I recommend keeping history
because no accepted source authorizes deletion. The interaction has a prototype;
browser and assistive proof remain open. Choose (1) approve Reopen, which adds
the action, and (2) retain history or authorize a specific retention rule.
The exact Product revision and prototype show the detail.” If the user answers
only (1), (2) stays open. Link the actual revision and prototype in a real brief.

For consequential wording or behavior changes, an optional compact comparison can
show `Item | Current | Proposed | What changes`. Use the last column to say why
the correction or removal matters, not merely repeat the new text. Keep every
material choice and its recommendation in the surrounding chat; the table is a
reading aid, not another artifact or a required format.

**Change brief example:** “Reopen now works from the task row. **Changed:** the
action and active-list update. **Exception:** retention did not change; the
separate choice remains open. **Preserved:** history and permissions. The focused
checks passed on the exact candidate; browser acceptance was not run, so complete
Acceptance is still open. The Review record has the verdict. Next: decide
retention or request acceptance.” Use actual observed evidence and exact links
to the candidate and Review; do not imply a proof level that was not run.

## Explain

`Forge explain <artifact or change>` is a direct read-only operation. Retrieve
the named artifact, its exact revision, applicable accepted sources and decisions,
and available candidate or proof records. Explain the current proposal or actual
result in chat using the brief shape above: material changes and preserved meaning,
accepted versus open choices, evidence and limits, and exact source links. Name a
source gap when one remains. Do not initialize a loop, ask for Launch approval,
edit records, or turn an inference into a decision. Stop after the explanation.
