# Authority, records, and handoffs

## Authority

The current human instruction and recorded human decisions own intent. Accepted
standing specifications plus an approved change own durable behavior. Project
harness rules and accepted technical/design decisions govern execution. Plans
organize delivery; source, tests, findings, logs, and descriptive knowledge are
evidence rather than authority.

Do not repair a mismatch by rewriting the specification to match current code.
Do not turn an agent proposal, discovered source behavior, prototype, review
finding, or synthetic-user reaction into a requirement. If accepted sources
conflict or changed meaning is needed, state the conflict, consequences, options,
and recommendation for the human.

## Small managed record

Record [Launch choices](workflows.md) in the existing index/log: Workflow, Depth,
Control, boundary, sequence, team, workspace, and pending/satisfied gates. Preserve
the user's acceptance or explicit Auto source and any subsequent changes. Log
ordinary Auto progression as exercised delegated authority over the named revision,
not a human artifact approval; do not fabricate protected decision records. Resume
reuses current choices and actual agent IDs without another Launch ceremony.

Use `.forge/loops/<loop-id>/` for a managed delivery loop:

- `index.md` from [the index template](../assets/index.md): dated current
  snapshot, accepted sources, outcomes, ownership,
  candidate, evidence gaps, and one next action;
- `decisions.md` from [the decision-log template](../assets/decisions.md):
  protected human decisions with source, actual quote, scope, date,
  authorization, status, and supersession;
- `log.md` from [the loop-log template](../assets/log.md): concise lifecycle
  events and handoffs;
- `spec/`: only earned intent, design, technical, work, Issue, Plan, and change
  records;
- `build/log.md` from [the Build-log template](../assets/build-log.md):
  candidate, Build evidence, independent Review rounds, findings,
  dispositions, repairs, and rethink record;
- `verify/`: actual [acceptance](../assets/acceptance.md) and
  [visual](../assets/visual.md) proof;
- `ship.md` from [the Ship template](../assets/ship.md): authorized publication
  and concise complete-candidate closure.

`forge init` marks these container/index/log records active so they can carry
current state. That status says only that the record is in use; it does not accept
Spec meaning, prove a candidate, or authorize a phase. Fill the initialized
outcome, authority pointers, candidate, gaps, and next action immediately. Authored
Spec, Issue, Plan, change, and evidence documents remain draft until the relevant
human or phase boundary accepts them. Under Auto, distinguish delegated acceptance
from explicit human approval and retain the grant; protected memory still follows
its exact authorization mechanics.

File presence does not create work. Leave unused decision and Build records empty;
their detailed templates apply when those operations are actually requested.
Reference an existing approved ticket as authority rather than re-recording its
approval as a new decision. Only a new human decision warrants a decision entry.
Logs and pointers describe successful observed operations; a failed command must
not be followed by an unconditional success claim.

Create documents from the assets linked by the phase references. Managed Markdown
keeps immutable `id`, readable `code`, title/type/status metadata, and ordinary
human-readable bodies. Use the CLI to create or validate records; edit bodies with
the host's normal file tools. Never use a generic update to fabricate or overwrite
a human decision.

## Handoff

Give each accountable owner or helper the smallest complete packet:

```text
OUTCOME: bounded result and stopping boundary
WORKFLOW: selected workflow, depth, control, assignment, and applicable staffing triggers
AUTHORITY: accepted sources, decisions, scenarios, and project rules
CANDIDATE: exact candidate/base or not applicable
SEAMS: affected behavior, shared ownership, and integration obligations
IMPACT: signals -> affected obligations -> selected checks -> gaps, when existing
behavior can be affected
SOURCES: verified repository or external anchors
WRITES: owned paths or read-only
PROOF: runnable setup, checks, and expected observations
GAPS: unavailable evidence and unresolved facts
RETURN: changed behavior/artifact, candidate, evidence, integration concerns, gaps
```

Passing local checks do not imply integrated Review or Acceptance. On resume,
read the index, independently retained accepted baseline and approved change,
their human source, applicable Spec-apply receipt, current canonical files, latest
actual candidate and Build verdict, Acceptance evidence, and focused decision
links. Treat matching receipt bytes as already applied and diverged bytes as a
gap; never replay writes or promote the mutable working copy into accepted
authority. Load older log entries only for a named unresolved fact. Repair stale
projections from authoritative sources.
