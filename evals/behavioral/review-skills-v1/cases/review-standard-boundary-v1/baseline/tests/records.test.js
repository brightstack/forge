import { expect, test } from 'bun:test'
import { parseRecord } from '../src/records.js'

test('parses valid records', () => {
  expect(parseRecord('{"id":"r1","name":"Ada"}')).toEqual({ id: 'r1', name: 'Ada' })
})
