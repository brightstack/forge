import { describe, expect, test } from "bun:test";
import { createTodoList } from "./todo.js";

describe("Todo list", () => {
  test("adds a described task", () => {
    const todos = createTodoList();

    todos.add("Book dentist appointment");

    expect(todos.all()).toEqual([
      { id: 1, description: "Book dentist appointment", complete: false },
    ]);
  });

  test("marks a task complete and incomplete", () => {
    const todos = createTodoList();
    const task = todos.add("Send the invoice");

    todos.toggle(task.id);
    expect(todos.all()[0].complete).toBe(true);

    todos.toggle(task.id);
    expect(todos.all()[0].complete).toBe(false);
  });

  test("deletes a task", () => {
    const todos = createTodoList();
    const task = todos.add("Water the plants");

    todos.remove(task.id);

    expect(todos.all()).toEqual([]);
  });
});
