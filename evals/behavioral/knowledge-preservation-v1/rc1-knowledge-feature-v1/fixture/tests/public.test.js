import { expect, test } from 'bun:test'
import { createApi } from '../src/api.js'
test('default list shows active own records', async () => {
  const api = createApi([{ id: 'a', orgId: 'north', archived: false }, { id: 'b', orgId: 'north', archived: true }])
  const response = await api.fetch(new Request('http://fixture/tasks', { headers: { 'x-org-id': 'north' } }))
  expect((await response.json()).map(task => task.id)).toEqual(['a'])
})
