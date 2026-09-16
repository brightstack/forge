import { assertExactKeys } from './validate.js'

export function parseRecord(json) {
  return assertExactKeys(JSON.parse(json), ['id', 'name'])
}
