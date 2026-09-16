---
id: 657ed255-fd53-4579-9855-b7f1d800e75c
code: REMINDER-PAUSE-CHANGE
type: spec-change
title: Reminder pause and resume
status: approved
createdAt: 2026-09-10T00:00:00Z
updatedAt: 2026-09-10T00:00:00Z
---

# Reminder pause and resume

Add RM-03 and RM-04 exactly as prepared in
`.forge/prepared/reminders-target.md`. Preserve RM-01 and RM-02 unchanged. The
[accepted Issue](issue.md) and [human approval](../../../../authority/approved.md)
are the controlling sources.

No other reminder behavior or knowledge claim changes.

### Scenario: RM-03 Pause delivery

- GIVEN an active weekly reminder
- WHEN it is paused
- THEN it remains weekly and does not deliver

### Scenario: RM-04 Resume delivery

- GIVEN a paused weekly reminder
- WHEN it is resumed
- THEN it remains weekly and delivers on the weekly cadence
