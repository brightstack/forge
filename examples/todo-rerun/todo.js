export function createTodoList() {
  const tasks = [];
  let nextId = 1;

  return {
    add(description) {
      const task = { id: nextId++, description, complete: false };
      tasks.push(task);
      return task;
    },

    toggle(id) {
      const task = tasks.find((item) => item.id === id);
      if (task) task.complete = !task.complete;
    },

    remove(id) {
      const index = tasks.findIndex((item) => item.id === id);
      if (index !== -1) tasks.splice(index, 1);
    },

    all() {
      return tasks;
    },
  };
}
