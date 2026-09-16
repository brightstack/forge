# RC1 native behavioral trial protocol

Use this protocol from the Forge package directory for the staged RC1 cases under
`evals/behavioral/`. Candidate paths below refer to that package directory, whether
it lives in a monorepo or its own repository.
The default RC1 acceptance run is a guided native-host demonstration of one frozen
Forge candidate. It is not a matched benchmark and makes no causal comparison to
a control. Use the full comparative procedure only when the eval plan explicitly
includes both arms and adequate isolation.

## Freeze and stage

Record the candidate revision or exact candidate file digest before dispatch.
Choose a new destination that does not exist, then stage one case from the
Forge package directory:

```bash
python3 evals/behavioral/setup_case.py \
  rc1-project-ui-v1 /tmp/forge-rc1-project-ui
python3 evals/behavioral/oracle.py \
  rc1-project-ui-v1 /tmp/forge-rc1-project-ui --mode seed
```

`setup_case.py` copies the immutable fixture and public `task.md` into
the trial workspace, initializes a baseline commit, and writes a public manifest
whose behavioral status is `NOT RUN`. It never copies `evaluator.md` or `oracle/`.
The command refuses to reuse an existing destination; use a distinct path per
trial rather than resetting a prior candidate.

Keep the evaluator bundle with the host Coordinator. Filesystem-level evaluator
blindness is optional for a guided acceptance demonstration and must not be
claimed unless the host actually enforces it. A comparative benchmark still
requires the isolation in `procedure.md`.

## Dispatch a fresh native agent

Create a fresh native agent or conversation with the staged workspace as its
working directory. Pass the pointer envelope from `assets/rc1-trial-packet.md`;
do not paste the evaluator checks into the prompt.

- **Codex:** use a no-history child agent when available, set its working directory
  to the staged workspace, provide the frozen Forge skill path in the treatment
  envelope, and wait on that exact agent to finish or request input.
- **Claude Code:** use a new Task/Agent with isolated context and the staged
  workspace. Keep its agent ID for the resume step and wait for terminal state.
- **Cursor:** use a new Agent session/worktree rooted at the staged workspace.
  Keep the session identity for the resume step and wait for terminal state.

The treatment agent reads the frozen candidate's `skills/forge/SKILL.md`
and follows its native-agent routing. Do not invent a semantic `forge` CLI command;
the executable supplies only mechanics documented by the frozen candidate. For a
separately authorized control arm, omit all Forge paths and guidance while keeping
the public task, workspace, model profile, tools, and safety context matched.

The lifecycle-approval, Spec-stop, and memory cases have two steps. First give only
`.eval/task.md` and allow the agent to stop at its human-owned boundary. Inspect
and record the intermediate candidate. Then reveal the accepted human response and
send it to the same trial agent:

```bash
python3 evals/behavioral/setup_case.py --reveal-resume \
  rc1-spec-stop-resume-v1 /tmp/forge-rc1-spec-stop
```

For `rc1-lifecycle-approval-v1`, the first turn must stop on the presented Spec.
Its resume approves only that Spec, so the second turn must stop on the newly
presented Plan before Build. Do not reveal or imply approval of either unseen
artifact in the preceding prompt.

That frozen v1 targets the historical no-Launch start. For the new default Guided
Launch and explicit Auto contract, use the separately recorded
[workflow/Launch variations](../../../evals/behavioral/workflow-launch-v1.md).
The Guided variation adds Launch acceptance before the existing Spec resume;
never reveal either future response in the preceding turn. Do not score the new
Launch stop as the old case's missing-Spec failure or silently revise frozen v1.

The initial staging deliberately omits `resume.md`, preventing the first step from
seeing future authority. A different agent for the second step would test a
handoff, not conversational resume, and must be recorded as a deviation.

## Observe actions and candidate behavior

Preserve the native action/tool log when exposed. Record actual agent IDs, roles,
delegated outcomes, write ownership, waits, Review/Verify independence, and exact
candidate/base. Claims such as “reviewed” or “tested” do not prove the action.

Run the case oracle after the candidate stabilizes:

```bash
python3 evals/behavioral/oracle.py \
  rc1-project-ui-v1 /tmp/forge-rc1-project-ui --mode candidate
```

Then apply the case's semantic evaluator checks. For the project UI case, serve
the staged static directory on an available localhost port and use the host's
actual browser controls. Exercise add, complete, reopen, and delete. Inspect and
capture the specified desktop and mobile states against
`authority/accepted-design.svg`; source inspection and green tests are insufficient.

For a repair, return the actual failing check and complete accepted outcome to the
Builder. Judge the next integrated candidate against the full outcome. Admit
aligned P0 and pragmatic P1 findings; record an unauthoritative preference as a
nit that does not extend the loop. At the stated recurrence ceiling, capture the
causal rethink or finite stop instead of prompting another point patch.

## Record evidence honestly

Start from `assets/rc1-evidence.md`. Set every scenario and behavioral check to
`NOT RUN` before dispatch. Change a row only when the cited artifact, command,
browser action, screenshot, or native action log exists for the exact candidate.
Old Forge examples, earlier eval output, a seed oracle PASS, and the trial agent's
narrative never establish RC1 behavioral PASS.

Report unsupported telemetry as `unavailable`. A guided demonstration may support
RC1 acceptance evidence for that candidate, host, and case; it does not measure
Forge lift, establish statistical significance, or generalize to other hosts.
