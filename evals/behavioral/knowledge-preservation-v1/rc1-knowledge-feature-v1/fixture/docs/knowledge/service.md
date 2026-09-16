---
id: dcfb696f-5758-526e-9dd1-c1c066c1b796
code: SERVICE-MAP
type: Service
title: Task archive browsing
status: stable
createdAt: 2026-09-01T00:00:00Z
updatedAt: 2026-09-01T00:00:00Z
sources:
  - resource: ../../src/api.js
---

# Tasks and archives

A task belongs to one organization and has an archived flag. The API lists active
tasks; archive browsing is currently unavailable. Archiving removes a task from
the ordinary active-work process without deleting its stored record.

[Request and data source](../../src/api.js), [governing Spec](../specs/service/SPEC.md),
[D1](decisions/D1-ownership.md), [approved archive-browsing Issue](../../.forge/loops/archive-browsing/spec/issue.md).
The approved change describes a target, not observed implemented behavior.
