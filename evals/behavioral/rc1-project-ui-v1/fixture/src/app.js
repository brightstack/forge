import { createTodoStore } from './model.js'
import { renderTodos } from './view.js'

const store = createTodoStore()
const form = document.querySelector('#todo-form')
const list = document.querySelector('#todo-list')
const empty = document.querySelector('#empty-state')

function render() {
  const todos = store.list()
  list.innerHTML = renderTodos(todos)
  empty.hidden = todos.length > 0
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  if (store.add(new FormData(form).get('description') ?? '')) {
    form.reset()
    render()
  }
})

list.addEventListener('click', (event) => {
  const action = event.target.dataset.action
  const id = Number(event.target.closest('[data-id]')?.dataset.id)
  if (action === 'toggle') store.toggle(id)
  if (action === 'delete') store.remove(id)
  render()
})

render()
