---
id: 8d20df71-f673-4476-bae5-74851de46b69
code: REMINDER-PAUSE-V2
type: issue
title: Pause and resume reminders
status: accepted
createdAt: 2026-09-10T00:00:00Z
updatedAt: 2026-09-10T00:00:00Z
---

# Pause and resume reminders

## Context

Allow a person to pause a reminder and later resume it without losing the selected
daily or weekly cadence. Preserve the accepted invalid-cadence rejection and its
no-mutation behavior. The existing due-reminder consumer is the delivery boundary
for this synthetic fixture.

## Acceptance Criteria

- Pausing an active reminder retains its cadence and suppresses delivery.
- Resuming a paused reminder retains its cadence and restores delivery.
- An update containing an unsupported cadence returns 400 without changing any
  reminder field, including pause state.

## Authority

[Human approval](../../../../authority/approved.md).
