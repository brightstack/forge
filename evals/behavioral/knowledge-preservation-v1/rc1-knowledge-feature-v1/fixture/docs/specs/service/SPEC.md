---
id: 15e1282a-1a9e-5878-b913-0d99f9d6c2a9
code: SERVICE
type: standing-spec
title: Task archive browsing
status: stable
createdAt: 2026-09-01T00:00:00Z
updatedAt: 2026-09-01T00:00:00Z
---

# Tasks

## Requirements

### Requirement: Active list

GET `/tasks` returns the caller's active tasks. Archived tasks are not listed.

#### Scenario: Default list
- GIVEN own active and archived tasks
- WHEN the caller requests `/tasks` without a status filter
- THEN only active tasks are returned

#### Scenario: Archived list request
- GIVEN an archived task
- WHEN the caller requests `/tasks?status=archived`
- THEN the response is 400 because archive browsing is not supported

### Requirement: Organization isolation

Every list is scoped to `x-org-id`; another organization's tasks are never listed.

#### Scenario: Foreign task
- GIVEN an active task belonging to another organization
- WHEN the caller lists tasks
- THEN that task is absent


## Authority

[Original approval](../../../authority/accepted.md) and [D1](../../knowledge/decisions/D1-ownership.md).
