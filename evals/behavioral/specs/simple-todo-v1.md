# Spec: Simple Todo app

BLUF: Provide a fresh Todo app in which a person can add, complete, reopen, and delete tasks.

## Context

A person needs a small, focused way to manage a list of tasks. This Spec is a
frozen public input for Forge behavioral evaluations. It does not inherit
requirements from any previous Todo implementation or evaluation run.

## Product outcome

- A person can manage the core lifecycle of tasks in a simple Todo list.

## Acceptance criteria

| ID | Observable product behavior | Authority |
| --- | --- | --- |
| AC1 | A person can add a task with a description and see it in the Todo list. | User-approved Forge evaluation scenario |
| AC2 | A person can mark a task complete and return it to incomplete. | User-approved Forge evaluation scenario |
| AC3 | A person can delete a task and see it removed from the Todo list. | User-approved Forge evaluation scenario |

## Non-goals

- Persistence or storage-recovery guarantees.
- Accounts, sharing, synchronization, categories, priorities, dates, reminders, or search.
- Exact visual styling, animation, or interaction choreography.
- Mandatory cases, compatibility guarantees, or proof obligations beyond AC1-AC3.

## Authority and evidence

- The user approved this three-behavior Todo scenario as reusable Forge evaluation authority on 2026-08-22.
- Downstream agents may make reversible craft choices needed to implement the accepted behavior. Those choices do not become acceptance criteria, NFRs, guarantees, or mandatory proof.
- A future evaluation that changes the accepted behavior must use a new version of this Spec.

## Open questions

- None.

<!-- The Spec alone originates product ACs. Keep Design constraints, NFRs,
implementation, APIs, proof tactics, sequencing, and delivery status out. -->
