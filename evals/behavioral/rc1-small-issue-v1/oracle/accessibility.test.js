import { expect, test } from 'bun:test'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const { renderTodo } = await import(pathToFileURL(path.join(process.cwd(), 'src/view.js')))

test('delete output exposes the task-specific accessible name', () => {
  const html = renderTodo({ id: 1, description: 'Ship <safe>', complete: false })
  expect(html).toContain('aria-label="Delete Ship &lt;safe&gt;"')
  expect(html).toContain('>Delete</button>')
})
