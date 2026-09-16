# Forge Behavioral Evaluation Procedure

Use this procedure to compare a frozen Forge candidate with an otherwise matched
control that receives no Forge-specific guidance. Optimize for a credible causal
comparison and inspectable evidence, not a large-looking score.

## 1. Frame the decision and budget

Name the decision the evaluation will inform: adopt a candidate, diagnose a
regression, compare revisions, or calibrate cost. Record the primary behavioral
hypothesis and the material failure modes before seeing trial results.

When accepted authority does not already set a budget, offer the user a
cost-aware choice. A useful default is three trials per arm per task when the
expected spend is acceptable. A one-trial-per-arm pilot is valid when the user
chooses the cheaper route, but label it a pilot. Larger counts may improve
confidence; no fixed count establishes statistical significance.

Set hard stop conditions for trials, agents, elapsed time, and spend when the
host exposes cost. A stop condition limits the evaluation; it does not change
the task, rubric, or passing bar.

## 2. Freeze comparable inputs

Create the eval plan before running either arm. Freeze and identify:

- the Forge candidate by immutable revision, digest, or exact file list;
- public task text and fixture/candidate identity;
- evaluator-only checks and their authority;
- permitted tools, side effects, time limits, and agent limits;
- host, model name or snapshot, effort/reasoning profile, and runtime limits;
- the non-Forge context bundle shared by both arms;
- the Forge-only context added to the treatment arm; and
- the isolation method, arm order, trial count, and budget.

Use the same model profile and capabilities in matched arms unless the evaluation
explicitly studies a model-profile interaction. Record every deviation instead
of silently treating unmatched trials as comparable.

## 3. Author tasks and evaluator-only checks

Prefer realistic, bounded tasks whose success leaves observable artifacts or
actions. Include both tasks where Forge should improve coordination or proof and
small tasks where excess ceremony is a plausible regression. Avoid tasks that
tell the agent which Forge behavior the evaluator wants to see.

For each task, keep two separate bundles:

1. **Trial bundle:** the public request, fixture, permitted context, and normal
   repository/system safety instructions.
2. **Evaluator bundle:** acceptance authority, deterministic checks, behavioral
   checks, known traps, and scoring rules.

Do not mount or disclose the evaluator bundle in the trial workspace. A hidden
filename in a readable repository is not hidden. Prefer deterministic checks for
functional truth, then use evaluator judgment for actions and artifact meaning
that code cannot decide. Checks must target outcomes such as correct files,
commands, delegation boundaries, authority preservation, evidence quality, and
unnecessary cost. They must not search for required prose or prompt phrases.

Freeze the task and evaluator bundles before the first scored trial. If a task or
rubric defect requires a change, invalidate affected trials and start a new
version; do not repair the benchmark between arms.

## 4. Construct treatment and control

Both arms receive identical public tasks, fixtures, tools, model profiles,
non-Forge context, and safety/permission instructions.

- **Forge arm:** add only the frozen Forge candidate and the minimum invocation
  needed to activate it.
- **Control arm:** add no Forge skill, Forge workflow reference, Forge role
  contract, Forge example, or summary of Forge procedure. Repository and system
  safety constraints still apply in full.

If required repository instructions themselves include Forge procedure, build a
shared neutral context bundle that preserves their safety and product constraints
without carrying Forge-specific routing. Record exactly what was retained and
excluded. Do not weaken permissions or safety to make the control cleaner.

Use distinct workspaces or reset them to the same immutable fixture before every
trial. A control contaminated by prior Forge context is invalid, not a weak
control.

## 5. Schedule fresh trials

Use a fresh native trial agent for every run when the host supports it. A fresh
trial has no prior arm transcript, evaluator rubric, result summary, workspace
mutation, or hidden memory from another trial. Use a separate fresh evaluator
agent when semantic judgment is needed.

Interleave or randomize arm order within each task when practical so time-varying
host conditions do not always favor one arm. Never run the two arms concurrently
against the same writable workspace. Preserve matched task/model pairs in the
records.

If the host cannot provide fresh agents, isolated conversations, separate
workspaces, blind evaluation, token counts, or another planned capability, use
the closest safe native option and record the limitation. Do not build a new
runtime layer to imitate a missing host feature.

## 6. Capture direct evidence

For every trial, preserve or point to:

- final artifacts and exact candidate/workspace identity;
- action or tool log when the host exposes it;
- deterministic check commands and outputs;
- evaluator verdict and check-level evidence;
- model profile and context-isolation facts;
- outcome, failures, and stop reason;
- elapsed wall-clock latency;
- trial-agent and subagent counts; and
- input, output, cached, reasoning, and total tokens when reported by the host.

Record each telemetry field with a source and availability. Use a numeric zero
only when the source explicitly reports zero. Otherwise write `unavailable` and
explain why. Keep execution failures, evaluator failures, invalid/contaminated
trials, and task failures distinct.

The trial agent's narrative is evidence only for what it communicates, not proof
that an action occurred or a requirement passed.

## 7. Evaluate blind when possible

Give the evaluator the frozen evaluator bundle, direct artifacts, and normalized
action evidence. Withhold arm identity, candidate label, and irrelevant model
branding when the host permits it. Run deterministic checks before semantic
judgment and preserve their raw results.

Use the task's predefined outcome vocabulary. At minimum distinguish:

- `PASS`: all material checks pass;
- `PARTIAL`: usable result with one or more predefined material checks unmet;
- `FAIL`: the task or material behavioral contract fails;
- `INVALID`: comparison integrity failed, such as context contamination; and
- `ERROR`: infrastructure or evaluator failure prevented a verdict.

An invalid or error trial is not a task failure and must not be converted into a
pass-rate zero.

## 8. Report descriptive results

Compare matched arms by task and in aggregate. Report raw counts before rates,
show trial-level exceptions, and separate task quality from cost and runtime
reliability. Useful summaries include pass/partial/fail counts, material-check
coverage, failure categories, median latency, agent counts, and available token
totals. State how many telemetry values were unavailable.

Describe observed differences as observations from this candidate, corpus,
model profile, host, and sample. Do not claim statistical significance,
generalize to untested hosts or models, or hide regressions behind an aggregate.
End with the decision supported by the evidence, material limitations, and the
smallest next evaluation if uncertainty remains.
