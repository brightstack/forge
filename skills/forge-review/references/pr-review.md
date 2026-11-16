# Pull request review

This entry supplies PR intake, re-review and a publishable report. Use
[Independent Review](review.md) for the shared dimensions, staffing, severity,
admission and internal verdicts; do not create another review protocol. A PR may
be reviewed without a Forge loop or Forge-created Spec.

## Pin the PR and its intent

Resolve repository, PR number/URL, actual base repository/ref/SHA, current head
repository/ref/SHA, and merge base. Fetch the necessary refs and inspect the
complete PR diff from that merge base to the pinned head; never assume `main` is
the base. Use the target harness's checkout and GitHub guidance. Inspect source,
callers and proof from the exact local candidate, with the checkout and any
container/runtime mount verified against that candidate. Keep the user's existing
work safe; do not reset or stash it to prepare a review.

Read the PR description, linked issue/project and acceptance criteria, relevant
decisions and the harness `forge context` selects. Record source identity/revision,
explicit obligations, authority status, non-goals and unresolved intent separately.
PR claims are context to challenge, not proof of completion. Missing documentation
does not establish a missing approver or invent an approval gate. Ask only for a
material choice the existing sources and authority cannot resolve.

Read existing review summaries, inline findings and author responses before
forming a re-review packet. Preserve prior IDs, reviewed SHA and original claims;
do not trust earlier verdicts or copy findings without checking the current code
and repository contracts.

## Execute and integrate

Apply the shared judge selection and workflow staffing. Record selected
dimensions, actual owners and excluded/not-applicable coverage with reasons in
the existing report. The integrated Reviewer owns the result and checks actual
assignments and returned evidence before claiming coverage.

Resolve repository-sanctioned setup and required checks. Record one execution
owner for checks that contend for shared resources; other judges consume those
results and request targeted checks. Reuse credible current evidence, run missing,
stale, contradictory, required or hypothesis-relevant proof, and resolve routine
stopped services/dependencies within existing authority before calling them a
blocker. Do not impose a specific runtime, model or mandatory QA phase.

Bind check names, commands, results and CI job links to the reviewed head. Inspect
actual failure evidence before calling it a PR regression or a baseline failure;
compare with the actual base when that distinction matters. An environment timeout
is a proof gap, not automatically a code defect. Bound repetitions to the question
they answer. Missing required proof or independence prevents approval even when
there are no findings. Browser/acceptance claims require their own actual evidence;
Review alone does not establish Verify.

## Re-review the current head

Refresh PR state before dispatch and before returning the final report. If head
or base changed during the task, mark the old verdict stale, inspect the new
comparison and affected contracts/dimensions, then issue a verdict for the current
candidate. Reuse unaffected proof only with a candidate-bound reason. If refresh
or re-review cannot finish, report the exact reviewed SHA and current gap; do not
present stale approval as current. This does not start background monitoring.

For each previous finding, record `fixed`, `persists`, `withdrawn`, or `unverified`
with current evidence. Read rebuttals and inspect the caller/schema/test constraint
before recommending a change. Preserve withdrawn claims and why they were wrong;
review the whole affected result rather than treating the old findings as an
exhaustive checklist.

Resume missing authorized work after a transient host failure using the accepted
brief and completed reports. An infrastructure interruption is not human
cancellation. Bound batch concurrency by host limits and shared proof capacity.

## Prepare and publish only within authority

Prepare the actual [PR report](../assets/pr-review.md), with verdict first,
P0/P1/P2 findings, compact dimension outcomes, reviewed SHA, checks, gaps and
usable evidence links. Use an automated-review voice even if publishing through
the user's account. Scale it to the change: for a tiny PR, coverage can be one
sentence and checks a compact result summary. Keep the detailed integrated report,
full authority packet and original judge returns in existing internal records;
link only reader-accessible records when useful. Do not paste complete dimension
or per-test tables, local path inventories or internal authority history into the
PR-facing report. Give findings precise current anchors. Include acceptance
evidence when available and screenshots when feasible and relevant; inspect the
rendered image and caption. Local file paths and descriptions of unseen captures
are not usable GitHub evidence. Resolve an authorized upload/hosting method and
retention implications; if unavailable, state the evidence gap honestly.

Map the internal verdict to the PR-facing heading and publication intent:

| Internal verdict | PR heading | Native review intent when authorized |
| --- | --- | --- |
| PASS | APPROVE | Approve the reviewed candidate |
| REVISE | REVISE | Request changes |
| RETHINK | RETHINK | Request changes |
| READY_FOR_USER | DECISION NEEDED | Comment without approval or change request |
| BLOCKED | REVIEW INCOMPLETE | Comment without approval or change request |

Keep internal verdicts unchanged. Incomplete required proof cannot become
APPROVE; a REVIEW INCOMPLETE report may have zero defects. The heading reports
judgment and does not itself establish the provider's native review state.

A PR URL or review request authorizes read-only inspection and a prepared report.
It does not authorize posting comments/reviews, undrafting, merging, updating the
issue, or routing/performing fixes. Preserve any explicit standing publication
authorization; do not ask again when it already covers the action. Honor a
requested draft-before-post gate until later explicit authorization supersedes it.
An explicit comment-only instruction limits publication to a comment; it does not
authorize native approval or a change request. Automated voice does not require
every finding inline.

Immediately before authorized posting, recheck base/head and re-review changes
as above. Confirm the exact current head matches the reviewed SHA, target and
anchors, and bind the submission to that SHA when supported. Publish only the
authorized action. Inspect the returned native state and URL, reading the
submitted review back if needed, before claiming approval or requested changes.
A passing review never implies merge authority.

For GitHub, when native review publication is authorized, APPROVE requires an
actual formal review submitted with the `APPROVE` event; an issue comment saying
APPROVE is insufficient. REVISE and RETHINK submit `REQUEST_CHANGES`.
DECISION NEEDED and REVIEW INCOMPLETE use `COMMENT` or an authorized PR comment,
without approval or requested-changes state. Preserve explicit comment-only and
draft-before-post limits even when the judgment is APPROVE. Report a comment-only
result as a recommendation, not a formal approval. If permissions, self-review or
another provider restriction prevents the intended native action, report the
actual failure and unsubmitted state; do not silently substitute a comment and
claim that approval succeeded.
