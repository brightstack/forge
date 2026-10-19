import { createHash } from 'node:crypto'
import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, join, resolve } from 'node:path'
import { parseDocument } from 'yaml'
import { ForgeError } from './errors.ts'

/** The parent of this repository's new loops. Resolving it never creates directories. */
export function loops_path(repo: string, home = homedir()): string {
  const root = realpathSync(repo)
  const configPath = join(root, 'forge.yml')
  if (existsSync(configPath)) {
    const document = parseDocument(readFileSync(configPath, 'utf8'), { uniqueKeys: true })
    if (document.errors.length) throw new ForgeError(`invalid forge.yml: ${document.errors[0]?.message}`)
    const config: unknown = document.toJS()
    if (!config || typeof config !== 'object' || Array.isArray(config)) throw new ForgeError('forge.yml must be a mapping')
    const configured = (config as Record<string, unknown>).loopsPath
    if (configured !== undefined) {
      if (typeof configured !== 'string' || !configured.trim()) throw new ForgeError('forge.yml loopsPath must be a nonempty path')
      if (configured === '~') return home
      if (configured.startsWith('~/')) return resolve(home, configured.slice(2))
      // ponytail: resolve already handles both relative and absolute paths.
      return resolve(root, configured)
    }
  }
  const key = `${basename(root)}-${createHash('sha256').update(root).digest('hex').slice(0, 12)}`
  return join(home, '.forge/repos', key, 'loops')
}
