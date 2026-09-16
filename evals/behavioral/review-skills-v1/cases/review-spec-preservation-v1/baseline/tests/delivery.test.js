import { expect, test } from 'bun:test'
import { deliver } from '../src/delivery.js'

test('sends a successful delivery once', async () => {
  const calls = []
  const result = await deliver({ deliveryId: 'd-7', body: 'hello' }, async (message, options) => {
    calls.push({ message, options })
    return 'accepted'
  })
  expect(result).toBe('accepted')
  expect(calls).toHaveLength(1)
  expect(calls[0].message.deliveryId).toBe('d-7')
})
