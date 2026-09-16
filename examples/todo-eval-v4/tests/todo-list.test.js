import { describe, expect, test } from 'bun:test'
import { createTodoList } from '../src/todo-list.js'

describe('Todo list', () => {
  test('adds a described task to the list', () => {
    const todoList = createTodoList()

    todoList.add('Write the release note')

    expect(todoList.getTasks()).toEqual([
      {
        id: '1',
        description: 'Write the release note',
        completed: false,
      },
    ])
  })

  test('marks a task complete and returns it to incomplete', () => {
    const todoList = createTodoList()
    const task = todoList.add('Check the build')

    todoList.setCompleted(task.id, true)
    expect(todoList.getTasks()[0].completed).toBe(true)

    todoList.setCompleted(task.id, false)
    expect(todoList.getTasks()[0].completed).toBe(false)
  })

  test('deletes a task from the list', () => {
    const todoList = createTodoList()
    const task = todoList.add('Remove the draft')

    todoList.remove(task.id)

    expect(todoList.getTasks()).toEqual([])
  })
})
