# Forge behavioral eval report: <name>

BLUF: <decision supported by the observed evidence>

- Eval plan/version: <path and immutable ID>
- Forge candidate: <revision/digest/file list>
- Tasks: <IDs and versions>
- Host/model profile: <host, model/snapshot, effort, limits>
- Context isolation: <fresh-agent/workspace/blinding method and limitations>
- Planned trials: <per task and arm>
- Completed valid trials: <Forge count; control count>
- Invalid/error trials: <counts by arm and reason>
- Claim boundary: descriptive results for this candidate, corpus, host, model profile, and sample only.

## Outcomes

| Task | Arm | PASS | PARTIAL | FAIL | INVALID | ERROR | Valid total |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| <ID> | Forge | <n> | <n> | <n> | <n> | <n> | <n> |
| <ID> | Control | <n> | <n> | <n> | <n> | <n> | <n> |

Observed matched differences: <per-task facts, including regressions and ties>

## Behavioral evidence

| Check or failure class | Forge observed/count | Control observed/count | Artifact/action evidence |
| --- | --- | --- | --- |
| <predeclared check> | <fact> | <fact> | <trial pointers> |

## Cost and runtime

| Metric | Forge | Control | Availability |
| --- | --- | --- | --- |
| Median wall-clock latency | <duration or unavailable> | <duration or unavailable> | <available n / valid n by arm> |
| Trial agents started | <sum or unavailable> | <sum or unavailable> | <available n / valid n by arm> |
| Subagents started | <sum or unavailable> | <sum or unavailable> | <available n / valid n by arm> |
| Evaluator agents started | <sum or unavailable> | <sum or unavailable> | <available n / valid n by arm> |
| All agents started | <sum or unavailable> | <sum or unavailable> | <available n / valid n by arm> |
| Execution total tokens | <sum or unavailable> | <sum or unavailable> | <available n / valid n by arm> |
| Evaluator total tokens | <sum or unavailable> | <sum or unavailable> | <available n / valid n by arm> |
| Overall total tokens | <sum or unavailable> | <sum or unavailable> | <available n / valid n by arm> |

Never substitute zero for unavailable telemetry. Do not total a metric across an
arm without stating missing-record coverage.

## Failures and validity

- Task failures: <counts, categories, and trial pointers>
- Runtime failures: <counts, categories, and trial pointers>
- Evaluator failures: <counts, categories, and trial pointers>
- Invalid or contaminated trials: <counts, causes, and handling>
- Match deviations: <model/context/tool differences and interpretation limits>

## Decision and next step

- Supported decision: <adopt | reject | revise | retain current | inconclusive>
- Material limitations: <sample size, corpus, host/model coverage, blinding, telemetry>
- Smallest next evaluation: <specific follow-up or none>

Do not claim statistical significance or generalize beyond the recorded sample.
