import { describe, expect, test } from 'bun:test'
import { createRequestHandler } from '../server.js'

describe('local static server', () => {
  const handleRequest = createRequestHandler()

  test('serves the browser app and its known assets', async () => {
    const indexResponse = await handleRequest(new Request('http://localhost/'))
    const scriptResponse = await handleRequest(new Request('http://localhost/src/app.js'))

    expect(indexResponse.status).toBe(200)
    expect(await indexResponse.text()).toContain('id="todo-form"')
    expect(scriptResponse.status).toBe(200)
    expect(scriptResponse.headers.get('content-type')).toContain('text/javascript')
  })

  test('does not expose arbitrary local files', async () => {
    const unknownResponse = await handleRequest(new Request('http://localhost/server.js'))
    const traversalResponse = await handleRequest(
      new Request('http://localhost/src/%2e%2e/server.js'),
    )

    expect(unknownResponse.status).toBe(404)
    expect(traversalResponse.status).toBe(404)
  })

  test('rejects unsupported methods', async () => {
    const response = await handleRequest(
      new Request('http://localhost/', {
        method: 'POST',
      }),
    )

    expect(response.status).toBe(405)
    expect(response.headers.get('allow')).toBe('GET')
  })
})
