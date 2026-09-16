export function createTodoList() {
  let nextId = 1
  let tasks = []

  function getTasks() {
    return tasks.map((task) => ({ ...task }))
  }

  function add(description) {
    const normalizedDescription = description.trim()
    if (!normalizedDescription) return null

    const task = {
      id: String(nextId++),
      description: normalizedDescription,
      completed: false,
    }

    tasks = [...tasks, task]
    return { ...task }
  }

  function setCompleted(id, completed) {
    let updatedTask = null

    tasks = tasks.map((task) => {
      if (task.id !== id) return task

      updatedTask = { ...task, completed }
      return updatedTask
    })

    return updatedTask ? { ...updatedTask } : null
  }

  function remove(id) {
    const task = tasks.find((candidate) => candidate.id === id)
    if (!task) return null

    tasks = tasks.filter((candidate) => candidate.id !== id)
    return { ...task }
  }

  return Object.freeze({ add, getTasks, remove, setCompleted })
}
