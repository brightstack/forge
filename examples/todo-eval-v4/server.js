const staticRoutes = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/src/app.js', ['src/app.js', 'text/javascript; charset=utf-8']],
  ['/src/todo-list.js', ['src/todo-list.js', 'text/javascript; charset=utf-8']],
])

const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'",
  'X-Content-Type-Options': 'nosniff',
}

export function createRequestHandler(baseUrl = import.meta.url) {
  return async function handleRequest(request) {
    if (request.method !== 'GET') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { ...securityHeaders, Allow: 'GET' },
      })
    }

    const pathname = new URL(request.url).pathname

    if (pathname === '/health') {
      return new Response('ok', { headers: securityHeaders })
    }

    const route = staticRoutes.get(pathname)
    if (!route) {
      return new Response('Not found', { status: 404, headers: securityHeaders })
    }

    const [relativePath, contentType] = route
    return new Response(Bun.file(new URL(relativePath, baseUrl)), {
      headers: {
        ...securityHeaders,
        'Cache-Control': 'no-store',
        'Content-Type': contentType,
      },
    })
  }
}

export function startServer({ hostname = '127.0.0.1', port = 4173 } = {}) {
  return Bun.serve({
    hostname,
    port,
    fetch: createRequestHandler(),
  })
}

if (import.meta.main) {
  const server = startServer({
    port: Number(Bun.env.PORT ?? 4173),
  })
  console.log(`Simple Todo running at ${server.url}`)
}
