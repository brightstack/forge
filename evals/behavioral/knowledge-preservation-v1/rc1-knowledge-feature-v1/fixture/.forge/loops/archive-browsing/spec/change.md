---
id: 59c60d19-38df-5f84-a406-262e6c098355
code: ARCHIVE-CHANGE
type: spec-change
title: Archived-task browsing
status: stable
createdAt: 2026-09-01T00:00:00Z
updatedAt: 2026-09-01T00:00:00Z
---

# Archived-list delta

Authorized by the [archive-browsing Issue](issue.md). Domain, API and process
context live in that Issue; this record captures the changed behavior only.

Replace the unsupported archived-list scenario with:
- GIVEN archived tasks in the caller's organization
- WHEN the caller requests `/tasks?status=archived`
- THEN only those archived tasks are returned with status 200

Keep the default-list and organization-isolation obligations in the
[standing Spec](../../../../docs/specs/service/SPEC.md).
