---
name: forge-eval
description: "Run a guided native-host acceptance demonstration or a controlled matched-arm behavioral evaluation of a frozen Forge candidate. Use when the user asks to validate, evaluate, regression-test, benchmark, or compare Forge behavior. Do not use for ordinary Forge delivery, deterministic CLI tests, or a one-candidate code review."
---

# Forge Eval

<route>
Choose one mode from the request and accepted evaluation authority.

- **Guided acceptance:** prove a frozen Forge candidate on staged behavioral cases
  with fresh native agents and direct artifact/runtime evidence. This is the
  default for RC acceptance, demos, and behavioral regression checks that do not
  request a control. It makes no causal lift or statistical claim.
- **Controlled comparison:** compare matched Forge and no-Forge-guidance arms.
  Use only when the user asks for a benchmark, comparison, lift measurement, or
  control arm, or when an accepted eval plan already requires both arms.

Do not add a control arm or trial-budget question to an already-authorized guided
acceptance run. A loaded skill does not broaden the authorized agent budget.
</route>

<guided_acceptance>
Read the [native trial protocol](references/rc1-native-protocol.md).

1. Freeze the candidate and selected case version. Record host/model/tool limits
   and the already-authorized trial boundary.
2. Stage a new disposable workspace with the corpus setup script. Confirm the
   seed oracle and `NOT RUN` manifest without treating either as outcome proof.
3. Dispatch a fresh native treatment agent with the public task and frozen Forge
   entry. Keep evaluator checks with the host Coordinator.
4. Capture actual native actions, artifacts, candidate/base, commands, runtime or
   browser behavior, visual evidence when applicable, and unavailable evidence.
5. Run the candidate oracle, then judge the case's semantic checks. Use
   `PASS | PARTIAL | FAIL | INVALID | ERROR` only for the exact candidate/case.
6. Write an [RC1 evidence record](assets/rc1-evidence.md). Leave every unexecuted
   check `NOT RUN` and state the guided, single-candidate claim boundary.
</guided_acceptance>

<controlled_comparison>
Read and follow [procedure.md](references/procedure.md).

1. Freeze the candidate, public tasks, evaluator-only checks, context policy,
   matched model profile, trial count, and stop conditions in an
   [eval plan](assets/eval-plan.md).
2. If accepted authority does not set the live-agent budget, offer a smaller
   trial-count or cost option before a material run. Prefer multiple trials per
   arm when allowed; label a one-per-arm run a pilot.
3. Run matched Forge and no-Forge-guidance trials with fresh agents and isolated
   workspaces. Record every matching or isolation deviation.
4. Judge direct artifacts/actions against withheld checks. Do not score agent
   self-claims.
5. Write one [trial record](assets/trial.md) per run and synthesize an
   [eval report](assets/report.md). Report descriptive counts and unavailable
   telemetry; never imply statistical significance from a small sample.
</controlled_comparison>

<boundaries>
- Use native host controls; do not add a provider SDK, persistent coordinator,
  generated-prompt store, or workflow runtime.
- Freeze task and evaluator bundles before scored execution. If either changes,
  invalidate affected trials and version the case.
- Keep evaluator authority out of the public task. Do not test prompt wording,
  headings, or required phrases.
- Do not mutate the frozen Forge candidate during a run.
- Historical examples and old eval output do not prove a new candidate.
- Stop at the authorized agent, time, cost, or recurrence limit and report partial
  evidence honestly.
</boundaries>

<checklist>
- One explicit mode selected; guided runs do not silently become benchmarks
- Frozen candidate, task/case, workspace, host profile, and stop boundary recorded
- Fresh native agent and disposable workspace used or exact limitation disclosed
- Deterministic mechanics separated from semantic and runtime/browser evidence
- Future human resume input withheld until the authorized resume step
- Every verdict cites actual artifacts/actions for the exact candidate
- Unavailable telemetry and unrun proof never represented as zero or PASS
- Output uses the template for the selected mode
</checklist>
