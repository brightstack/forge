import { expect, test } from "bun:test";
import { createTodos } from "./todo.js";

test("adds, completes, reopens, and deletes a Todo", () => {
  const todos = createTodos();

  const todo = todos.add("Buy milk");
  expect(todos.list()).toEqual([{ id: todo.id, description: "Buy milk", completed: false }]);

  todos.toggle(todo.id);
  expect(todos.list()[0].completed).toBe(true);
  todos.toggle(todo.id);
  expect(todos.list()[0].completed).toBe(false);

  todos.remove(todo.id);
  expect(todos.list()).toEqual([]);
});
