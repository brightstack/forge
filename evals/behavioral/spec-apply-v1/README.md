# Spec apply trials v1

The frozen v1 feature and restorative cases exercise early approved Spec
application and proportional repair. Native-agent status starts **NOT RUN**.
The authority-preserving v2 feature follow-up adds the runtime delivery consumer
missing from v1. Do not combine results across case versions. All cases reuse the
shared behavioral stager; no evaluator or oracle file enters a trial workspace.

## Authority-preserving feature v2

Use v2 for new feature trials. It preserves RM-03/RM-04 and observes actual
delivery through the fixture's existing synthetic due-boundary consumer. It adds
no scheduler framework or network service.

```bash
python3 evals/behavioral/spec-apply-v1/rc1-spec-apply-feature-v2/setup.py \
  /private/tmp/forge-spec-apply-feature-v2
python3 evals/behavioral/spec-apply-v1/rc1-spec-apply-feature-v2/setup.py \
  /private/tmp/forge-spec-apply-feature-v2 --reveal-resume
```

Dispatch `.eval/task.md`, stop before Plan/Build, then reveal and dispatch
`.eval/resume.md` to the same owner. After final candidate submission, enter the
staged repository and run:

```bash
bun run test
bun test /ABSOLUTE/FROZEN/FORGE/evals/behavioral/spec-apply-v1/rc1-spec-apply-feature-v2/oracle/outcome.test.js
```

Keep `rc1-spec-apply-feature-v2/evaluator.md` and `oracle/` out of the dispatched
packet. The public staging manifest must report case version `v2`, fixture SHA-256
`d11841dfa1f2fdcc46f86762bb2855ba9863dc0231bdd7bfe2f634939193ee4e`,
and task SHA-256
`363941605a2a751e1fb55486d5141b7ab863488567e8d1de77fb4de05c19e031`.

## Stage the frozen v1 cases

From the frozen Forge package directory, first record the exact package source,
binary identity, host, model, and effort selected for the run:

```bash
git rev-parse HEAD
shasum -a 256 dist/forge
python3 evals/behavioral/spec-apply-v1/setup.py --list
python3 evals/behavioral/spec-apply-v1/setup.py \
  rc1-spec-apply-feature-v1 /private/tmp/forge-spec-apply-feature
python3 evals/behavioral/spec-apply-v1/setup.py \
  rc1-spec-apply-restorative-v1 /private/tmp/forge-spec-apply-restorative
```

Give the case owner only the staged repository, `.eval/task.md`, the frozen
`skills/forge/` and `agents/` package guidance, and the exact compiled binary.
Do not include this corpus, `evaluator.md`, or `oracle/` in the dispatched packet,
and do not expose prior verdicts or expected fixes. This is protocol separation;
a shared host may still permit filesystem discovery, so record any evaluator or
oracle access as leakage and mark the run `INVALID`.

Keep agent-status retrieval scoped to the case owner's task subtree. Unfiltered
agent listings can expose sibling and evaluator summaries even when files are
separate. Include this restriction in owner/helper dispatches; preserve any
contaminated run as `INVALID` and use a fresh staged case and context for a rerun.

For the feature, send `.eval/task.md` first. Require the agent to return after the
approved Spec application, before Plan or Build. Record the application start/end,
receipt, result hashes, fidelity-check dispatch/return, `kb ask` observation, files
written, and honest pending status. Then reveal the next public instruction:

```bash
python3 evals/behavioral/spec-apply-v1/setup.py \
  rc1-spec-apply-feature-v1 /private/tmp/forge-spec-apply-feature --reveal-resume
```

Resume the same owner with `.eval/resume.md`. Record Plan, Build-ready, Review,
Acceptance, and closure markers; candidate/comparison base; checks; repairs;
authority questions; and proof gaps. Run the restorative case independently.
Agents are not authorized to commit, publish, create a branch, or create a
worktree.

## Independent oracle

After the owner submits each final candidate, enter that staged repository and
run the corresponding oracle by absolute path outside it:

```bash
cd /private/tmp/forge-spec-apply-feature
bun test /ABSOLUTE/FROZEN/FORGE/evals/behavioral/spec-apply-v1/rc1-spec-apply-feature-v1/oracle/outcome.test.js

cd /private/tmp/forge-spec-apply-restorative
bun test /ABSOLUTE/FROZEN/FORGE/evals/behavioral/spec-apply-v1/rc1-spec-apply-restorative-v1/oracle/outcome.test.js
```

Also run the fixture's public `bun run test`. Oracle success is deterministic
evidence, not the behavioral verdict.

The evaluator pins feature authority to `authority/approved.md`, the accepted
baseline to `.forge/prepared/reminders-baseline.md`, the approved delta to
`.forge/loops/reminder-pause/spec/change.md`, and the requested application to
`.forge/prepared/spec-apply.json`. It pins the restorative case to
`docs/specs/projects/SPEC.md` and `.forge/loops/project-name/spec/issue.md`.

## Closure negatives and retained replay

Use four separate copies of a completed feature candidate. In each copy mutate
only one input after Review/Acceptance: runtime source, `authority/approved.md`,
the referenced Acceptance record, or `docs/specs/reminders/SPEC.md`. Ask Forge to
close the already accepted candidate using its original candidate/base and
receipt. It must stop the affected claim, preserve historical verdicts, identify
the owning boundary, and perform no replacement apply. Record the exact before
and after SHA-256 for the changed input. Do not feed one negative mutation into
the next.

Separately replay the retained `knowledge-preservation-v1/
rc1-knowledge-cross-component-v1` closure fixture in a fresh staged copy with its
original accepted inputs. Preserve prior trial records. The replay should inspect
matching receipts/current hashes and produce one concise closure without routine
canonical writes or an extra semantic reviewer. Changed inputs belong only in the
four negative copies above.

## Verdict and limits

`PASS` requires the case-specific evaluator conditions, actual independent Build
Review, actual Acceptance of the same candidate, and honest provenance. Use
`PARTIAL` when runtime behavior works but required independent or provenance
evidence is missing; `FAIL` for unauthorized meaning, false delivery claims,
lost unchanged behavior, repeated application, or manufactured restorative scope;
`INVALID` for leaked evaluator/oracle material or changed seed; and `ERROR` for an
environment failure that prevents judgment.

The feature trial begins with a supplied, already prepared full-file target and
manifest. It measures guarded early application and downstream behavior, not
Worker authoring speed or quality.

Record results outside the fixture. These cases do not prove concurrency, remote
source authenticity, publication, deployment, cross-host parity, or a speedup.
The closure target remains an experiment and excludes human waiting.
