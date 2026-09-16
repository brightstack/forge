import { expect, test } from 'bun:test'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
const { createApi } = await import(pathToFileURL(path.join(process.cwd(), 'src/api.js')))

const tasks = [
  { id: 'a', orgId: 'north', archived: false },
  { id: 'b', orgId: 'north', archived: true },
  { id: 'c', orgId: 'south', archived: true },
  { id: 'd', orgId: 'south', archived: false },
]
const list = query => createApi(tasks).fetch(new Request(`http://fixture/tasks${query}`, { headers: { 'x-org-id': 'north' } }))
test('authorized archive selection', async () => {
  const response = await list('?status=archived')
  expect(response.status).toBe(200)
  expect((await response.json()).map(task => task.id)).toEqual(['b'])
})
test('unchanged default, explicit active and invalid status', async () => {
  for (const query of ['', '?status=active']) {
    const response = await list(query)
    expect((await response.json()).map(task => task.id)).toEqual(['a'])
  }
  expect((await list('?status=anything')).status).toBe(400)
})
