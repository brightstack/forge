import {
  addTodo,
  deleteTodo,
  readTodos,
  saveTodos,
  toggleTodo,
} from "./todo.js";

const form = document.querySelector("form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const actionStatus = document.querySelector("#action-status");
const persistenceWarning = document.querySelector("#persistence-warning");

const initial = readTodos(() => window.localStorage);
let todos = initial.todos;

function setPersistenceWarning(show) {
  persistenceWarning.hidden = !show;
}

function persist() {
  setPersistenceWarning(!saveTodos(() => window.localStorage, todos));
}

function todoCheckbox(id) {
  return document.getElementById(`todo-${id}`);
}

function render() {
  const fragment = document.createDocumentFragment();

  for (const todo of todos) {
    const item = document.createElement("li");
    item.className = "todo-item";

    const checkbox = document.createElement("input");
    checkbox.className = "todo-checkbox";
    checkbox.type = "checkbox";
    checkbox.id = `todo-${todo.id}`;
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => {
      todos = toggleTodo(todos, todo.id);
      render();
      persist();
      todoCheckbox(todo.id)?.focus();
    });

    const label = document.createElement("label");
    label.className = "todo-text";
    label.htmlFor = checkbox.id;
    label.textContent = todo.text;

    const remove = document.createElement("button");
    remove.className = "delete-button";
    remove.type = "button";
    remove.textContent = "Delete";
    remove.setAttribute("aria-label", `Delete ${todo.text}`);
    remove.addEventListener("click", () => {
      const removedIndex = todos.findIndex(({ id }) => id === todo.id);
      todos = deleteTodo(todos, todo.id);
      render();
      persist();
      actionStatus.textContent = `${todo.text} deleted.`;

      const adjacent = todos[Math.min(removedIndex, todos.length - 1)];
      (adjacent ? todoCheckbox(adjacent.id) : input).focus();
    });

    item.append(checkbox, label, remove);
    fragment.append(item);
  }

  list.replaceChildren(fragment);
  list.hidden = todos.length === 0;
  emptyState.hidden = todos.length !== 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nextTodos = addTodo(todos, input.value);
  if (nextTodos === todos) {
    input.setCustomValidity("Enter a task before adding it.");
    input.reportValidity();
    return;
  }

  todos = nextTodos;
  const addedTodo = todos.at(-1);
  input.value = "";
  render();
  persist();
  actionStatus.textContent = `${addedTodo.text} added.`;
  input.focus();
});

input.addEventListener("input", () => input.setCustomValidity(""));

setPersistenceWarning(!initial.persistenceAvailable);
render();
