export function addTask(tasks, description, id = crypto.randomUUID()) {
  return [...tasks, { id, description: description.trim(), completed: false }]
}

export function toggleTask(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task,
  )
}

export function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id)
}
