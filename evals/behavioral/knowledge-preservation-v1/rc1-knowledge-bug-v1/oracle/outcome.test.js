import { expect, test } from 'bun:test'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
const { createApi } = await import(pathToFileURL(path.join(process.cwd(), 'src/api.js')))

const tasks = [
  { id: 'a', orgId: 'north', archived: false },
  { id: 'b', orgId: 'north', archived: false },
  { id: 'c', orgId: 'north', archived: true },
  { id: 'd', orgId: 'south', archived: false },
]
const list = async query => {
  const response = await createApi(tasks).fetch(new Request(`http://fixture/tasks${query}`, { headers: { 'x-org-id': 'north' } }))
  expect(response.status).toBe(200)
  return (await response.json()).map(task => task.id)
}
test('original zero-size reproduction', async () => expect(await list('?limit=0')).toEqual([]))
test('default and positive limits retain lifecycle and ownership', async () => {
  expect(await list('')).toEqual(['a', 'b'])
  expect(await list('?limit=1')).toEqual(['a'])
})
