import { addTask, deleteTask, toggleTask } from './tasks.js'

const form = document.querySelector('#task-form')
const input = document.querySelector('#task-description')
const list = document.querySelector('#task-list')
const emptyState = document.querySelector('#empty-state')
const taskCount = document.querySelector('#task-count')

let tasks = []

function render() {
  list.replaceChildren(
    ...tasks.map((task) => {
      const item = document.createElement('li')
      item.className = task.completed ? 'task is-complete' : 'task'

      const label = document.createElement('label')
      label.className = 'task-toggle'

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.checked = task.completed
      checkbox.addEventListener('change', () => {
        tasks = toggleTask(tasks, task.id)
        render()
      })

      const checkmark = document.createElement('span')
      checkmark.className = 'checkmark'
      checkmark.setAttribute('aria-hidden', 'true')

      const description = document.createElement('span')
      description.className = 'task-description'
      description.textContent = task.description

      const remove = document.createElement('button')
      remove.className = 'delete-task'
      remove.type = 'button'
      remove.textContent = 'Delete'
      remove.setAttribute('aria-label', `Delete ${task.description}`)
      remove.addEventListener('click', () => {
        tasks = deleteTask(tasks, task.id)
        render()
      })

      label.append(checkbox, checkmark, description)
      item.append(label, remove)
      return item
    }),
  )

  const count = tasks.length
  taskCount.textContent = `${count} ${count === 1 ? 'task' : 'tasks'}`
  emptyState.hidden = count > 0
}

form.addEventListener('submit', (event) => {
  event.preventDefault()

  tasks = addTask(tasks, input.value)
  input.value = ''
  render()
  input.focus()
})

render()
