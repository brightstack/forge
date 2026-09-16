import { expect, test } from 'bun:test'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const workspace = process.cwd()
const { createTodos } = await import(pathToFileURL(path.join(workspace, 'src/todos.js')))
const { toggleFromDataset, deleteFromDataset } = await import(pathToFileURL(path.join(workspace, 'src/controller.js')))

test('original zero-ID toggle reproduction and delete sibling', () => {
  const store = createTodos(['first', 'second'])
  toggleFromDataset(store, { id: '0' })
  expect(store.list()[0].complete).toBe(true)
  expect(deleteFromDataset(store, { id: '0' })).toBe(true)
  expect(store.list().map((todo) => todo.description)).toEqual(['second'])
})

test('later and missing IDs remain stable', () => {
  const store = createTodos(['first', 'second'])
  toggleFromDataset(store, { id: '1' })
  expect(store.list()[1].complete).toBe(true)
  expect(deleteFromDataset(store, { id: '99' })).toBe(false)
})
