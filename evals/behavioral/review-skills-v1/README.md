# Review skills comparative evaluation v1

This frozen corpus compares the current Forge Review package with the proposed
bundled review package on the same small candidates. It measures whether a
reviewer finds demonstrated defects and respects review routing. It does not
claim statistical superiority, Acceptance, or native-agent PASS.

The four code cases are deliberately inspectable:

| Case | Candidate condition | Public proof | Hidden control |
| --- | --- | --- | --- |
| `review-public-input-v1` | Opaque event IDs collapse after numeric coercion | Green golden tests plus representative alphanumeric events | Oracle exercises the public non-golden input; repaired control preserves opaque IDs |
| `review-standard-boundary-v1` | A public JSON boundary bypasses the repository-mandated exact-key validator | Green happy-path tests and a failing `bun run standards` check named by `AGENTS.md` | Oracle sends an unknown field; repaired control restores validation |
| `review-spec-preservation-v1` | Retry attempts silently receive different idempotency keys | Green first-attempt tests plus accepted Spec and decision | Oracle forces a retry; repaired control preserves one key |
| `review-clean-equivalent-v1` | The implementation is semantically equivalent | Public tests and complete diff | Broad oracle verifies equivalence; the candidate itself is the clean control |

`task.md`, the staged repository, and one assigned runtime package form the
entire reviewer packet. `evaluator.md`, `oracle/`, alternate variants, this
README, and all trial results stay coordinator-only. A reviewer that reads those
materials makes the run `INVALID`.

## Fair matched protocol

Freeze this directory before trials. Run every old/new pair with the same case,
candidate variant, public task, baseline commit, path scope, model, reasoning
effort, time/tool budget, host, and coordinator wording. The only treatment is
the assigned runtime package. Randomize arm order within each pair. Use fresh
workspaces and fresh reviewer context; do not send one arm the other arm's output.

Stage from `apps/forge`:

```bash
python3 evals/behavioral/review-skills-v1/setup.py --list
python3 evals/behavioral/review-skills-v1/setup.py \
  review-public-input-v1 /tmp/review-old-public \
  --runtime-package /ABSOLUTE/OLD/PACKAGE --runtime-label old
python3 evals/behavioral/review-skills-v1/setup.py \
  review-public-input-v1 /tmp/review-new-public \
  --runtime-package /ABSOLUTE/NEW/PACKAGE --runtime-label new
```

The stager creates a stable fixture-only baseline commit and then applies the
candidate as an uncommitted diff. It copies the assigned package under
`.eval/runtime/` after excluding `.eval/` from Git. The manifest records source,
task, base-tree, candidate-tree, diff, and runtime hashes. Give the reviewer this
single instruction, with the same model and effort in both arms:

> Read `.eval/task.md` and use only the assigned package under `.eval/runtime/`.
> Review the exact `HEAD` to working-tree candidate within the task's scope.
> Do not edit files. Return the requested evidence-backed review report.

After the report is final, the coordinator runs the case's oracle from the frozen
corpus, with the staged workspace as its current directory:

```bash
bun test /ABSOLUTE/FROZEN/CORPUS/cases/review-public-input-v1/oracle/outcome.test.js
```

Run a repaired or clean control with `--variant control`. Do not show a reviewer
both variants. `validate.py` stages disposable seed/control copies and verifies
hashes, public checks, candidate sensitivity, controls, and evaluator isolation.

```bash
python3 evals/behavioral/review-skills-v1/validate.py
```

## Scoring

Score reports only after both paired runs finish. Each negative code case has one
required finding worth four points: one for naming the violated authority, one
for a reachable causal trace, one for direct evidence or the decisive check, and
one for proportional severity/remedy. The clean case earns four points for a
clean verdict with no unsupported finding. Deduct one point per unsupported
material finding and one-half point per speculative edge case, personal-style
preference, or unrelated pre-existing debt presented as actionable. Floor each
case at zero.

Do not require exact words, a particular command, or an arbitrary number of
findings. `evaluator.md` names accepted equivalents and allowed nonfindings. A
finding may be omitted only when that evaluator lists it as allowed. Compare
paired totals and report raw findings, evidence, false positives, runtime, model,
effort, tool use, and gaps; four cases are directional evidence, not a population
estimate.

## Routing exercises

The seven routing cases cover backend, UI, knowledge work, standalone code
review, harness replacement, explicit disable, and a missing replacement. They
have public scenario packets and coordinator-only evaluator truth. Stage them
with the same command and `--variant candidate`; they do not use hidden runtime
oracles. Score one point for the correct selected dimensions/source and one for
honest boundary/report semantics. A UI defect claim requires actual rendered
evidence; merely selecting Design earns routing credit but cannot prove a visual
finding.

All routing and native review outcomes begin `NOT RUN`. Deterministic validation
only proves that the public packet is isolated and version-frozen.
