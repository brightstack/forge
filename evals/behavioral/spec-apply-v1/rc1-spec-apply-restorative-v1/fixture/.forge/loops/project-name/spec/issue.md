---
id: 26a8848b-5795-4a92-a5f1-ee6043b2d122
code: PROJECT-NAME-BUG
type: bug
title: Trailing whitespace remains in project names
status: accepted
createdAt: 2026-09-10T00:00:00Z
updatedAt: 2026-09-10T00:00:00Z
---

# Trailing whitespace remains in project names

## Context

`normalizeProjectName("Launch  ")` returns `"Launch  "` instead of the accepted
`"Launch"`. Restore PN-01 while preserving PN-02. This bug does not change product
meaning or authorize a Spec/knowledge/decision delta.

## Acceptance Criteria

- The original trailing-whitespace reproduction returns `"Launch"`.
- Leading and surrounding whitespace are normalized.
- Whitespace-only names remain rejected.
