import { expect, test } from 'bun:test'
import { createApi } from '../src/api.js'
import { runDigest } from '../src/worker.js'
test('whole-organization digest crosses API and worker', async () => {
  const store = { jobs: [], workspaces: [{ id: 'a', orgId: 'north', title: 'Alpha' }] }
  const response = await createApi(store).fetch(new Request('http://fixture/digests', { method: 'POST', headers: { 'x-org-id': 'north' } }))
  expect(response.status).toBe(202)
  const outbox = []
  runDigest(store.jobs[0], store, outbox)
  expect(outbox).toEqual([{ jobId: 'job-1', orgId: 'north', titles: ['Alpha'] }])
})
