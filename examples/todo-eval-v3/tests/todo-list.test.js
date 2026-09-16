import { describe, expect, test } from "bun:test";
import { TodoList } from "../src/todo-list.js";

describe("Simple Todo lifecycle", () => {
  test("AC1: adds a described task to the list", () => {
    const todos = new TodoList();

    const task = todos.add("  Prepare the demo  ");

    expect(task).toEqual({ id: 1, description: "Prepare the demo", completed: false });
    expect(todos.tasks).toEqual([task]);
  });

  test("AC2: completes and reopens a task", () => {
    const todos = new TodoList();
    const task = todos.add("Prepare the demo");

    expect(todos.toggle(task.id)?.completed).toBe(true);
    expect(todos.toggle(task.id)?.completed).toBe(false);
    expect(todos.tasks[0].completed).toBe(false);
  });

  test("AC3: deletes a task from the list", () => {
    const todos = new TodoList();
    const task = todos.add("Prepare the demo");

    expect(todos.delete(task.id)).toBe(true);
    expect(todos.tasks).toEqual([]);
  });

  test("does not add a description containing only whitespace", () => {
    const todos = new TodoList();

    expect(todos.add("   ")).toBeNull();
    expect(todos.tasks).toEqual([]);
  });
});
