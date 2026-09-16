import { createTodoList } from './todo-list.js'

const todoList = createTodoList()
const form = document.querySelector('#todo-form')
const descriptionInput = document.querySelector('#task-description')
const listElement = document.querySelector('#todo-list')
const emptyState = document.querySelector('#empty-state')
const taskSummary = document.querySelector('#task-summary')
const statusMessage = document.querySelector('#status-message')

function announce(message) {
  statusMessage.textContent = ''
  requestAnimationFrame(() => {
    statusMessage.textContent = message
  })
}

function createTaskElement(task) {
  const item = document.createElement('li')
  item.className = 'todo-item'
  item.classList.toggle('is-complete', task.completed)

  const label = document.createElement('label')
  label.className = 'todo-toggle'

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.checked = task.completed
  checkbox.setAttribute(
    'aria-label',
    `Mark ${task.description} ${task.completed ? 'incomplete' : 'complete'}`,
  )
  checkbox.addEventListener('change', () => {
    const updatedTask = todoList.setCompleted(task.id, checkbox.checked)
    item.classList.toggle('is-complete', updatedTask.completed)
    checkbox.setAttribute(
      'aria-label',
      `Mark ${updatedTask.description} ${updatedTask.completed ? 'incomplete' : 'complete'}`,
    )
    const state = updatedTask.completed ? 'complete' : 'incomplete'
    announce(`${updatedTask.description} marked ${state}.`)
  })

  const checkmark = document.createElement('span')
  checkmark.className = 'checkmark'
  checkmark.textContent = '✓'
  checkmark.setAttribute('aria-hidden', 'true')

  const description = document.createElement('span')
  description.className = 'todo-description'
  description.textContent = task.description

  const deleteButton = document.createElement('button')
  deleteButton.className = 'delete-button'
  deleteButton.type = 'button'
  deleteButton.textContent = 'Delete'
  deleteButton.setAttribute('aria-label', `Delete ${task.description}`)
  deleteButton.addEventListener('click', () => {
    const removedTask = todoList.remove(task.id)
    render()
    descriptionInput.focus()
    announce(`${removedTask.description} deleted.`)
  })

  label.append(checkbox, checkmark, description)
  item.append(label, deleteButton)
  return item
}

function render() {
  const tasks = todoList.getTasks()
  listElement.replaceChildren(...tasks.map(createTaskElement))
  emptyState.hidden = tasks.length > 0
  taskSummary.textContent = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`
}

form.addEventListener('submit', (event) => {
  event.preventDefault()

  const task = todoList.add(descriptionInput.value)
  if (!task) return

  form.reset()
  render()
  descriptionInput.focus()
  announce(`${task.description} added.`)
})

render()
