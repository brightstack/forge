export class TodoList {
  #nextId = 1;
  #items = [];

  get items() {
    return this.#items;
  }

  add(description) {
    const task = { id: this.#nextId++, description: description.trim(), completed: false };
    this.#items.push(task);
    return task;
  }

  toggle(id) {
    const task = this.#items.find((item) => item.id === id);
    if (task) task.completed = !task.completed;
  }

  remove(id) {
    this.#items = this.#items.filter((item) => item.id !== id);
  }
}

if (typeof document !== "undefined") {
const todos = new TodoList();
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const count = document.querySelector("#task-count");

function render() {
  list.replaceChildren(...todos.items.map((task) => {
    const item = document.createElement("li");
    item.className = `task${task.completed ? " task--complete" : ""}`;

    const toggle = document.createElement("button");
    toggle.className = "toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", `${task.completed ? "Reopen" : "Complete"} ${task.description}`);
    toggle.setAttribute("aria-pressed", String(task.completed));
    toggle.textContent = task.completed ? "✓" : "";
    toggle.addEventListener("click", () => {
      todos.toggle(task.id);
      render();
    });

    const description = document.createElement("span");
    description.textContent = task.description;

    const remove = document.createElement("button");
    remove.className = "delete";
    remove.type = "button";
    remove.setAttribute("aria-label", `Delete ${task.description}`);
    remove.textContent = "Delete";
    remove.addEventListener("click", () => {
      todos.remove(task.id);
      render();
    });

    item.append(toggle, description, remove);
    return item;
  }));

  count.textContent = `${todos.items.filter((task) => !task.completed).length} open`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!input.value.trim()) return;
  todos.add(input.value);
  input.value = "";
  render();
  input.focus();
});

render();
}
