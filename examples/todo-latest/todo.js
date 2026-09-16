export function createTodos() {
  const todos = [];
  let nextId = 1;

  return {
    add(description) {
      const todo = { id: nextId++, description, completed: false };
      todos.push(todo);
      return todo;
    },
    toggle(id) {
      const todo = todos.find((item) => item.id === id);
      if (todo) todo.completed = !todo.completed;
    },
    remove(id) {
      const index = todos.findIndex((item) => item.id === id);
      if (index !== -1) todos.splice(index, 1);
    },
    list() {
      return todos;
    },
  };
}
