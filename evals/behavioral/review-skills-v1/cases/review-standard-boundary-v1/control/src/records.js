import { assertExactKeys } from './validate.js'

export function parseRecord(json) {
  const record = assertExactKeys(JSON.parse(json), ['id', 'name'])
  return record
}
