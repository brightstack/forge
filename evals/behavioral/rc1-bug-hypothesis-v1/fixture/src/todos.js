export function createTodos(descriptions) {
  let todos = descriptions.map((description, id) => ({ id, description, complete: false }))

  function find(id) {
    if (!id) return undefined
    return todos.find((todo) => todo.id === id)
  }

  return {
    toggle(id) {
      const todo = find(id)
      if (todo) todo.complete = !todo.complete
    },
    remove(id) {
      if (!find(id)) return false
      todos = todos.filter((todo) => todo.id !== id)
      return true
    },
    list() {
      return todos.map((todo) => ({ ...todo }))
    },
  }
}
