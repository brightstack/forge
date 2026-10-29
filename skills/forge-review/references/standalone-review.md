# Standalone code, branch, commit, or diff review

This entry is integrated Forge Review selected over a standalone candidate. An
explicit standalone code-only request instead runs the
[Code Review leaf](../../forge-code-review/SKILL.md) directly, without Forge
Review, Launch, or other dimensions.

Use the caller's exact target and path/range boundary. With no named target,
inspect the complete current working tree: staged and unstaged changes plus
relevant untracked files. For a branch, resolve its actual comparison ref and
merge base; for a commit, compare with its parent. Record fixed SHAs, dirty state,
and path scope. Do not switch branches or stash the user's work to form a diff.

Resolve current intent from the request, supplied acceptance criteria, decisions,
and applicable repository harness. Absence of a Forge loop or Forge-created Spec
does not prevent review. Distinguish established obligations from draft intent
and consequential unresolved choices; do not manufacture a new approval gate.

Follow [Independent Review](review.md) with its existing selected dimensions,
staffing and verdicts. Use the [review template](../assets/review.md) at the size
earned by the assignment. Return the report and stop; candidate fixes, runtime
Verify, publication, and repair routing require their own authorization.
