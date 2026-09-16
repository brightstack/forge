export class TodoList {
  #tasks = [];
  #nextId = 1;

  get tasks() {
    return this.#tasks.map((task) => ({ ...task }));
  }

  add(description) {
    const cleanDescription = description.trim();

    if (!cleanDescription) {
      return null;
    }

    const task = {
      id: this.#nextId++,
      description: cleanDescription,
      completed: false,
    };

    this.#tasks = [task, ...this.#tasks];
    return { ...task };
  }

  toggle(id) {
    let updatedTask = null;

    this.#tasks = this.#tasks.map((task) => {
      if (task.id !== id) {
        return task;
      }

      updatedTask = { ...task, completed: !task.completed };
      return updatedTask;
    });

    return updatedTask ? { ...updatedTask } : null;
  }

  delete(id) {
    const taskCount = this.#tasks.length;
    this.#tasks = this.#tasks.filter((task) => task.id !== id);
    return this.#tasks.length !== taskCount;
  }
}
