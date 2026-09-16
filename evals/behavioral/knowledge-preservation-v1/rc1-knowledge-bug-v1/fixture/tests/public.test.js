import { expect, test } from 'bun:test'
import { createApi } from '../src/api.js'
import { health } from '../src/health.js'
test('positive limit selects the first task', async () => {
  const api = createApi([{ id: 'a', orgId: 'north', archived: false }, { id: 'b', orgId: 'north', archived: false }])
  const response = await api.fetch(new Request('http://fixture/tasks?limit=1', { headers: { 'x-org-id': 'north' } }))
  expect(await response.json()).toEqual([{ id: 'a', orgId: 'north', archived: false }])
})
test('independent health', () => expect(health()).toEqual({ status: 'ok' }))
