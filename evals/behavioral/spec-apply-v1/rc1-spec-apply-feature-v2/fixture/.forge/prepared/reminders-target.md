---
id: 29cc3c93-a841-4fad-b407-2bb8e01ba9d7
code: REMINDERS-V2
type: standing-spec
title: Reminder delivery
status: stable
createdAt: 2026-09-01T00:00:00Z
updatedAt: 2026-09-10T00:00:00Z
---

# Reminder delivery

## Requirements

### Requirement: Delivery cadence

A reminder uses either a daily or weekly delivery cadence.

#### Scenario: RM-01 Change cadence

- GIVEN a daily reminder
- WHEN its cadence is changed to weekly
- THEN the reminder uses weekly cadence

### Requirement: Invalid cadence

An unsupported cadence is rejected without changing the reminder.

#### Scenario: RM-02 Reject unsupported cadence

- GIVEN an existing reminder
- WHEN its cadence is changed to an unsupported value
- THEN the request returns 400 and the reminder remains unchanged

### Requirement: Pause and resume

Pausing a reminder suppresses delivery without changing its cadence. Resuming it
restores delivery on that retained cadence.

#### Scenario: RM-03 Pause delivery

- GIVEN an active weekly reminder
- WHEN it is paused
- THEN it remains weekly and does not deliver

#### Scenario: RM-04 Resume delivery

- GIVEN a paused weekly reminder
- WHEN it is resumed
- THEN it remains weekly and delivers on the weekly cadence

## Runtime boundary

For this synthetic fixture, a delivery is observable when the due-reminder
consumer returns a delivery and appends it to its outbox.

## Authority

Authority source: `authority/approved.md`.
