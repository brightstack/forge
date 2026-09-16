---
id: 1d968a86-461e-56b7-ac9b-67e3be617d54
code: D1
type: Decision
title: Organization ownership
status: stable
createdAt: 2026-09-01T00:00:00Z
updatedAt: 2026-09-01T00:00:00Z
sources:
  - resource: ../../../authority/accepted.md
---

# Organization ownership

Accepted human decision, 2026-09-01, scoped to this fixture service.

Organization ownership remains mandatory; returning no requested rows must never widen access.

Rationale: workspaces belong to an organization, and background jobs must respect
that ownership as well as foreground requests. Supersedes: none.

[Human source](../../../authority/accepted.md). [Contract](../../specs/service/SPEC.md).
