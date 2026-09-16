---
id: 2b3fbb25-0ddd-5ada-9037-4727fc95576d
code: SERVICE-MAP
type: Service
title: Task listing
status: stable
createdAt: 2026-09-01T00:00:00Z
updatedAt: 2026-09-01T00:00:00Z
sources:
  - resource: ../../src/api.js
---

# Task listing

Tasks carry an ID, organization owner, title and archived flag. The request
handler reads `x-org-id`, selects active rows and applies the requested limit.
The current implementation treats zero like an omitted limit, so `limit=0`
returns up to twenty rows. This is an observed implementation mismatch with the
[zero-row contract](../specs/service/SPEC.md#scenario-zero-requested-rows), not a
new product rule.

[Source](../../src/api.js), [public tests](../../tests/public.test.js),
[governing Spec](../specs/service/SPEC.md), [D1](decisions/D1-ownership.md).
