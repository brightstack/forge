import { expect, test } from 'bun:test'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const { parseRecord } = await import(pathToFileURL(path.join(process.cwd(), 'src/records.js')))

test('public boundary rejects unknown top-level fields', () => {
  expect(() => parseRecord('{"id":"r1","name":"Ada","admin":true}')).toThrow('unknown fields: admin')
})
