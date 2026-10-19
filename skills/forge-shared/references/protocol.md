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

A question, possibility, analogy, inference, or recommendation is not a decision.
For each normative addition, removal, or stronger guarantee, retain the exact
human source and its scope, or the specifically bounded Auto grant. A generic
go-ahead to a decision brief covers its disclosed material choices, not a buried
commitment in a linked draft. Explicit approval of an exact full revision retains
that revision's stated scope. One answered choice leaves independent choices open.
An edited Spec or favorable Review cannot approve itself. When the human corrects
an authority claim, repair the existing source note and dependent records with
the actual sequence of question, correction, and later answer before relying on
them again.

## Small managed record

Record [Launch choices](workflows.md) in the existing index/log: Workflow, Depth,
Control, boundary, sequence, team, workspace, and pending/satisfied gates. Preserve
the user's acceptance or explicit Auto source and any subsequent changes. Log
ordinary Auto progression as exercised delegated authority over the named revision,
not a human artifact approval; do not fabricate protected decision records. Resume
reuses current choices and actual agent IDs without another Launch ceremony.

Use the selected loop directory returned by `forge init`: new loops default to
home `.forge`, grouped by target repository and loop; root `forge.yml` can choose
another location. Existing explicit `.forge/loops/<loop-id>/` history stays in
place. The selected artifact directory is distinct from the target repository:
source, harness, Git candidate, and canonical Spec/KB writes remain in that target.
A managed loop contains:

- `index.md` from [the index template](../assets/index.md): dated current
  snapshot, accepted sources, outcomes, ownership,
  candidate, evidence gaps, and one next action;
- `decisions.md` from [the decision-log template](../assets/decisions.md):
  protected human decisions with source, actual quote, scope, date,
  authorization, status, and supersession;
- `log.md` from [the loop-log template](../assets/log.md): concise lifecycle
  events and handoffs;
- `spec/`: only earned intent, design, technical, work, Issue, Plan, and change
  records. Do not add Spec files, flags, or config the request did not earn.
  A gate briefing is chat only; do not save it here.
- `build/log.md` from its Build-owned template:
  candidate, Build evidence, independent Review rounds, findings,
  dispositions, repairs, and rethink record;
- `verify/`: actual acceptance evidence and [visual](../assets/visual.md) proof;
- `ship.md` from its Ship-owned template: authorized publication
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

For Quick Build, keep brief Plan notes and current state in the existing Issue,
index, or Build log. Do not create separate Issue, technical-contract, Plan,
decision, or Verify records unless one is independently needed for authority,
handoff, or distinct evidence. Record each fact once and link to it elsewhere;
do not repeat candidate identity, authority, checks, findings, or exclusions
across lifecycle files.

Create documents from the assets linked by the phase references. Managed Markdown
keeps CLI-immutable `id`, readable loop-local `code`, title/type/status metadata, and ordinary
human-readable bodies. Use the CLI to create or validate records; edit bodies with
the host's normal file tools. Never use a generic update to fabricate or overwrite
a human decision.

## Handoff

Give each accountable owner or helper the smallest complete packet:

```text
OUTCOME: bounded result and stopping boundary
WORKFLOW: selected workflow, depth, control, assignment, and applicable staffing triggers
AUTHORITY: accepted sources, decisions, scenarios, project rules, and shared Forge
standards/returns (load their actual files; helper shorthand cannot redefine them)
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

When a defect outside the owned writes prevents assigned proof, return
`BLOCKED_BY_SCOPE` naming the defect, the authority it blocks, the minimal
repair, and why no in-scope route exists. An owner may instead make that repair
itself when it is required to produce assigned proof, is reversible, changes no
accepted meaning, and is reported in the return. Every other write outside the
owned paths is a violation.

This reconciles two rules that otherwise contradict each other: never claim a
check that was not run, and never write outside the grant. An Engineer whose
assigned proof needs a broken test script it does not own, and a Designer whose
template asks for a companion record its assignment did not grant, both use this
route rather than choosing silently between the two rules.

Loop identity is readable Markdown/frontmatter, without a required JSON Issue
registry. Qualify cross-loop references by loop/path. CLI immutability and scanning
do not detect a raw edit against historical registration; retained approval inputs
and canonical guards remain independent. Do not claim historical authentication
from successful structural validation.

Before advancing, apply [return and log inspection](returns.md): read the actual
artifact, compare its selected template/rubric, and inspect the new relevant log
evidence. Missing proof stays incomplete.

Passing local checks do not imply integrated Review or Verify. On resume,
read the index, independently retained accepted baseline and approved change,
their human source, applicable Spec-apply receipt, current canonical files, latest
actual candidate and Build verdict, Verify evidence, and focused decision
links. Treat matching receipt bytes as already applied and diverged bytes as a
gap; never replay writes or promote the mutable working copy into accepted
authority. Load older log entries only for a named unresolved fact. Repair stale
projections from authoritative sources.
