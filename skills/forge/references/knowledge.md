# Knowledge and proportional preservation

The optional knowledge bundle helps agents retrieve accepted authority and
current system facts. It never proves compliance, acceptance, or runtime truth.

## Optional topic map

Create only the topics earned by the work. Do not bootstrap empty directories or
placeholder records. OKF concept types are open; the labels and templates below
are suggestions, not a registry.

| Topic | Questions it answers | Suggested type and template |
| --- | --- | --- |
| Domain | What terms, entities, and relationships mean | `Domain Concept`, [concept](../assets/concept.md) |
| Data | What models, schema, persistence lifecycle, constraints, tenancy, and reads/writes require | `Data Model` or `Persistence Contract`, [concept](../assets/concept.md) or [interface](../assets/interface.md) |
| Runtime | What services, workers, events, and runtime boundaries do | `Runtime Component` or `Runtime Contract`, [concept](../assets/concept.md) or [interface](../assets/interface.md) |
| Core processes | How business flows, actors, inputs, outputs, and recovery work | `Core Process`, [process](../assets/process.md) |
| Operations | How deployment, infrastructure, observability, and operating procedures work | `Operational Practice` or `Operations Contract`, [process](../assets/process.md) or [interface](../assets/interface.md) |
| Shared foundations | Which auth, routing, library, and design-system primitives other work relies on | `Shared Foundation` or `Foundation Contract`, [concept](../assets/concept.md) or [interface](../assets/interface.md) |

Use the repository's existing hierarchy and link maintained sources. Do not copy
standing requirements or code that will drift into a competing record.

## Preservation packet

Every loop records the smallest useful chain:

```text
signals -> affected obligations -> selected checks -> gaps
```

Consider these signals: package ownership; internal or public APIs, events, and
shared types; database or schema changes; persistence lifecycle, constraints,
tenancy, or read/write paths; shared auth, routing, libraries, or design
primitives; deleted or renamed files; removed, skipped, or expectation-changing
tests; and Spec, decision, or KB edits. Package paths narrow discovery. Exported
contracts and actual semantics expand it.

The obligations name affected and preserved scenarios, NFRs, decisions, domain
terms, processes, APIs, data rules, and design intent. The checks cover the
changed or new outcome, affected unchanged outcomes, and material failure paths.
Record unavailable evidence or unresolved scope as gaps. A path list is not a
preservation verdict, and a full-product replay is not required for every patch.
For a tiny change, a one-line scope or justified no-op is sufficient. Do not
inventory unrelated untouched areas.

## Ownership and timing

Spec and Plan carry domain, API, process, data, runtime, operations, and design
intent into the early-applied canonical target after human approval. The Builder
finishes factual observations as implementation becomes observable and proposes
the preservation scope. The Reviewer challenges it and reviews actual canonical
bytes beside code and tests. Acceptance exercises affected unchanged and changed
or new outcomes. Ship checks the complete candidate once and records concise
closure; it does not routinely rewrite canonical knowledge.

Use `forge kb ask` to retrieve authority. Use `forge kb history` to inspect
successful receipt-derived changes. KB search and structural verification never
establish implementation compliance.
