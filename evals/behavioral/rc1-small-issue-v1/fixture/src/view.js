function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

export function renderTodo(todo) {
  return `<li data-id="${todo.id}">
    <input type="checkbox" ${todo.complete ? 'checked' : ''} aria-label="Toggle ${escapeHtml(todo.description)}">
    <span>${escapeHtml(todo.description)}</span>
    <button type="button" aria-label="Delete">Delete</button>
  </li>`
}
