# Forge behavioral eval corpus

Behavioral evals compare a frozen Forge candidate with a matched control that has
no Forge-specific guidance. Run them manually or through a purpose-built matched
trial harness; they are live-agent evidence, not an every-change test gate.

## Reusable public authority

Frozen Specs under [specs/](specs/) are public inputs that multiple evaluations
can reuse. Copy the selected Spec into each isolated trial workspace and name it
in `task.md`. Do not point a trial at a historical delivery artifact.

- [Simple Todo v1](specs/simple-todo-v1.md) defines only add, complete or reopen,
  and delete behavior.

Keep evaluator-only traps and scoring rules out of these Specs. Change accepted
behavior by adding a new version instead of editing a Spec used by scored trials.

Artifact-format regressions stay in deterministic Forge tests. Behavioral trials
may still observe their consequences: a small Work route should omit unearned
ceremony, a Plan should preserve an explicit human Key Task without expanding it
into an exhaustive file checklist, and Issue labels presented to later agents
should remain exactly the labels the Plan accepted.

## Case contract

Store each case in its own directory:

```text
<case-id>/
├── task.md                 # public request given to both arms
├── evaluator.md            # evaluator-only authority, checks, and outcome rules
└── fixture/                # optional immutable task workspace
```

`task.md` contains only the user-visible request, available inputs, allowed side
effects, and completion boundary. It must not hint at Forge-specific behaviors or
the evaluator's traps.

`evaluator.md` defines task authority, deterministic commands, observable
artifact/action checks, materiality, and `PASS | PARTIAL | FAIL | INVALID | ERROR`
rules. Checks evaluate meaning and behavior, never exact prompt, skill, heading,
or phrase wording.

The harness stages `task.md` and `fixture/` into an isolated trial workspace. It
does not mount `evaluator.md` or this corpus directory. Merely giving the file a
private-sounding name while leaving it readable by the trial agent is not hidden.

## Corpus selection

Use a small, risk-shaped set rather than many near-duplicates:

- work where role ownership, independent verification, or authority preservation
  should materially help;
- work where native-agent routing and context isolation are observable;
- a small direct task where unnecessary Forge ceremony can regress cost or
  latency; and
- known failure shapes from real Forge changes, kept separate from synthetic
  traps.

Freeze case versions before scored trials. If a task, fixture, or evaluator rule
changes, give the case a new version and do not combine its results with the old
version without an explicit caveat.

## Records

Keep plans, per-trial records, reports, raw action logs, and generated artifacts
outside this canonical corpus, in an evaluation-specific workspace.

Do not write behavioral runs into Forge delivery artifacts. Evaluation records
describe experiments; they are not lifecycle authority or Ship evidence.

## RC1 staged acceptance cases

| Case | Primary behavior | Initial deterministic state |
| --- | --- | --- |
| `rc1-project-ui-v1` | Integrated Todo delivery and actual visual/browser acceptance | Isolated model/view checks PASS; composed browser boot broken; acceptance NOT RUN |
| `rc1-small-issue-v1` | Bounded accessible-label Issue | Lifecycle check PASS; task-specific output check fails |
| `rc1-bug-hypothesis-v1` | Original reproduction disproves a supplied diagnosis | Later-ID check PASS; task-0 reproduction fails |
| `rc1-lifecycle-approval-v1` | Full delivery stops for Spec approval, then Plan approval, before Build | Standing authority validates; behavioral steps NOT RUN |
| `rc1-spec-stop-resume-v1` | Consequential Spec choice, stop, and authorized resume | Standing authority validates; behavioral steps NOT RUN |
| `rc1-bounded-work-v1` | Small non-software data-quality memo | Evaluator oracle reports input truth; memo NOT RUN |
| `rc1-memory-reconcile-v1` | Conflict, supersession, provenance, and preservation | Canonical identities validate; reconciliation NOT RUN |
| `rc1-review-repair-v1` | P0/P1/nit triage and whole-outcome repair/rethink | Model check PASS; integrated outcome fails |
| `rc1-design-study-v1` | Codebase-grounded single-page visual proposal, rendered states, and Design stop | Static fixture; native outcomes NOT RUN until observed |

List and stage cases from the Forge package directory:

```bash
python3 evals/behavioral/setup_case.py --list
python3 evals/behavioral/setup_case.py \
  rc1-bug-hypothesis-v1 /tmp/forge-rc1-bug
python3 evals/behavioral/oracle.py \
  rc1-bug-hypothesis-v1 /tmp/forge-rc1-bug --mode seed
```

Read the [RC1 native protocol](../../skills/forge-eval/references/rc1-native-protocol.md)
before dispatch. These cases begin `NOT RUN`. A seed check, old example, historical
eval, or written agent claim never changes that behavioral status.

## Focused extension corpora

[Workflow and Launch trials v1](workflow-launch-v1.md) reuses the lifecycle and
small-Issue fixtures for Guided Launch → PM Spec → consequential Plan gates and
Auto Quick Issue Build with Reviewer. It also defines a bounded complex-Issue
launch probe. The original `rc1-lifecycle-approval-v1` remains frozen with its
historical no-Launch first-turn expectation; do not apply that evaluator to the
new Launch variation. Behavioral results start `NOT RUN`.

[Spec apply trials v1](spec-apply-v1/README.md) adds a two-step feature that applies
approved target meaning during Spec and resumes before Build, plus a restorative
bug probe that should create no semantic delta. It also defines evaluator-only
closure freshness mutations and reuses the retained cross-component case for
closure replay. These trials begin `NOT RUN` and use the same stager and hidden
oracle boundary.

[Review skills comparative evaluation v1](review-skills-v1/README.md) provides
four frozen code-review candidates with repaired/clean controls and seven bounded
routing probes for matched current-versus-bundled Review trials. Native outcomes
begin `NOT RUN`; deterministic checks prove only fixture sensitivity and packet
isolation.
