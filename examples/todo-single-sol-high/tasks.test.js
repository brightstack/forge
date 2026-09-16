import { describe, expect, test } from 'bun:test'
import { addTask, deleteTask, toggleTask } from './tasks.js'

describe('task lifecycle', () => {
  test('adds a task with its description', () => {
    const tasks = addTask([], 'Write the brief', 'task-1')

    expect(tasks).toEqual([
      { id: 'task-1', description: 'Write the brief', completed: false },
    ])
  })

  test('completes and reopens a task', () => {
    const added = addTask([], 'Review notes', 'task-1')
    const completed = toggleTask(added, 'task-1')

    expect(completed[0].completed).toBe(true)
    expect(toggleTask(completed, 'task-1')[0].completed).toBe(false)
  })

  test('deletes a task', () => {
    const tasks = [
      { id: 'task-1', description: 'Keep me', completed: false },
      { id: 'task-2', description: 'Remove me', completed: false },
    ]

    expect(deleteTask(tasks, 'task-2')).toEqual([tasks[0]])
  })
})
