---
id: 07e5864a-e4b3-5aea-a6cb-2c5824c6667b
code: ARCHIVE-ISSUE
type: issue
title: Archived-task browsing
status: accepted
createdAt: 2026-09-10T00:00:00Z
updatedAt: 2026-09-10T00:00:00Z
---

# Archived-task browsing

## Approval and outcome

Human product owner Taylor, 2026-09-10: "I approve archive browsing using
`GET /tasks?status=archived`. Default active listing and organization ownership
remain unchanged." This exact feature and its local delivery are authorized.
Users can inspect retained archived tasks without changing their active list.

## Domain and API

Reuse each task's existing archived flag; no new entity or schema. Add the
`archived` status filter. `status=active` and omitted status both select active
tasks. Unsupported status values still return 400.

## Process

A caller switches from active work to archive browsing, inspects the retained
records, then returns to the default list. No restore or delete action is added.

## Acceptance

The [behavioral delta](change.md) changes archive browsing. Default-list and
organization-isolation obligations in the [standing Spec](../../../../docs/specs/service/SPEC.md)
remain accepted. No publication is included.
