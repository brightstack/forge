---
id: 67777777-7777-4777-8777-777777777777
code: ORDER-EDITOR
type: standing-spec
title: Order editor
status: accepted
createdAt: 2026-08-22T00:00:00+00:00
updatedAt: 2026-08-22T00:00:00+00:00
---

# Order editor

A person can add an item with a price and quantity, change its quantity, remove
it, and always see the subtotal for the current items. Pressing Enter while
editing quantity applies that quantity once; it does not add another item.

Exact colors are not specified. Existing neutral green styling is acceptable.

## Scenario: Edit a quantity without duplicating the item

Given one item is in the order
When the person changes its quantity and presses Enter
Then that item appears once and the subtotal reflects the new quantity
