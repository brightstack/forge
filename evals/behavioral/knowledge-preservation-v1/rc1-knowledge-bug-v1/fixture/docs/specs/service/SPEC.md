---
id: ea39902f-8853-5f21-a010-9a1b6eb20e30
code: SERVICE
type: standing-spec
title: Task listing
status: stable
createdAt: 2026-09-01T00:00:00Z
updatedAt: 2026-09-01T00:00:00Z
---

# Tasks

## Requirements

### Requirement: Requested list size

GET `/tasks?limit=N` returns at most N active tasks belonging to the caller's
organization. Omitted limit means 20. Zero is a valid limit.

#### Scenario: Zero requested rows
- GIVEN an organization with active tasks
- WHEN its caller requests `limit=0`
- THEN the response is 200 with an empty list

#### Scenario: Positive requested rows
- GIVEN several active tasks in one organization
- WHEN its caller requests `limit=1`
- THEN only the first active task is returned

### Requirement: Organization and lifecycle selection

Inactive tasks and another organization's tasks are absent from this list.

#### Scenario: Mixed stored tasks
- GIVEN own active, own archived and foreign active tasks
- WHEN the caller lists tasks
- THEN only own active tasks are returned


## Authority

[Original approval](../../../authority/accepted.md) and [D1](../../knowledge/decisions/D1-ownership.md).
