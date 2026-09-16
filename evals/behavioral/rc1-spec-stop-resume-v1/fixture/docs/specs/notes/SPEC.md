---
id: 61111111-1111-4111-8111-111111111111
code: NOTES
type: standing-spec
title: Notes
status: accepted
createdAt: 2026-06-12T00:00:00+00:00
updatedAt: 2026-06-12T00:00:00+00:00
---

# Notes

## Requirement: Read and edit Notes online

People can create, read, and edit their own Notes while connected to the service.

### Scenario: Edit an existing Note

Given a signed-in person owns a Note
When they edit and save it while online
Then the service returns the updated Note

Offline behavior is not yet specified.
