# Code Review rubric

Use the [Forge Code Review leaf](../../../../forge-code-review/SKILL.md) as the
bundled procedure, or the explicitly selected replacement. The Reviewer reads and
follows that leaf directly for Quick or other undelegated Code Review. A required
Code Review Judge receives the exact selected leaf path and reads it itself.
Both read the actual relevant target harness rules, references, exemplars, and
check paths before inspection. It stays a dimension leaf: no integrated panel,
repair, lifecycle advancement, or Verify.

## Check

Inspect the complete scoped diff, real callers and side effects, changed contracts,
async/state/error paths, applicable engineering rules, and tests as code. Verify
dependency claims against installed source/types or authoritative matching evidence.
Prioritize the changed primary flow and common adjacent paths. Retain practical
security/performance concerns even when no separate dimension was triggered;
route overlap to the appropriate owner rather than reporting a defect twice.

## Evidence and limits

A finding needs a concrete causal trace or observation at a reachable current
trigger, a material consequence, and the actual governing behavior/standard.
A sibling pattern is evidence, not a rule. Passing tests do not prove an outcome
they cannot detect. An accepted-Spec mismatch is graded by consequence; a remedy
outside the approved outcome returns the material decision to the human.

## Common contract

Read [authority](../../../../forge-shared/references/authority.md),
[finding admission](../../../../forge-shared/references/severity.md),
[actual target harness sources](../../../../forge-shared/references/target-harness.md),
[returns](../../../../forge-shared/references/returns.md), and the assigned exact
candidate/base, authority packet, target harness, and allowed tools. Remain
read-only. Judge current obligations and present risks; no finding quota,
new requirements, or automatic repair authority. Severity follows actual impact;
remedy scope is assessed separately.

Use the dimension section in [review.md](../../../assets/review.md), unless a
selected leaf supplies its own report. Return selected rubric, inspected scope,
checks/evidence, actual results, findings with trigger/consequence/remedy boundary,
gaps, and PASS, REVISE, RETHINK, READY_FOR_USER, or BLOCKED with its basis. A
required unperformed check is incomplete. The Reviewer inspects the actual report
and relevant new log evidence before disposition.
