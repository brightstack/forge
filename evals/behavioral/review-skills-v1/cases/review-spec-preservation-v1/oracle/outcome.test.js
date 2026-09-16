import { expect, test } from 'bun:test'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const { deliver } = await import(pathToFileURL(path.join(process.cwd(), 'src/delivery.js')))

test('retry preserves the accepted provider idempotency key', async () => {
  const keys = []
  const result = await deliver({ deliveryId: 'd-7', body: 'hello' }, async (_message, options) => {
    keys.push(options.idempotencyKey)
    if (keys.length === 1) throw new Error('transient')
    return 'accepted'
  })
  expect(result).toBe('accepted')
  expect(keys).toEqual(['d-7', 'd-7'])
})
