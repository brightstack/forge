import { describe, expect, test } from "bun:test";

import {
  STORAGE_KEY,
  addTodo,
  deleteTodo,
  readTodos,
  saveTodos,
  toggleTodo,
} from "./todo.js";

describe("todo state", () => {
  test("adds trimmed incomplete todos in order with unique IDs", () => {
    const ids = ["todo-1", "todo-2"];
    let todos = addTodo([], "  Write the update  ", () => ids.shift());
    todos = addTodo(todos, "Send it", () => ids.shift());

    expect(todos).toEqual([
      { id: "todo-1", text: "Write the update", completed: false },
      { id: "todo-2", text: "Send it", completed: false },
    ]);
    expect(new Set(todos.map(({ id }) => id)).size).toBe(2);
  });

  test("rejects whitespace-only text", () => {
    const todos = [];
    expect(addTodo(todos, "   ")).toBe(todos);
  });

  test("completes and reopens the intended stable ID", () => {
    const todos = [
      { id: "first", text: "First", completed: false },
      { id: "second", text: "Second", completed: false },
    ];

    const completed = toggleTodo(todos, "second");
    expect(completed.map(({ completed }) => completed)).toEqual([false, true]);
    expect(toggleTodo(completed, "second")).toEqual(todos);
  });

  test("deletes only the intended stable ID", () => {
    const todos = [
      { id: "first", text: "First", completed: false },
      { id: "second", text: "Second", completed: true },
    ];

    expect(deleteTodo(todos, "first")).toEqual([todos[1]]);
  });
});

describe("todo snapshots", () => {
  test("writes and reads one valid ordered snapshot", () => {
    let snapshot = null;
    const storage = {
      getItem: (key) => (key === STORAGE_KEY ? snapshot : null),
      setItem: (key, value) => {
        expect(key).toBe(STORAGE_KEY);
        snapshot = value;
      },
    };
    const todos = [
      { id: "first", text: "First", completed: true },
      { id: "second", text: "Second", completed: false },
    ];

    expect(saveTodos(() => storage, todos)).toBe(true);
    expect(readTodos(() => storage)).toEqual({
      todos,
      persistenceAvailable: true,
    });
  });

  test("rejects a wholly invalid snapshot without rewriting it", () => {
    let writes = 0;
    const storage = {
      getItem: () =>
        JSON.stringify([
          { id: "valid", text: "Valid", completed: false },
          { id: "invalid", text: "   ", completed: false },
        ]),
      setItem: () => {
        writes += 1;
      },
    };

    expect(readTodos(() => storage)).toEqual({
      todos: [],
      persistenceAvailable: false,
    });
    expect(writes).toBe(0);
  });

  test("turns a thrown read into an empty usable session", () => {
    const storage = {
      getItem: () => {
        throw new Error("storage unavailable");
      },
    };

    expect(readTodos(() => storage)).toEqual({
      todos: [],
      persistenceAvailable: false,
    });
  });

  test("reports a thrown write without changing memory", () => {
    const todos = [{ id: "kept", text: "Kept", completed: false }];
    const before = structuredClone(todos);
    const storage = {
      setItem: () => {
        throw new Error("storage unavailable");
      },
    };

    expect(saveTodos(() => storage, todos)).toBe(false);
    expect(todos).toEqual(before);
  });

  test("contains denied storage acquisition for reads and writes", () => {
    const todos = [{ id: "kept", text: "Kept", completed: false }];
    const before = structuredClone(todos);
    const deniedStorage = () => {
      throw new DOMException("Access denied", "SecurityError");
    };

    expect(readTodos(deniedStorage)).toEqual({
      todos: [],
      persistenceAvailable: false,
    });
    expect(saveTodos(deniedStorage, todos)).toBe(false);
    expect(todos).toEqual(before);
  });
});
