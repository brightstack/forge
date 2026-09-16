---
id: f712f86d-6008-4565-adb3-bb8337a00d3f
code: NOTES
type: standing-spec
title: Notes
status: accepted
createdAt: 2026-09-01T00:00:00.000Z
updatedAt: 2026-09-01T00:00:00.000Z
---

# Notes

## Active and archived Notes

A person can create, edit, archive, restore, and manually delete their own Notes.
Archiving a Note does not currently schedule automatic deletion.

### Scenario: Restore an archived Note

Given a person has an archived Note
When they restore it
Then the Note returns to their active Notes

### Scenario: Keep an active Note

Given a person has an active Note
When time passes
Then the Note remains available until the person archives or deletes it
