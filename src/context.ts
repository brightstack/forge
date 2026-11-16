import { existsSync, readdirSync, realpathSync, statSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'
import { type ModelRole, resolve_configuration } from './roots.ts'

const ROLES: ModelRole[] = ['main', 'worker', 'reviewer', 'judge']
const MAPS = ['AGENTS.md', 'CLAUDE.md']
const HOST_LOAD = 'A host may load the root AGENTS.md or CLAUDE.md by itself; under this harness those files do not route Forge work.'

const STANDARDS_RULE = 'Open only the standards that govern the work; nearer folders refine farther ones.'

type RoleDefaults = { model?: string; effort?: string; sources: Record<string, string> }

export type ForgeContext = {
  repo: string
  harness: { root: string; entry?: string; configured: boolean; maps: string[]; rule: string }
  standards: Array<{ path: string; files: string[] }>
  storage_path: string
  loops_path: string
  engine?: string
  models?: Record<ModelRole, RoleDefaults>
  warnings: string[]
}

function maps_in(directory: string): string[] {
  return MAPS.map((name) => join(directory, name)).filter((path) => existsSync(path) && statSync(path).isFile())
}

/** Every directory from the enclosing Git root, or the filesystem root, down to the target. */
function directories_to(target: string): string[] {
  const chain = [target]
  for (let directory = target; !existsSync(join(directory, '.git')) && dirname(directory) !== directory;) {
    directory = dirname(directory)
    chain.unshift(directory)
  }
  return chain
}

/** A standards folder and every file under it, so agents can pick by name without reading them all. */
function standards_in(directory: string, warnings: string[]): Array<{ path: string; files: string[] }> {
  if (!existsSync(directory) || !statSync(directory).isDirectory()) return []
  let names: string[]
  try {
    names = readdirSync(directory, { recursive: true, encoding: 'utf8' })
  } catch (error) {
    warnings.push(`could not list standards folder ${directory}: ${(error as Error).message}`)
    return []
  }
  const files = names
    .filter((name) => !name.split(sep).some((part) => part.startsWith('.') || part === 'node_modules'))
    .filter((name) => statSync(join(directory, name), { throwIfNoEntry: false })?.isFile() ?? false)
    .map((name) => name.split(sep).join('/'))
    .sort()
  return files.length ? [{ path: directory, files }] : []
}

function installed(directory: string): boolean {
  return existsSync(join(directory, '.forge/references')) || existsSync(join(directory, 'forge.yml'))
}

/** The nearest installed directory from the working directory up to, but excluding, the target. */
function installed_below(target: string, cwd: string): string | undefined {
  if (!cwd.startsWith(`${target}/`)) return undefined
  for (let directory = cwd; directory !== target; directory = dirname(directory)) {
    if (installed(directory)) return directory
  }
  return undefined
}

/** The nearest installed directory at or above `start`, stopping at the enclosing Git root or the filesystem root. */
export function nearest_installed(start: string): string | undefined {
  for (let directory = start; ; directory = dirname(directory)) {
    if (installed(directory)) return directory
    if (existsSync(join(directory, '.git')) || dirname(directory) === directory) return undefined
  }
}

function installed_above(target: string): string | undefined {
  return existsSync(join(target, '.git')) || dirname(target) === target ? undefined : nearest_installed(dirname(target))
}

/** Apply the application's configuration once, so skills follow its result instead of reading forge.yml. */
export function compile_context(repo: string, options: { engine?: string; home?: string } = {}): ForgeContext {
  const resolved = resolve_configuration(repo, { home: options.home })
  const configured = resolved.harness_path !== resolved.repo
  const root = resolved.harness_path
  const own = existsSync(root) && statSync(root).isFile() ? [root] : existsSync(root) ? maps_in(root) : []
  const entry = own[0]
  const chain = configured ? [] : directories_to(resolved.repo)
  const maps = configured ? own : chain.flatMap(maps_in)
  const base = existsSync(root) && statSync(root).isFile() ? dirname(root) : root
  const warnings = [...resolved.warnings]
  const standards = configured
    ? standards_in(join(base, 'standards'), warnings)
    : chain.flatMap((directory) => standards_in(join(directory, 'docs/standards'), warnings))
  if (!installed(resolved.repo)) {
    const below = installed_below(resolved.repo, realpathSync(process.cwd())) ?? installed_above(resolved.repo)
    warnings.push(`Forge is not installed or configured at this target (no .forge/references/ or forge.yml); point --repo at the application that has it${below ? `: ${below}` : ''}`)
  }
  if (configured && existsSync(root) && !entry) warnings.push(`harness has no AGENTS.md or CLAUDE.md: ${root}`)
  if (!configured && !maps.length) warnings.push(`no AGENTS.md or CLAUDE.md from ${chain[0]} to ${resolved.repo}`)

  const rule = configured
    ? entry
      ? `Follow only the sources these files route to. Do not read the application root AGENTS.md or CLAUDE.md, maps in its parent directories, project rules, or nested instruction maps unless this harness routes to them. ${HOST_LOAD}`
      : 'The configured harness is missing its map. Report this gap; do not fall back to the application root maps without authorization.'
    : maps.length
      ? 'Nearer maps refine farther ones. Also read the project rules these maps route to that govern the work. Before working on an owned or inspected path below the target, read the AGENTS.md and CLAUDE.md in each directory on the way to it.'
      : 'Read relevant project rules and nested instruction maps for each owned or inspected path, and record NOT_FOUND for any missing standard.'

  const result: ForgeContext = {
    repo: resolved.repo,
    harness: { root, ...(entry ? { entry } : {}), configured, maps, rule },
    standards,
    storage_path: resolved.storage_path,
    loops_path: resolved.loops_path,
    warnings,
  }
  if (options.engine !== undefined) {
    result.engine = options.engine
    result.models = Object.fromEntries(ROLES.map((role) => {
      const { model, effort, sources } = resolve_configuration(repo, { home: options.home, engine: options.engine, role })
      return [role, { ...(model ? { model } : {}), ...(effort ? { effort } : {}), sources: sources! }]
    })) as Record<ModelRole, RoleDefaults>
  }
  return result
}

export function render_context(context: ForgeContext): string {
  const lines = [
    '# Forge context',
    '',
    `Target: ${context.repo}`,
    `Harness: ${context.harness.entry ?? context.harness.root} (${context.harness.configured ? 'forge.yml harness.path' : 'application root'})`,
    'Read now:',
    ...(context.harness.maps.length ? context.harness.maps.map((path, index) => `${index + 1}. ${path}`) : ['none']),
    `Then: ${context.harness.rule}`,
  ]
  if (context.standards.length) {
    lines.push(`Standards (${STANDARDS_RULE}):`)
    for (const { path, files } of context.standards) lines.push(`- ${path}/`, ...files.map((file) => `  - ${file}`))
  }
  lines.push(`Loop storage: ${context.loops_path}`)
  if (context.engine !== undefined && context.models) {
    lines.push(`Model defaults for ${context.engine}:`)
    for (const role of ROLES) {
      const { model, effort, sources } = context.models[role]
      const field = (name: 'model' | 'effort', value?: string) => `${name} ${value ?? 'discretion'}${value ? ` (${sources[name]})` : ''}`
      lines.push(`- ${role}: ${field('model', model)}, ${field('effort', effort)}`)
    }
  }
  lines.push(context.warnings.length ? `Warnings:\n${context.warnings.map((warning) => `- ${warning}`).join('\n')}` : 'Warnings: none')
  lines.push('', 'Carry this output into every native assignment.')
  return lines.join('\n')
}
