---
id: 64444444-4444-4444-8444-444444444444
code: TASKS
type: standing-spec
title: Tasks
status: accepted
createdAt: 2026-05-03T00:00:00+00:00
updatedAt: 2026-05-03T00:00:00+00:00
---

# Tasks

## Requirement: Add a task

A person can add a task with a non-empty description and see it immediately.

### Scenario: Add a task

Given a person is viewing their task list
When they add a non-empty task description
Then the new incomplete task appears in the list

## Requirement: Complete and reopen a task

A person can mark a task complete and return it to incomplete while it remains in the list.

### Scenario: Reopen a completed task

Given a completed task remains in the list
When the person reopens it
Then the task becomes incomplete

## Requirement: Delete a task

A person can explicitly delete any task and see it removed immediately.

### Scenario: Delete a task early

Given a task exists
When the person deletes it
Then it is removed from the list

## Implementation status

Existing add, complete/reopen, and delete behavior is implemented. Any proposed
automatic removal behavior is NOT RUN until delivered and verified separately.
