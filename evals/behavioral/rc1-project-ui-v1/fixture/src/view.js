function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

export function renderTodos(todos) {
  return todos.map((todo) => `
    <li class="${todo.complete ? 'is-complete' : ''}" data-id="${todo.id}">
      <input type="checkbox" data-action="toggle" ${todo.complete ? 'checked' : ''} aria-label="Mark ${escapeHtml(todo.description)} complete">
      <span>${escapeHtml(todo.description)}</span>
      <button type="button" data-action="delete" aria-label="Delete ${escapeHtml(todo.description)}">Delete</button>
    </li>`).join('')
}
