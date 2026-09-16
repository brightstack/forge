---
id: fed4b609-6972-5373-a928-876cc71aedbf
code: SERVICE-MAP
type: Service
title: Workspace digests
status: stable
createdAt: 2026-09-01T00:00:00Z
updatedAt: 2026-09-01T00:00:00Z
sources:
  - resource: ../../src/api.js
---

# Workspace digests

Workspaces carry an ID, organization and title. The request handler creates jobs;
the worker resolves workspace data and appends digest deliveries to the outbox.
Current jobs select the entire organization, with no workspace-selection field.
The outbox records a job ID to recognize replay.

[Request and job source](../../src/api.js), [worker source](../../src/worker.js),
[governing Spec](../specs/service/SPEC.md), [worker ownership decision D1](decisions/D1-ownership.md).
The separate health surface does not read workspace or job state.
