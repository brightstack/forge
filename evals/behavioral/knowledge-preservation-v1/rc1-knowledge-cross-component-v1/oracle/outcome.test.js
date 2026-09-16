import { expect, test } from 'bun:test'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
const { createApi } = await import(pathToFileURL(path.join(process.cwd(), 'src/api.js')))

const { runDigest } = await import(pathToFileURL(path.join(process.cwd(), 'src/worker.js')))
const makeStore = () => ({ jobs: [], workspaces: [
  { id: 'a', orgId: 'north', title: 'Alpha' },
  { id: 'b', orgId: 'north', title: 'Beta' },
  { id: 'c', orgId: 'south', title: 'Secret' },
] })
const post = (store, body) => createApi(store).fetch(new Request('http://fixture/digests', {
  method: 'POST', headers: { 'x-org-id': 'north', 'content-type': 'application/json' },
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
}))
test('selection reaches worker and omitting selection retains full digest', async () => {
  for (const [body, expected] of [[{ workspaceIds: ['b'] }, ['Beta']], [{ workspaceIds: [] }, []], [undefined, ['Alpha', 'Beta']]]) {
    const store = makeStore()
    const response = await post(store, body)
    expect(response.status).toBe(202)
    expect((await response.json()).jobId).toBe(store.jobs[0].id)
    const outbox = []
    runDigest(store.jobs[0], store, outbox)
    expect(outbox[0].titles).toEqual(expected)
  }
})
test('worker retains ownership and replay checks on supplied references', () => {
  const store = makeStore(), outbox = []
  const job = { id: 'replay-1', orgId: 'north', workspaceIds: ['b', 'c'] }
  runDigest(job, store, outbox)
  runDigest(job, store, outbox)
  expect(outbox).toHaveLength(1)
  expect(outbox[0].jobId).toBe('replay-1')
  expect(outbox[0].titles).not.toContain('Secret')
})
test('invalid selection rejects without queuing', async () => {
  const store = makeStore()
  for (const workspaceIds of [null, 'a', [1], ['']]) expect((await post(store, { workspaceIds })).status).toBe(400)
  expect(store.jobs).toEqual([])
})
test('foreign job remains private', async () => {
  const store = makeStore()
  store.jobs.push({ id: 'south-job', orgId: 'south' })
  const response = await createApi(store).fetch(new Request('http://fixture/jobs/south-job', { headers: { 'x-org-id': 'north' } }))
  expect(response.status).toBe(404)
})
