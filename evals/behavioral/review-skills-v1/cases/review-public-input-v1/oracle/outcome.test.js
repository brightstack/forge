import { expect, test } from 'bun:test'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const { dedupeEvents } = await import(pathToFileURL(path.join(process.cwd(), 'src/dedupe.js')))

test('representative opaque IDs remain distinct and exact duplicates collapse', () => {
  const events = fs.readFileSync(path.join(process.cwd(), 'inputs/events.jsonl'), 'utf8')
    .trim().split('\n').map(line => JSON.parse(line))
  expect(dedupeEvents(events).map(event => event.eventId)).toEqual(['evt-a', 'evt-b'])
})
