import { createHash } from 'node:crypto'
import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { parseDocument } from 'yaml'
import { ForgeError } from './errors.ts'

type Mapping = Record<string, unknown>
export type ModelRole = 'main' | 'worker' | 'reviewer' | 'judge'
const notices = new Set<string>()
const roles: ModelRole[] = ['main', 'worker', 'reviewer', 'judge']

function mapping(value: unknown, name: string): Mapping {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ForgeError(`${name} must be a mapping`)
  return value as Mapping
}

function optionalMapping(parent: Mapping, key: string, name: string): Mapping {
  return parent[key] === undefined ? {} : mapping(parent[key], name)
}

function optionalString(parent: Mapping, key: string, name: string): string | undefined {
  const value = parent[key]
  if (value === undefined) return undefined
  if (typeof value !== 'string' || !value.trim()) throw new ForgeError(`${name} must be a nonempty string`)
  return value
}

function configuration(root: string): Mapping {
  const path = join(root, 'forge.yml')
  if (!existsSync(path)) return {}
  const document = parseDocument(readFileSync(path, 'utf8'), { uniqueKeys: true })
  if (document.errors.length) throw new ForgeError(`invalid forge.yml: ${document.errors[0]?.message}`)
  const config = mapping(document.toJS(), 'forge.yml')
  const storage = optionalMapping(config, 'storage', 'forge.yml storage')
  optionalString(storage, 'path', 'forge.yml storage.path')
  const loops = optionalMapping(storage, 'loops', 'forge.yml storage.loops')
  optionalString(loops, 'path', 'forge.yml storage.loops.path')
  optionalString(config, 'loopsPath', 'forge.yml loopsPath')
  optionalString(optionalMapping(config, 'harness', 'forge.yml harness'), 'path', 'forge.yml harness.path')
  const engines = optionalMapping(config, 'engines', 'forge.yml engines')
  for (const [engine, value] of Object.entries(engines)) {
    const models = optionalMapping(mapping(value, `forge.yml engines.${engine}`), 'models', `forge.yml engines.${engine}.models`)
    for (const role of roles) {
      const fields = optionalMapping(models, role, `forge.yml engines.${engine}.models.${role}`)
      for (const field of ['model', 'effort']) optionalString(fields, field, `forge.yml engines.${engine}.models.${role}.${field}`)
    }
  }
  return config
}

function pathFrom(base: string, value: string, home: string): string {
  if (value === '~') return home
  if (value.startsWith('~/')) return resolve(home, value.slice(2))
  return resolve(base, value)
}

/** Normalize existing ancestors too, without creating a destination. */
function normalized(path: string): string {
  let ancestor = path
  const missing: string[] = []
  while (!existsSync(ancestor)) {
    missing.unshift(basename(ancestor))
    ancestor = dirname(ancestor)
  }
  return resolve(realpathSync(ancestor), ...missing)
}

export function former_home_loops_path(repo: string, home = homedir()): string {
  const root = realpathSync(repo)
  const key = `${basename(root)}-${createHash('sha256').update(root).digest('hex').slice(0, 12)}`
  return join(home, '.forge/repos', key, 'loops')
}

/** Resolve only application-root settings. Inspection never creates directories. */
export function resolve_configuration(repo: string, options: { home?: string; engine?: string; role?: string; model?: string; effort?: string } = {}) {
  const root = realpathSync(repo)
  const home = options.home ?? homedir()
  const config = configuration(root)
  const storage = optionalMapping(config, 'storage', 'forge.yml storage')
  const loops = optionalMapping(storage, 'loops', 'forge.yml storage.loops')
  const storagePath = pathFrom(root, (storage.path as string | undefined) ?? '.forge', home)
  const selected = pathFrom(storagePath, (loops.path as string | undefined) ?? 'loops', home)
  const legacy = config.loopsPath as string | undefined
  const alias = legacy === undefined ? undefined : pathFrom(root, legacy, home)
  if (alias !== undefined && config.storage !== undefined && normalized(alias) !== normalized(selected)) {
    throw new ForgeError(`forge.yml loopsPath conflicts with storage: ${alias} != ${selected}`)
  }
  const loopsPath = alias ?? selected
  const harnessPath = pathFrom(root, (optionalMapping(config, 'harness', 'forge.yml harness').path as string | undefined) ?? '.', home)
  const known = [loopsPath, join(root, '.forge/loops'), former_home_loops_path(root, home)]
  const seen = new Set<string>()
  const knownPaths = known.filter((path) => {
    const key = normalized(path)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  const result: {
    repo: string; harness_path: string; storage_path: string; loops_path: string; known_loop_paths: string[]; warnings: string[];
    engine?: string; role?: ModelRole; model?: string; effort?: string; sources?: Record<string, string>
  } = {
    repo: root, harness_path: harnessPath, storage_path: storagePath, loops_path: loopsPath, known_loop_paths: knownPaths,
    warnings: alias === undefined ? [] : ['forge.yml loopsPath is deprecated; use storage.loops.path'],
  }
  if (!existsSync(harnessPath)) result.warnings.push(`forge.yml harness.path does not exist: ${harnessPath}`)
  if (options.engine !== undefined) {
    if (!options.engine.trim()) throw new ForgeError('engine must be nonempty')
    const role = options.role ?? 'main'
    if (!roles.includes(role as ModelRole)) throw new ForgeError(`unknown model role: ${role}`)
    const models = ((config.engines as Mapping | undefined)?.[options.engine] as Mapping | undefined)?.models as Mapping | undefined
    result.engine = options.engine
    result.role = role as ModelRole
    result.sources = {}
    for (const field of ['model', 'effort'] as const) {
      const explicit = optionalString(options, field, field)
      const selectedRole = (models?.[role] as Mapping | undefined)?.[field] as string | undefined
      const main = (models?.main as Mapping | undefined)?.[field] as string | undefined
      result[field] = explicit ?? selectedRole ?? main
      result.sources[field] = explicit !== undefined ? 'user'
        : selectedRole !== undefined ? `engines.${options.engine}.models.${role}.${field}`
        : main !== undefined ? `engines.${options.engine}.models.main.${field}` : 'discretion'
    }
  } else if (options.role !== undefined || options.model !== undefined || options.effort !== undefined) {
    throw new ForgeError('--role, --model and --effort require --engine')
  }
  return result
}

/** The parent of this repository's new loops. Resolving it never creates directories. */
export function loops_path(repo: string, home = homedir()): string {
  const result = resolve_configuration(repo, { home })
  for (const warning of result.warnings) {
    const notice = `${result.repo}\0${warning}`
    if (!notices.has(notice)) { console.error(`forge: ${warning}`); notices.add(notice) }
  }
  return result.loops_path
}

export function known_loop_paths(repo: string, home = homedir()): string[] {
  return resolve_configuration(repo, { home }).known_loop_paths
}
