import { expect, test } from 'bun:test'
import { summarize } from '../src/summarize.js'

test('aggregates repeated SKUs in first-seen order', () => {
  expect(summarize([
    { sku: 'b', quantity: 2 },
    { sku: 'a', quantity: 1 },
    { sku: 'b', quantity: 3 },
  ])).toEqual([
    { sku: 'b', quantity: 5 },
    { sku: 'a', quantity: 1 },
  ])
})
