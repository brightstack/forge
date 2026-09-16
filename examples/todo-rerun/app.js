import { createTodoList } from "./todo.js";

const todos = createTodoList();
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const taskCount = document.querySelector("#task-count");

function render() {
  const tasks = todos.all();
  list.replaceChildren();
  emptyState.hidden = tasks.length > 0;
  taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;

  for (const task of tasks) {
    const item = document.createElement("li");
    item.className = `todo-item${task.complete ? " todo-item--complete" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `task-${task.id}`;
    checkbox.checked = task.complete;
    checkbox.setAttribute(
      "aria-label",
      `${task.complete ? "Mark incomplete" : "Mark complete"}: ${task.description}`,
    );
    checkbox.addEventListener("change", () => {
      todos.toggle(task.id);
      render();
    });

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = task.description;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "todo-item__delete";
    remove.textContent = "Delete";
    remove.setAttribute("aria-label", `Delete: ${task.description}`);
    remove.addEventListener("click", () => {
      todos.remove(task.id);
      render();
    });

    item.append(checkbox, label, remove);
    list.append(item);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const description = input.value.trim();
  if (!description) return;
  todos.add(description);
  input.value = "";
  render();
});

render();
