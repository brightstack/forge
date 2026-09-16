# Forge behavioral eval plan: <name>

BLUF: <decision this evaluation will inform>

- Plan version: <immutable ID>
- Forge candidate: <revision, digest, or exact file list>
- Candidate label hidden from evaluator: <yes | no; why>
- Host and native-agent capability: <host; fresh agent/workspace/blinding support>
- Primary hypothesis: <observable behavior expected to differ>
- Known failure modes: <predeclared material regressions>

## Tasks and checks

| Task ID | Public task/fixture version | Evaluator-only bundle version | Observable outcome | Why included |
| --- | --- | --- | --- | --- |
| <ID> | <path or digest> | <private path or digest> | <artifact/action> | <risk or contrast> |

The evaluator-only bundle is not mounted in trial workspaces: <method>.

## Matched arms

| Input | Forge arm | Control arm |
| --- | --- | --- |
| Public task and fixture | <identity> | <same identity> |
| System/repository safety | <bundle identity> | <same bundle identity> |
| Non-Forge context | <bundle identity> | <same bundle identity> |
| Forge guidance | <candidate identity and activation> | none |
| Tools and permissions | <profile> | <same profile> |
| Model profile | <host model/snapshot, effort, limits> | <same profile> |

Known arm deviations: <none, or exact difference and interpretation limit>

## Isolation and schedule

- Fresh trial agent: <method or limitation>
- Fresh evaluator: <method or limitation>
- Workspace reset: <method and immutable fixture identity>
- Cross-trial memory prevention: <method or limitation>
- Arm order: <randomized/interleaved order and seed, or reason fixed>
- Concurrency boundary: <separate workspaces or sequential reset>

## Trial and cost budget

- Selected trials per task per arm: <count>
- Smaller option offered: <count/cost/time option and user choice>
- Maximum trial agents: <count>
- Maximum evaluator agents: <count>
- Maximum elapsed time: <duration>
- Maximum spend: <amount or unavailable>
- Stop conditions: <limits and infrastructure-failure threshold>
- Sample claim boundary: descriptive observations only; no statistical-significance claim.

## Outcome rules

- `PASS`: <predeclared threshold>
- `PARTIAL`: <predeclared threshold>
- `FAIL`: <predeclared threshold>
- `INVALID`: <comparison-integrity failures>
- `ERROR`: <runtime/evaluator failures>
