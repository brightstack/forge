import { expect, test } from "bun:test";
import { TodoList } from "./app.js";

test("adds, completes, reopens, and deletes a task", () => {
  const todos = new TodoList();
  const task = todos.add("Ship the Todo app");

  expect(todos.items).toEqual([{ id: 1, description: "Ship the Todo app", completed: false }]);

  todos.toggle(task.id);
  expect(todos.items[0].completed).toBe(true);

  todos.toggle(task.id);
  expect(todos.items[0].completed).toBe(false);

  todos.remove(task.id);
  expect(todos.items).toEqual([]);
});
