import { expect, test } from 'bun:test'
import { dedupeEvents } from '../src/dedupe.js'

test('deduplicates repeated provider event numbers per tenant', () => {
  const events = [
    { tenantId: 'north', eventId: '101' },
    { tenantId: 'north', eventId: '101' },
    { tenantId: 'north', eventId: '102' },
    { tenantId: 'south', eventId: '101' },
  ]
  expect(dedupeEvents(events)).toEqual([events[0], events[2], events[3]])
})
