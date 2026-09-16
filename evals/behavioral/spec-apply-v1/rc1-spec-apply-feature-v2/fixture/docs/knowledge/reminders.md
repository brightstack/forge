---
type: Runtime Component
sources:
  - resource: ../../src/reminders.js
  - resource: ../../src/delivery.js
  - resource: ../specs/reminders/SPEC.md
---

# Reminder updates and delivery

`src/reminders.js` applies supported cadence updates and rejects unsupported
cadences without mutation. `src/delivery.js` consumes due reminders and emits a
delivery to its outbox. The standing Spec owns accepted reminder behavior; this
record describes only currently observed seed behavior.
