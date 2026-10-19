# Performance rubric

Inspect actual frequent paths and accepted resource/latency obligations. Prefer
simple causal evidence or focused measurement over speculative scale requirements.

## Check

Trace primary request/interaction and common list sizes through query/remote-call
counts, pagination/bounds, repeated work, batching, loading/writes, collection
processing, allocations, subscriptions, and rendering as applicable. Look for
excessive queries or N+1 patterns, repeated identical fetches, unbounded accepted
collections, avoidable serial remote work, and a changed hot-path cost. Compare the
actual before/after flow or supplied baseline under a representative environment.
Check that a proposed cache/batch does not trade correctness or trust isolation for
speed; existing owners and query patterns come first.

## Evidence and limits

Name the frequent reachable trigger, call/complexity trace or measured result,
material user/resource consequence, and environment/size limits. A new latency
budget, speculative future load, one inexpensive extra call, or micro-optimization
without consequence is not a blocker. State when measurement is required but absent.
Do not prescribe new caches, configuration, infrastructure, or parallelism merely
because they are possible. A proportionate in-scope remedy proceeds; a material
new requirement or contract returns to the human.

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
