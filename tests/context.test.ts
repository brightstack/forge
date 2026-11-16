import { afterEach, expect, test } from 'bun:test'
import { chmodSync, mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { spawnSync } from 'node:child_process'

const command = process.env.FORGE_TEST_BINARY
  ? [process.env.FORGE_TEST_BINARY]
  : [process.execPath, join(import.meta.dir, '../src/cli.ts')]
let repo = ''

afterEach(() => {
  if (repo) rmSync(repo, { recursive: true, force: true })
  repo = ''
})

function write(path: string, content: string) {
  mkdirSync(dirname(join(repo, path)), { recursive: true })
  writeFileSync(join(repo, path), content)
}

function context(...args: string[]): string {
  const target = args[0]?.startsWith('/') ? args.shift()! : repo
  const cwd = args[0]?.startsWith('cwd=') ? args.shift()!.slice(4) : undefined
  const result = spawnSync(command[0]!, [...command.slice(1), 'context', ...args, '--repo', target], { encoding: 'utf8', cwd })
  expect(result.status, result.stderr).toBe(0)
  return result.stdout
}

function json(...args: string[]) {
  return JSON.parse(context('--json', ...args)) as {
    harness: { root: string; entry?: string; configured: boolean; maps: string[]; rule: string }
    standards: Array<{ path: string; files: string[] }>
    loops_path: string
    models?: Record<string, { model?: string; effort?: string; sources: Record<string, string> }>
    warnings: string[]
  }
}

test('context defaults to the application root harness and lists both of its maps', () => {
  repo = realpathSync(mkdtempSync(join(tmpdir(), 'forge-context-')))
  write('.git/HEAD', 'ref: refs/heads/main\n')
  write('.forge/references/cli.md', '\n')
  write('AGENTS.md', '# root\n')
  write('CLAUDE.md', '# claude\n')
  const compiled = json()
  expect(compiled.harness).toMatchObject({ root: repo, entry: join(repo, 'AGENTS.md'), configured: false })
  expect(compiled.harness.maps).toEqual([join(repo, 'AGENTS.md'), join(repo, 'CLAUDE.md')])
  expect(compiled.loops_path).toBe(join(repo, '.forge/loops'))
  expect(compiled.warnings).toEqual([])
  const text = context()
  expect(text).toContain(`Harness: ${join(repo, 'AGENTS.md')} (application root)`)
  expect(text).toContain(`Read now:\n1. ${join(repo, 'AGENTS.md')}\n2. ${join(repo, 'CLAUDE.md')}\nThen: `)
})

test('context lists maps from the Git root down to a nested target, outermost first', () => {
  repo = realpathSync(mkdtempSync(join(tmpdir(), 'forge-context-')))
  write('AGENTS.md', '# outside the checkout\n')
  write('mono/.git/HEAD', 'ref: refs/heads/main\n')
  write('mono/AGENTS.md', '# root\n')
  write('mono/apps/CLAUDE.md', '# apps\n')
  write('mono/apps/web/AGENTS.md', '# web\n')
  write('mono/apps/web/.forge/references/cli.md', '\n')
  write('mono/apps/api/AGENTS.md', '# sibling\n')
  const web = join(repo, 'mono/apps/web')
  const expected = [join(repo, 'mono/AGENTS.md'), join(repo, 'mono/apps/CLAUDE.md'), join(web, 'AGENTS.md')]
  expect(JSON.parse(context(web, '--json')).harness.maps).toEqual(expected)
  expect(context(web)).toContain(`Read now:\n${expected.map((path, index) => `${index + 1}. ${path}`).join('\n')}\nThen: `)

  rmSync(join(web, 'AGENTS.md'))
  const bare = JSON.parse(context(web, '--json'))
  expect(bare.harness.entry).toBeUndefined()
  expect(bare.harness.maps).toEqual(expected.slice(0, 2))
  expect(bare.warnings).toEqual([])
})

test('context without any map from the Git root warns and asks for NOT_FOUND', () => {
  repo = realpathSync(mkdtempSync(join(tmpdir(), 'forge-context-')))
  write('.git/HEAD', 'ref: refs/heads/main\n')
  write('forge.yml', '{}\n')
  write('src/index.ts', '\n')
  const compiled = json()
  expect(compiled.harness.maps).toEqual([])
  expect(compiled.harness.rule).toContain('NOT_FOUND')
  expect(compiled.warnings).toEqual([`no AGENTS.md or CLAUDE.md from ${repo} to ${repo}`])
  expect(context()).toContain('Read now:\nnone\n')
})

test('context compiles a configured harness root, file entry, and engine defaults', () => {
  repo = realpathSync(mkdtempSync(join(tmpdir(), 'forge-context-')))
  write('.git/HEAD', 'ref: refs/heads/main\n')
  write('AGENTS.md', '# messy\n')
  write('docs/factory/CLAUDE.md', '# curated\n')
  write('forge.yml', 'harness: {path: docs/factory}\nengines: {codex: {models: {main: {model: m1, effort: high}, worker: {effort: low}}}}\n')
  const compiled = json('--engine', 'codex')
  expect(compiled.harness).toMatchObject({ root: join(repo, 'docs/factory'), entry: join(repo, 'docs/factory/CLAUDE.md'), configured: true })
  expect(compiled.harness.maps).toEqual([join(repo, 'docs/factory/CLAUDE.md')])
  expect(compiled.harness.rule).toContain('Do not read the application root AGENTS.md')
  expect(compiled.models?.worker).toEqual({ model: 'm1', effort: 'low', sources: { model: 'engines.codex.models.main.model', effort: 'engines.codex.models.worker.effort' } })
  expect(compiled.models?.judge).toMatchObject({ model: 'm1', effort: 'high' })
  const text = context('--engine', 'codex')
  expect(text).toContain('(forge.yml harness.path)')
  expect(text).toContain('- worker: model m1 (engines.codex.models.main.model), effort low (engines.codex.models.worker.effort)')

  write('forge.yml', 'harness: {path: docs/factory/CLAUDE.md}\n')
  expect(json().harness.entry).toBe(join(repo, 'docs/factory/CLAUDE.md'))
})

test('context reports a missing configured harness without falling back to the root', () => {
  repo = realpathSync(mkdtempSync(join(tmpdir(), 'forge-context-')))
  write('AGENTS.md', '# root\n')
  write('forge.yml', 'harness: {path: docs/missing}\n')
  const compiled = json()
  expect(compiled.harness.entry).toBeUndefined()
  expect(compiled.harness.rule).toContain('do not fall back')
  expect(compiled.warnings).toEqual([`forge.yml harness.path does not exist: ${join(repo, 'docs/missing')}`])

  mkdirSync(join(repo, 'docs/empty'), { recursive: true })
  write('forge.yml', 'harness: {path: docs/empty}\n')
  expect(json().warnings).toEqual([`harness has no AGENTS.md or CLAUDE.md: ${join(repo, 'docs/empty')}`])
})

test('a curated harness under a nested target lists only its own maps, never ancestors', () => {
  repo = realpathSync(mkdtempSync(join(tmpdir(), 'forge-context-')))
  write('.git/HEAD', 'ref: refs/heads/main\n')
  write('AGENTS.md', '# root\n')
  write('apps/web/AGENTS.md', '# web\n')
  write('apps/web/factory/AGENTS.md', '# curated\n')
  write('apps/web/factory/CLAUDE.md', '# curated claude\n')
  write('apps/web/forge.yml', 'harness: {path: factory}\n')
  const web = join(repo, 'apps/web')
  const compiled = JSON.parse(context(web, '--json'))
  expect(compiled.harness.maps).toEqual([join(web, 'factory/AGENTS.md'), join(web, 'factory/CLAUDE.md')])
  expect(compiled.harness.rule).toContain('do not route Forge work')
  expect(context(web)).not.toContain(join(repo, 'AGENTS.md'))
})

test('context warns when the target has no Forge installation and names the installed app below it', () => {
  repo = realpathSync(mkdtempSync(join(tmpdir(), 'forge-context-')))
  write('.git/HEAD', 'ref: refs/heads/main\n')
  write('AGENTS.md', '# root\n')
  write('apps/web/.forge/references/cli.md', '\n')
  write('apps/web/src/index.ts', '\n')
  const missing = 'Forge is not installed or configured at this target (no .forge/references/ or forge.yml); point --repo at the application that has it'
  expect(json().warnings).toEqual([missing])
  expect(JSON.parse(context(repo, `cwd=${join(repo, 'apps/web/src')}`, '--json')).warnings).toEqual([`${missing}: ${join(repo, 'apps/web')}`])
  expect(JSON.parse(context(join(repo, 'apps/web'), `cwd=${join(repo, 'apps/web/src')}`, '--json')).warnings).toEqual([])
})

test('context with --repo below an installed application names that application', () => {
  repo = realpathSync(mkdtempSync(join(tmpdir(), 'forge-context-')))
  write('.git/HEAD', 'ref: refs/heads/main\n')
  write('forge.yml', '{}\n')
  write('apps/web/.forge/references/cli.md', '\n')
  write('apps/web/src/deep/index.ts', '\n')
  const deep = join(repo, 'apps/web/src/deep')
  const result = spawnSync(command[0]!, [...command.slice(1), 'context', '--json', '--repo', deep], { encoding: 'utf8', cwd: deep })
  expect(result.status, result.stderr).toBe(0)
  expect(JSON.parse(result.stdout).warnings).toContain(`Forge is not installed or configured at this target (no .forge/references/ or forge.yml); point --repo at the application that has it: ${join(repo, 'apps/web')}`)
})

test('without --repo, commands target the nearest installed application at or above the working directory', () => {
  repo = realpathSync(mkdtempSync(join(tmpdir(), 'forge-context-')))
  write('.git/HEAD', 'ref: refs/heads/main\n')
  write('AGENTS.md', '# root\n')
  write('apps/web/.forge/references/cli.md', '\n')
  write('apps/web/src/deep/index.ts', '\n')
  write('fresh/.git/HEAD', 'ref: refs/heads/main\n')
  write('fresh/src/index.ts', '\n')
  const web = join(repo, 'apps/web')
  const run = (cwd: string, ...args: string[]) => {
    const result = spawnSync(command[0]!, [...command.slice(1), ...args], { encoding: 'utf8', cwd })
    expect(result.status, result.stderr).toBe(0)
    return result.stdout
  }
  const deep = join(web, 'src/deep')
  expect(run(deep, 'context')).toStartWith(`# Forge context\n\nTarget: ${web}\n`)
  expect(JSON.parse(run(deep, 'context', '--json')).repo).toBe(web)
  expect(JSON.parse(run(deep, 'config', 'resolve')).repo).toBe(web)
  expect(JSON.parse(run(deep, 'docs', 'validate')).checked).toEqual([])
  expect(JSON.parse(run(join(repo, 'fresh/src'), 'config', 'resolve')).repo).toBe(join(repo, 'fresh/src'))
  expect(JSON.parse(run(deep, 'context', '--json', '--repo', repo)).repo).toBe(repo)
})

test('context lists docs/standards folders from the Git root down to the target, outermost first', () => {
  repo = realpathSync(mkdtempSync(join(tmpdir(), 'forge-context-')))
  write('.git/HEAD', 'ref: refs/heads/main\n')
  write('docs/standards/testing.md', '# testing\n')
  write('apps/web/.forge/references/cli.md', '\n')
  write('apps/web/docs/standards/ui.md', '# ui\n')
  write('apps/web/docs/standards/examples/button.tsx', 'export {}\n')
  write('apps/web/docs/standards/.DS_Store', '')
  write('apps/web/docs/standards/examples/node_modules/pkg/index.js', '\n')
  write('apps/api/docs/standards/sql.md', '# sibling\n')
  const web = join(repo, 'apps/web')
  const expected = [
    { path: join(repo, 'docs/standards'), files: ['testing.md'] },
    { path: join(web, 'docs/standards'), files: ['examples/button.tsx', 'ui.md'] },
  ]
  expect(JSON.parse(context(web, '--json')).standards).toEqual(expected)
  expect(context(web)).toContain(`):\n- ${expected[0]!.path}/\n  - testing.md\n- ${expected[1]!.path}/\n  - examples/button.tsx\n  - ui.md\nLoop storage: `)
})

test('a curated harness lists only its own standards folder', () => {
  repo = realpathSync(mkdtempSync(join(tmpdir(), 'forge-context-')))
  write('.git/HEAD', 'ref: refs/heads/main\n')
  write('docs/standards/root.md', '# root\n')
  write('factory/AGENTS.md', '# curated\n')
  write('factory/standards/testing.md', '# testing\n')
  write('forge.yml', 'harness: {path: factory}\n')
  expect(json().standards).toEqual([{ path: join(repo, 'factory/standards'), files: ['testing.md'] }])
})

test('context without a standards folder prints no standards line', () => {
  repo = realpathSync(mkdtempSync(join(tmpdir(), 'forge-context-')))
  write('.git/HEAD', 'ref: refs/heads/main\n')
  write('.forge/references/cli.md', '\n')
  write('AGENTS.md', '# root\n')
  write('docs/standards/.gitkeep', '')
  expect(json().standards).toEqual([])
  expect(context()).not.toContain('Standards')
})

test('a broken standards entry is skipped and an unreadable folder is a warning, not a failure', () => {
  repo = realpathSync(mkdtempSync(join(tmpdir(), 'forge-context-')))
  write('.git/HEAD', 'ref: refs/heads/main\n')
  write('.forge/references/cli.md', '\n')
  write('docs/standards/testing.md', '# testing\n')
  symlinkSync(join(repo, 'missing.md'), join(repo, 'docs/standards/dangling.md'))
  expect(json().standards).toEqual([{ path: join(repo, 'docs/standards'), files: ['testing.md'] }])
  chmodSync(join(repo, 'docs/standards'), 0o000)
  try {
    const compiled = json()
    expect(compiled.standards).toEqual([])
    expect(compiled.warnings.some((warning) => warning.startsWith(`could not list standards folder ${join(repo, 'docs/standards')}`))).toBe(true)
  } finally { chmodSync(join(repo, 'docs/standards'), 0o755) }
})
