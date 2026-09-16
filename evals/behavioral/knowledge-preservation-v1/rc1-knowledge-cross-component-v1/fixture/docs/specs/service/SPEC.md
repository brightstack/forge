---
id: a132ba66-c086-5f13-9e9c-a93521580a88
code: SERVICE
type: standing-spec
title: Workspace digests
status: stable
createdAt: 2026-09-01T00:00:00Z
updatedAt: 2026-09-01T00:00:00Z
---

# Digests

## Requirements

### Requirement: Organization digest

POST `/digests` queues a digest of all the caller's workspaces. It returns 202
and a job ID. GET `/jobs/:id` exposes that job only to its organization.

#### Scenario: Whole-organization digest
- GIVEN two workspaces owned by north and one owned by south
- WHEN north submits a digest without a selection and the worker runs
- THEN the outbox receives one digest containing both north titles and no south title

### Requirement: Worker ownership

Worker execution filters workspace data by the job's organization even when a
job includes untrusted references.

#### Scenario: Foreign reference in a queued job
- GIVEN a north job with a reference to a south workspace
- WHEN the worker processes it
- THEN no south workspace data reaches the outbox

### Requirement: Retry safety

A job ID identifies one digest delivery. Reprocessing that job produces no second
outbox entry.

#### Scenario: Replayed job
- GIVEN a job already delivered
- WHEN the worker processes the same job again
- THEN the outbox still contains one delivery for that job

### Requirement: Job visibility

#### Scenario: Foreign job lookup
- GIVEN a job owned by south
- WHEN north fetches that job ID
- THEN the response is 404 without job content


## Authority

[Original approval](../../../authority/accepted.md) and [D1](../../knowledge/decisions/D1-ownership.md).
