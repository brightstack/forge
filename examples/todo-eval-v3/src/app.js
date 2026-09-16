import { TodoList } from "./todo-list.js";

const todos = new TodoList();
const form = document.querySelector("#add-form");
const input = document.querySelector("#task-description");
const list = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const taskCount = document.querySelector("#task-count");

function render() {
  const tasks = todos.tasks;

  emptyState.hidden = tasks.length > 0;
  taskCount.textContent = tasks.length === 0 ? "No tasks" : `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
  list.replaceChildren(...tasks.map(createTask));
}

function createTask(task) {
  const item = document.createElement("li");
  item.className = "task-item";
  item.dataset.completed = String(task.completed);

  const label = document.createElement("label");
  label.className = "task-toggle";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", `${task.completed ? "Reopen" : "Complete"} ${task.description}`);
  checkbox.addEventListener("change", () => {
    const updatedTask = todos.toggle(task.id);
    item.dataset.completed = String(updatedTask.completed);
    checkbox.setAttribute("aria-label", `${updatedTask.completed ? "Reopen" : "Complete"} ${updatedTask.description}`);
  });

  const checkmark = document.createElement("span");
  checkmark.className = "checkmark";
  checkmark.setAttribute("aria-hidden", "true");

  const description = document.createElement("span");
  description.className = "task-description";
  description.textContent = task.description;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete ${task.description}`);
  deleteButton.addEventListener("click", () => {
    todos.delete(task.id);
    render();
    input.focus();
  });

  label.append(checkbox, checkmark, description);
  item.append(label, deleteButton);
  return item;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!todos.add(input.value)) {
    input.setCustomValidity("Enter a task description.");
    input.reportValidity();
    return;
  }

  input.value = "";
  render();
  input.focus();
});

input.addEventListener("input", () => input.setCustomValidity(""));

render();
