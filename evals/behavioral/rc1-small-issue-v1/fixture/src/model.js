export function update(todos, action) {
  if (action.type === 'add') return [...todos, { id: action.id, description: action.description, complete: false }]
  if (action.type === 'toggle') return todos.map((todo) => todo.id === action.id ? { ...todo, complete: !todo.complete } : todo)
  if (action.type === 'delete') return todos.filter((todo) => todo.id !== action.id)
  return todos
}
