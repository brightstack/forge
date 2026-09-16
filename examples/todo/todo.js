export const STORAGE_KEY = "forge.todo.v1";

export function addTodo(todos, text, createId = () => crypto.randomUUID()) {
  const trimmedText = text.trim();
  if (!trimmedText) return todos;

  return [
    ...todos,
    { id: createId(), text: trimmedText, completed: false },
  ];
}

export function toggleTodo(todos, id) {
  return todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo,
  );
}

export function deleteTodo(todos, id) {
  return todos.filter((todo) => todo.id !== id);
}

export function isValidSnapshot(value) {
  if (!Array.isArray(value)) return false;

  const ids = new Set();
  return value.every((todo) => {
    if (
      todo === null ||
      typeof todo !== "object" ||
      Array.isArray(todo) ||
      typeof todo.id !== "string" ||
      todo.id.length === 0 ||
      typeof todo.text !== "string" ||
      todo.text.length === 0 ||
      todo.text !== todo.text.trim() ||
      typeof todo.completed !== "boolean" ||
      ids.has(todo.id)
    ) {
      return false;
    }

    ids.add(todo.id);
    return true;
  });
}

export function readTodos(getStorage) {
  try {
    const storage = getStorage();
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { todos: [], persistenceAvailable: true };

    const todos = JSON.parse(raw);
    if (!isValidSnapshot(todos)) throw new Error("Invalid todo snapshot");

    return { todos, persistenceAvailable: true };
  } catch {
    return { todos: [], persistenceAvailable: false };
  }
}

export function saveTodos(getStorage, todos) {
  try {
    const storage = getStorage();
    storage.setItem(STORAGE_KEY, JSON.stringify(todos));
    return true;
  } catch {
    return false;
  }
}
