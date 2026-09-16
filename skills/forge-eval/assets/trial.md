# Forge behavioral eval trial: <trial ID>

BLUF: <PASS | PARTIAL | FAIL | INVALID | ERROR and decisive evidence>

- Eval plan/version: <path and immutable ID>
- Task ID and version: <ID and digest>
- Arm: <FORGE | CONTROL>
- Forge candidate: <candidate ID | not provided to control>
- Matched-pair ID: <pair ID>
- Trial number: <n of planned count>
- Trial agent identity: <host-native ID or unavailable>
- Evaluator identity: <host-native ID or deterministic-only>
- Model profile: <host, model/snapshot, effort/reasoning, tools, limits>
- Candidate/workspace identity: <base, exact head or fixture digest, workspace>
- Context isolation: <fresh conversation, workspace reset, excluded context, limitations>

## Outcome

- Verdict: <PASS | PARTIAL | FAIL | INVALID | ERROR>
- Stop reason: <completed | budget | timeout | permission | infrastructure | contamination | other>
- Material failures: <check IDs and failure class, or none>
- Non-comparison failures: <runtime/evaluator/invalidity details, or none>

## Observable artifacts and actions

| Evidence | Identity or pointer | Observation |
| --- | --- | --- |
| Final artifacts | <paths/digest> | <what exists> |
| Action/tool log | <pointer or unavailable> | <relevant actions> |
| Deterministic output | <command and output pointer> | <result> |

## Evaluator-only checks

| Check ID | Type | Result | Direct evidence |
| --- | --- | --- | --- |
| <ID> | <deterministic | artifact | action> | <PASS | FAIL | N/A | ERROR> | <pointer or causal trace> |

The evaluator bundle was unavailable to the trial agent: <method or limitation>.

## Telemetry

| Metric | Availability | Value | Source |
| --- | --- | --- | --- |
| Started at | <reported | measured | unavailable> | <timestamp or unavailable> | <host/evaluator> |
| Ended at | <reported | measured | unavailable> | <timestamp or unavailable> | <host/evaluator> |
| Wall-clock latency, launch through verdict | <reported | measured | unavailable> | <duration or unavailable> | <host/evaluator> |
| Trial agents started | <reported | observed | unavailable> | <count or unavailable> | <host/evaluator> |
| Subagents started | <reported | observed | unavailable> | <count or unavailable> | <host/evaluator> |
| Evaluator agents started | <reported | observed | unavailable> | <count or unavailable> | <host/evaluator> |
| All agents started | <reported | observed | unavailable> | <count or unavailable> | <host/evaluator> |
| Execution input tokens | <reported | unavailable> | <count or unavailable> | <host> |
| Execution output tokens | <reported | unavailable> | <count or unavailable> | <host> |
| Execution cached tokens | <reported | unavailable> | <count or unavailable> | <host> |
| Execution reasoning tokens | <reported | unavailable> | <count or unavailable> | <host> |
| Execution total tokens | <reported | unavailable> | <count or unavailable> | <host> |
| Evaluator total tokens | <reported | unavailable> | <count or unavailable> | <host> |
| Overall total tokens | <reported | unavailable> | <count or unavailable> | <host/evaluator> |

Use `0` only when the named source explicitly reports zero.

## Deviations and notes

- Match deviations: <none, or exact deviation from the plan>
- Telemetry gaps: <none, or unavailable fields and why>
- Evidence limitations: <none, or exact limitation>
