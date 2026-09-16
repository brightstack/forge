import { expect, test } from 'bun:test'
import { toggleFromDataset } from '../src/controller.js'
import { createTodos } from '../src/todos.js'

test('later task actions work', () => {
  const store = createTodos(['first', 'second'])
  toggleFromDataset(store, { id: '1' })
  expect(store.list()[1].complete).toBe(true)
})
