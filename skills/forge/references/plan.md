# Plan

Plan translates accepted intent into the smallest useful implementation approach.
It never creates product requirements and always remains an explicit accounted
phase, even when its result is one concise note.

For direct Plan, this procedure is the entrypoint; full-lifecycle setup is not a
prerequisite. Apply or reuse [Launch, depth, and workflow assignments](workflows.md)
only for this requested boundary. Plan can live as Issue notes or under `spec/`;
it need not be a separate document. Read the accepted Spec or ticket, applicable standing obligations,
relevant human decisions, current implementation, and target repository harness.
Accepted intent owns the outcome; code, plans and logs cannot invent requirements.
Return consequential conflicts to the human before dependent work. Reuse an
imported Issue rather than recreating it.

The Engineer owns technical strategy, decomposition and constraints. Product
Manager owns product scope and observable outcome criteria when those need
authoring; technical tasks stay with Engineer. Use the host's mapped professional
teammates when available, with Forge's judgment guidance for their assignment.
A precise engineering Plan over a ready Issue needs no new PM pass. For an Issue
request without a ready Issue or issue-like object, PM prepares and assesses it
with Engineer input under the shared workflow rules, at either depth. Product
authorship does not add another Product approval gate.

For a small Issue, record the proposed route, existing machinery to reuse, proof,
and material risk. Do not create sub-Issues unless they improve ownership,
coordination, or reviewability. For a project, use [plan.md](../assets/plan.md) only
when additional coordination is useful and create meaningful outcome Issues from
[issue.md](../assets/issue.md). Keep Issue criteria observable and map behavioral
obligations to scenario IDs; never use “implement component X” as acceptance.

## Save the Plan at the requested depth

A concise Plan still uses managed identity and validation. Reuse an existing
identified Issue's implementation notes when that is the best home; otherwise
create `spec/plan.md` in the current loop, even when its body is one paragraph.
A plain Markdown file or a hand-written `.forge` path does not satisfy this
contract. Resume an existing loop when it fits. Otherwise initialize its records
with the installed CLI. Keep its current state accurate without inventing
completed phases. Read [protocol](protocol.md) for additional authority or handoff
details when needed, not to populate every possible lifecycle record.

Use the installed CLI to scaffold the record, then edit its body with normal file
tools, preserving the generated frontmatter and a descriptive `#` title. For a
new loop and Plan, the commands are:

```text
forge init <loop> --repo <repo> --title <title>
forge docs create plan .forge/loops/<loop>/spec/plan.md --repo <repo> --title <title>
forge docs validate .forge/loops/<loop>/spec/plan.md --repo <repo>
```

Skip initialization when resuming; validation follows the body edit. For an existing managed record, update
that record and validate it instead of creating a duplicate. Replace or remove
unused template prompts in authored records; keep the plan, relevant pointers and
Build-pending state sufficient for the next owner. Unused decision and Build
records remain empty. Use a subcommand's `--help` if its syntax is uncertain;
the full [CLI reference](cli.md) is for operations beyond this procedure.

An already-approved ticket is source authority to reference, not by itself a new
request to install a canonical decision or bootstrap a KB. Link that ticket as
authority. A new human decision, not an empty decision file, warrants recording.

Before handoff, inspect the saved result once: the requested artifact exists and
validates; its proposed proof can distinguish the intended change; index/log
pointers and completion claims match observed tool results. Scope code checks to
code or tests so they do not count the ticket or Plan. Run safe discovery or
precondition checks where useful; an expected pre-change failure is different
from an unusable command. Do not implement the change to validate a Plan.

If a save fails, repair the cause and verify the result while tools are available.
Do not end with a promise to retry. Write dependent success entries only after
the operation succeeds; on failure leave accurate incomplete state and report the
gap. Structural validation alone does not prove the Plan sound or delivered.
Follow the host's authorized durable-storage/checkpoint policy, then stop before
Build. Checkpointing does not establish Acceptance or Ship.

A useful Plan covers:

- accepted outcomes, constraints, preserved behavior, and non-goals;
- current flow and reusable machinery;
- approach, material seams, dependencies, integration order, and one-way doors;
- each outcome's acceptance and proof;
- bug hypotheses and cheapest distinguishing observations when applicable;
- actual open decisions and explicit stopping conditions.

For changes that can affect existing behavior, include the compact
signals -> affected obligations -> selected checks -> gaps record from
[knowledge guidance](knowledge.md). Start with changed package ownership, APIs,
events, shared types, persistence, shared foundations, deleted or renamed files,
test expectation changes, and authority edits. Expand from paths when exported
contracts or actual semantics reach more consumers. The Builder proposes this
scope; it is not a path-only pass or a full-product replay.

Avoid speculative architecture, fixed agent counts, file-by-file instructions,
and duplicated Spec prose. Builders own reversible tactics. If implementation
would require a semantic change, return the decision before dependent work.

In Guided, present a newly consequential Plan and obtain human approval before
its boundary review. Auto uses the explicit grant without an ordinary pause and
records delegated authority, never human approval of unseen text. Existing
approval can be reused when it covers the same strategy. Independent Plan review
checks faithful coverage, technical soundness, proportionality, and usable
handoff without adding requirements. Carry loop domain, API, process, data,
runtime, operations, or design intent into the proposed reviewed KB update. A
direct Plan request stops after the result and records Build as pending, including
under Auto. Guided consequential revisions return to approval; do not dispatch
Build or edit production code while that approval is pending. Brief faithful
tactical notes inside accepted direct-Build authority create no extra human gate
or planning team. Before coordinated Build, show actual Worker ownership,
sequencing, and the integrating Engineer under the shared staffing rules.
