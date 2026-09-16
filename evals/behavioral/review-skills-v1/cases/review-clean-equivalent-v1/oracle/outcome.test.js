import { expect, test } from 'bun:test'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const { summarize } = await import(pathToFileURL(path.join(process.cwd(), 'src/summarize.js')))

test('preserves accepted aggregation semantics across non-golden inputs', () => {
  expect(summarize([])).toEqual([])
  expect(summarize([
    { sku: 'zero', quantity: 0 },
    { sku: 'negative', quantity: -2 },
    { sku: 'zero', quantity: 4 },
    { sku: 'negative', quantity: 1 },
  ])).toEqual([
    { sku: 'zero', quantity: 4 },
    { sku: 'negative', quantity: -1 },
  ])
})

test('returns fresh summary objects', () => {
  const input = [{ sku: 'a', quantity: 1 }]
  const result = summarize(input)
  expect(result[0]).not.toBe(input[0])
  expect(result).toEqual([{ sku: 'a', quantity: 1 }])
})
