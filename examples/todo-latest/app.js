import { createTodos } from "./todo.js";

const todos = createTodos();
const form = document.querySelector("#add-todo");
const list = document.querySelector("#todo-list");

function render() {
  list.replaceChildren(
    ...todos.list().map((todo) => {
      const item = document.createElement("li");
      const toggle = document.createElement("input");
      const description = document.createElement("span");
      const remove = document.createElement("button");

      toggle.type = "checkbox";
      toggle.checked = todo.completed;
      toggle.setAttribute("aria-label", `Mark ${todo.description} complete`);
      toggle.addEventListener("change", () => {
        todos.toggle(todo.id);
        render();
      });

      description.textContent = todo.description;
      remove.type = "button";
      remove.textContent = "Delete";
      remove.addEventListener("click", () => {
        todos.remove(todo.id);
        render();
      });

      item.append(toggle, description, remove);
      return item;
    }),
  );
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const description = new FormData(form).get("description");
  todos.add(description);
  form.reset();
  render();
});
