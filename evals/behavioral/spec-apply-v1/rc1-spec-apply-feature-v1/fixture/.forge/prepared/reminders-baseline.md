---
id: 9f748f73-8085-4ddb-b599-727404129bd2
code: REMINDERS
type: standing-spec
title: Reminder delivery
status: stable
createdAt: 2026-09-01T00:00:00Z
updatedAt: 2026-09-01T00:00:00Z
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

## Authority

Authority source: `authority/approved.md`.
