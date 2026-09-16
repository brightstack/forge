# Reminder fixture

Use Bun for JavaScript checks. Preserve accepted behavior in
`docs/specs/reminders/SPEC.md` and the approved Issue/change. Do not change tests
to make a failure pass. Work locally without network access, commits, publication,
new branches, or worktrees.

`deliverDueReminder` is the existing runtime consumer at a synthetic due boundary.
Its returned delivery and outbox write are observable delivery. No clock,
scheduler framework, persistence layer, or network service is in scope.

The exact compiled Forge binary supplied by the evaluator owns protected document
mutations. Direct filesystem edits must not bypass it.
