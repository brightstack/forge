import { realpathSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { ForgeError } from './errors.ts'
import { contained_path } from './records.ts'

export function serve_artifacts(directory: string, port: number) {
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new ForgeError('port must be an integer from 0 to 65535')
  }
  const root = contained_path(directory, '.', { must_exist: true })
  if (!statSync(root).isDirectory()) throw new ForgeError('serve requires an artifact directory')

  const server = Bun.serve({
    hostname: '127.0.0.1',
    port,
    reusePort: false,
    // A preview remains an ordinary foreground process, including in a compiled CLI.
    development: false,
    fetch(request, bound) {
      if (request.headers.get('host') !== `127.0.0.1:${bound.port}`) {
        return new Response('Forbidden', { status: 403 })
      }
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } })
      }
      const url = new URL(request.url)
      let pathname: string
      try {
        pathname = decodeURIComponent(url.pathname)
      } catch {
        return new Response('Invalid path', { status: 400 })
      }
      if (pathname.includes('\0') || pathname.includes('\\')) {
        return new Response('Invalid path', { status: 400 })
      }
      if (pathname.split('/').some(part => part.startsWith('.'))) {
        return new Response('Not found', { status: 404 })
      }
      try {
        // Pin the selected root if it is replaced by a symlink during iteration.
        if (realpathSync(root) !== root) return new Response('Not found', { status: 404 })
        let target = contained_path(root, `.${pathname}`, { must_exist: true })
        let status = statSync(target)
        if (status.isDirectory()) {
          if (!url.pathname.endsWith('/')) {
            url.pathname += '/'
            return new Response(null, { status: 308, headers: { Location: url.toString() } })
          }
          target = contained_path(root, join(target, 'index.html'), { must_exist: true })
          status = statSync(target)
        }
        if (!status.isFile()) return new Response('Not found', { status: 404 })
        const file = Bun.file(target)
        const headers: Record<string, string> = {
          'Content-Type': file.type || 'application/octet-stream',
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        }
        if (request.method === 'HEAD') {
          headers['Content-Length'] = String(status.size)
          return new Response(null, { headers })
        }
        return new Response(file, { headers })
      } catch {
        // Missing, unreadable, and out-of-root assets do not disclose local paths.
        return new Response('Not found', { status: 404 })
      }
    },
    error() {
      return new Response('Unable to read artifact', { status: 500 })
    },
  })
  return { server, root }
}
