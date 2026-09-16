import { expect, test } from 'bun:test'
import { renderTodos } from '../src/view.js'

test('view renders task text and state', () => {
  const html = renderTodos([{ id: 7, description: 'Write <brief>', complete: true }])
  expect(html).toContain('Write &lt;brief&gt;')
  expect(html).toContain('is-complete')
  expect(html).toContain('data-action="delete"')
})
