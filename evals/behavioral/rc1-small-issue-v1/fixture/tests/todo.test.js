import { expect, test } from 'bun:test'
import { update } from '../src/model.js'
import { renderTodo } from '../src/view.js'

test('current lifecycle and escaping behavior', () => {
  let todos = update([], { type: 'add', id: 1, description: 'Ship <safe>' })
  todos = update(todos, { type: 'toggle', id: 1 })
  expect(todos[0].complete).toBe(true)
  expect(renderTodo(todos[0])).toContain('Ship &lt;safe&gt;')
  todos = update(todos, { type: 'delete', id: 1 })
  expect(todos).toEqual([])
})
