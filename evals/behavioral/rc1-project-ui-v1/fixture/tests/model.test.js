import { expect, test } from 'bun:test'
import { createTodoStore } from '../src/model.js'

test('model supports the task lifecycle', () => {
  const store = createTodoStore()
  expect(store.add('Write plan')).toBe(true)
  store.toggle(1)
  expect(store.list()[0].complete).toBe(true)
  store.toggle(1)
  expect(store.list()[0].complete).toBe(false)
  store.remove(1)
  expect(store.list()).toEqual([])
})
