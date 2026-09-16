# Forge Build-only evaluation handoff

BLUF: Forge's Build Lead produced a stronger-proven Simple Todo candidate in
`9m42s`, but remained `3m36s` slower than the historical `6m06s` one-shot. The
remaining small-task tax is Build intake, exhaustive self-verification, and four
durable Build records containing 2,246 words. The next improvement should reduce
that record burden without weakening Spec compliance or Builder quality.

## Accepted context

- The current Forge vNext decisions and artifact contracts remain authoritative.
- Builders build toward the complete accepted Spec. Review findings are signal,
  not requirements or the scope of the next repair.
- Builders may delegate meaningful outcomes to Workers. A single Small vertical
  Issue does not earn a Worker merely to create parallel activity.
- Plan Review freezes the Issue graph. Builders and Reviewers cannot add Issues.
- Reviewers own verdicts and may use read-only Judges. Review happens once at the
  coherent Wave boundary, not per Issue or Worker return.
- Exact Spec names and explicit human Key Tasks remain binding. Simplicity applies
  to unspecified latitude and surrounding machinery, never to accepted intent.
- Worktrees used for Worker or evaluation isolation stay short-lived.

## Evaluation evidence

The full vNext lifecycle trial is recorded at:

- `.forge-evals/2026-08-30-simple-todo-vnext/report.md`
- `.forge-evals/2026-08-30-simple-todo-vnext/telemetry.md`
- `.loops/2026-08-30-simple-todo-vnext/`
- `apps/forge/examples/todo-eval-v4/`

It passed without Review findings or repair loops. Intake through Simplify took
`55m02s`; Build dispatch through the Review verdict took `25m27s`. The run wrote
12 records totaling 5,235 words.

The later Build-only trial reused the accepted Product Spec, Delivery Plan, and
TODO-001 with a fresh no-history Sol/high Build Lead. It deliberately ran no
Reviewer, Judge, Verify, Simplify, Ship, commit, PR, or deployment. Its comparison
report is `.forge-evals/2026-08-31-simple-todo-build-only/report.md`.

The Build finished in `9m42s`, `59%` slower than the one-shot but `43%` faster
than the prior vNext Build phase. It produced 8 source files and 574 lines versus
the one-shot's 6 files and 512 lines. Both passed AC1-AC3, a rendered interaction
journey, console checks, and 320px long-content layout. The Forge candidate
preserved focus across complete, reopen, and delete; the one-shot left focus on
the document body after toggle and delete.

## Observed Build artifact tax

The Build-only Lead wrote:

- `build-plan.md`
- `wave-index.md`
- `build-result.md`
- `timing.md`

Those four files contained 2,246 words, 65% more words than the product source.
`build-plan.md` duplicated Plan-mode concerns even though an accepted Delivery
Plan and one Issue already existed. The Lead still needs tactical planning, but
that thinking can stay internal and flexible unless Workers need a shared
contract, an integration risk must survive a handoff, or a human decision is
required.

## Candidate next evaluation

This is a proposed experiment, not an accepted vNext contract change:

1. For a one-Issue small Build, keep one Builder and its proportional self-checks.
2. Do not require a separate durable Build plan or Wave index when the accepted
   Delivery Plan already defines one Issue and one Wave.
3. Produce one concise Build result. Capture timing, candidate identity, commands,
   and check outcomes mechanically where possible.
4. Preserve exact Spec traceability, harness compliance, rendered QA when UI is
   in scope, and material deviation or authority-gap reporting.
5. Repeat the same Todo treatment. Target `7-8 minutes` without treating the time
   target as permission to skip required proof.

Do not generalize the small-task shortcut to multi-Issue or parallel Waves before
a separate evaluation shows which coordination facts Workers and the Lead need.
