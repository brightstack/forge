export function createTodoStore() {
  let nextId = 1
  let todos = []
  return {
    add(description) {
      const text = description.trim()
      if (!text) return false
      todos = [...todos, { id: nextId++, description: text, complete: false }]
      return true
    },
    toggle(id) {
      todos = todos.map((todo) => todo.id === id ? { ...todo, complete: !todo.complete } : todo)
    },
    remove(id) {
      todos = todos.filter((todo) => todo.id !== id)
    },
    list() {
      return todos.map((todo) => ({ ...todo }))
    },
  }
}
