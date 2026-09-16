---
id: 0e73c81f-fb5a-4cdc-a07e-c8fce582f47c
code: PROJECTS
type: standing-spec
title: Project names
status: stable
createdAt: 2026-09-01T00:00:00Z
updatedAt: 2026-09-01T00:00:00Z
---

# Project names

## Requirements

### Requirement: Normalize surrounding whitespace

Project names omit surrounding whitespace before storage or display.

#### Scenario: PN-01 Normalize a project name

- GIVEN a name with leading or trailing whitespace
- WHEN the name is accepted
- THEN the resulting name has no surrounding whitespace

### Requirement: Reject empty names

#### Scenario: PN-02 Whitespace-only name

- GIVEN a name containing only whitespace
- WHEN normalization runs
- THEN the name is rejected

## Authority

[Accepted behavior](../../../authority/accepted.md).
