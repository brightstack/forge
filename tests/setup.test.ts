import { afterEach, expect, test } from 'bun:test'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, readlinkSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { parse } from 'yaml'
import { _setup_test_hooks, parse_setup_tools, SETUP_TOOLS, setup_project } from '../src/setup.ts'
import { version } from '../package.json'

const APP = join(import.meta.dir, '..')
const PHASES = ['spec', 'plan', 'build', 'review', 'simplify', 'verify', 'ship']
const command = process.env.FORGE_TEST_BINARY
  ? [process.env.FORGE_TEST_BINARY]
  : [process.execPath, join(APP, 'src/cli.ts')]
let repo = ''

afterEach(() => {
  if (repo) rmSync(repo, { recursive: true, force: true })
  repo = ''
})

function cli(
  args: string[],
  options: { success?: boolean } = {},
): Record<string, unknown> | string {
  const result = spawnSync(command[0] as string, [...command.slice(1), ...args, '--repo', repo], {
    encoding: 'utf8',
  })
  if (options.success === false) {
    expect(result.status).not.toBe(0)
    return result.stderr
  }
  expect(result.status, result.stderr).toBe(0)
  return JSON.parse(result.stdout) as Record<string, unknown>
}

test('parse_setup_tools defaults to agents and rejects unknown names', () => {
  expect(parse_setup_tools()).toEqual(['agents'])
  expect(parse_setup_tools('agents,claude,cursor')).toEqual(['agents', 'claude', 'cursor'])
  expect(() => parse_setup_tools('windsurf')).toThrow(/unknown setup tool 'windsurf'/)
  expect(() => parse_setup_tools('')).toThrow(/setup requires at least one tool/)
})

test('setup --pack copies the package layout into the default agents host', () => {
  repo = mkdtempSync(join(tmpdir(), 'forge-setup-'))
  mkdirSync(join(repo, '.agents/skills/other'), { recursive: true })
  writeFileSync(join(repo, '.agents/skills/other/SKILL.md'), '# keep\n')
  mkdirSync(join(repo, '.agents/skills/forge/assets'), { recursive: true })
  writeFileSync(join(repo, '.agents/skills/forge/assets/obsolete.md'), '# old asset\n')
  mkdirSync(join(repo, '.agents/skills/forge-acceptance'), { recursive: true })
  writeFileSync(join(repo, '.agents/skills/forge-acceptance/SKILL.md'), '# retired phase\n')
  for (const folder of ['forge-build', 'forge-simplify']) {
    mkdirSync(join(repo, '.agents/skills', folder, 'references'), { recursive: true })
    writeFileSync(join(repo, '.agents/skills', folder, 'references/obsolete.md'), '# old reference\n')
  }
  writeFileSync(join(repo, '.agents/skills/forge-build/references/simplify.md'), '# old owner\n')
  mkdirSync(join(repo, '.agents/skills/forge-shared/references'), { recursive: true })
  writeFileSync(join(repo, '.agents/skills/forge-shared/references/standards.md'), '# old combined standards\n')
  mkdirSync(join(repo, '.agents/agents'), { recursive: true })
  writeFileSync(join(repo, '.agents/agents/custom.md'), '# mine\n')
  mkdirSync(join(repo, '.forge/agents/retired'), { recursive: true })
  writeFileSync(join(repo, '.forge/agents/retired/instructions.md'), '# old role\n')
  const kept = ['.forge/loops/keep/index.md', '.forge/memory/receipt.json', '.forge/prepared/draft.md', '.forge/identities.json', 'forge.yml']
  for (const path of kept) {
    mkdirSync(dirname(join(repo, path)), { recursive: true })
    writeFileSync(join(repo, path), `${path}\n`)
  }
  const result = cli(['setup', '--pack', APP]) as {
    tools: string[]
    pack: string
    hosts: Array<{ tool: string; dir: string; skill: string }>
  }
  expect(result.tools).toEqual(['agents'])
  expect(result.pack).toBe(resolve(APP))
  expect(existsSync(join(repo, '.agents/skills/forge/SKILL.md'))).toBe(true)
  expect(existsSync(join(repo, '.agents/skills/forge-code-review/SKILL.md'))).toBe(true)
  expect(existsSync(join(repo, '.agents/skills/forge-acceptance'))).toBe(false)
  for (const phase of PHASES) {
    expect(existsSync(join(repo, `.agents/skills/forge-${phase}/SKILL.md`))).toBe(true)
  }
  for (const [folder, installed] of [['skills', '.agents/skills'], ['agents', '.forge/agents'], ['references', '.forge/references'], ['templates', '.forge/templates']] as const) {
    const source = join(APP, folder)
    for (const relative of new Bun.Glob('**/*').scanSync({ cwd: source, onlyFiles: true })) {
      if (relative.startsWith('forge-eval/')) continue
      expect(existsSync(join(repo, installed, relative))).toBe(true)
      if (!relative.endsWith('.md')) expect(readFileSync(join(repo, installed, relative))).toEqual(readFileSync(join(source, relative)))
    }
  }
  for (const relative of new Bun.Glob('{.agents,.forge}/**/*.md').scanSync({ cwd: repo, onlyFiles: true, dot: true })) {
    const path = join(repo, relative)
    for (const [, target] of readFileSync(path, 'utf8').matchAll(/\]\(([^)\s#]+)/g)) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(target!) || target!.startsWith('/')) continue
      expect(existsSync(resolve(dirname(path), target!)), `${relative} -> ${target}`).toBe(true)
    }
  }
  expect(readFileSync(join(repo, '.agents/skills/forge-build/SKILL.md'), 'utf8')).toContain('](../../../.forge/agents/engineer/instructions.md)')
  for (const path of kept) expect(readFileSync(join(repo, path), 'utf8')).toBe(`${path}\n`)
  expect(existsSync(join(repo, '.agents/skills/forge-shared/SKILL.md'))).toBe(false)
  expect(existsSync(join(repo, '.agents/skills/forge-shared/references/standards.md'))).toBe(false)
  expect(existsSync(join(repo, '.agents/skills/forge-eval'))).toBe(false)
  expect(existsSync(join(repo, '.forge/agents/README.md'))).toBe(true)
  expect(existsSync(join(repo, '.forge/references/okf.md'))).toBe(true)
  expect(existsSync(join(repo, '.agents/forge'))).toBe(false)
  expect(readdirSync(join(repo, '.agents/agents'))).toEqual(['custom.md'])
  expect(readFileSync(join(repo, '.agents/agents/custom.md'), 'utf8')).toBe('# mine\n')
  expect(existsSync(join(repo, '.agents/OKF.md'))).toBe(false)
  expect(existsSync(join(repo, '.agents/skills/other/SKILL.md'))).toBe(true)
  expect(existsSync(join(repo, '.agents/skills/forge/assets/obsolete.md'))).toBe(false)
  expect(existsSync(join(repo, '.forge/agents/retired'))).toBe(false)
  for (const path of ['references/simplify.md', 'assets/simplify.md']) {
    expect(existsSync(join(repo, '.agents/skills/forge-simplify', path))).toBe(true)
    expect(existsSync(join(repo, '.agents/skills/forge-build', path))).toBe(false)
  }
  for (const folder of ['forge-build', 'forge-simplify']) {
    expect(existsSync(join(repo, '.agents/skills', folder, 'references/obsolete.md'))).toBe(false)
  }
  expect(existsSync(join(repo, '.agents/commands'))).toBe(false)
  expect(existsSync(join(repo, 'skills'))).toBe(false)
})

test('setup copies shared support to each requested host and native commands only to Claude', () => {
  repo = mkdtempSync(join(tmpdir(), 'forge-setup-claude-'))
  mkdirSync(join(repo, '.claude/commands/forge'), { recursive: true })
  writeFileSync(join(repo, '.claude/commands/forge/old-phase.md'), '# old command\n')
  writeFileSync(join(repo, '.claude/commands/forge/acceptance.md'), '# retired phase\n')
  writeFileSync(join(repo, '.claude/commands/custom.md'), '# keep\n')
  const result = setup_project(repo, parse_setup_tools('claude,cursor'), APP)
  expect(result.tools).toEqual(['claude', 'cursor'])
  for (const host of ['.claude', '.cursor']) {
    expect(existsSync(join(repo, host, 'skills/forge/SKILL.md'))).toBe(true)
    expect(existsSync(join(repo, host, 'forge'))).toBe(false)
    expect(existsSync(join(repo, host, 'agents'))).toBe(false)
    expect(existsSync(join(repo, host, 'skills/forge-shared'))).toBe(false)
    expect(existsSync(join(repo, host, 'skills/forge-review/references/judges/code-review/rubric.md'))).toBe(true)
    expect(existsSync(join(repo, host, 'skills/forge-eval'))).toBe(false)
  }
  for (const name of ['authority', 'pragmatism', 'severity', 'repair', 'target-harness', 'okf']) {
    expect(existsSync(join(repo, `.forge/references/${name}.md`))).toBe(true)
  }
  expect(existsSync(join(repo, '.forge/agents/README.md'))).toBe(true)
  expect(existsSync(join(repo, '.cursor/commands'))).toBe(false)
  expect(existsSync(join(repo, '.claude/commands/custom.md'))).toBe(true)
  expect(readdirSync(join(repo, '.claude/commands/forge')).sort()).toEqual(PHASES.map(phase => `${phase}.md`).sort())
  for (const phase of PHASES) {
    const adapter = readFileSync(join(repo, `.claude/commands/forge/${phase}.md`), 'utf8')
    const frontmatter = adapter.match(/^---\n([\s\S]+?)\n---\n/)
    expect(frontmatter).not.toBeNull()
    const metadata = parse(frontmatter![1]!)
    expect(metadata.name).toBeUndefined()
    expect(metadata['disable-model-invocation']).toBe(true)
    const target = adapter.match(/`(\$\{CLAUDE_PROJECT_DIR\}\/[^`]+)`/)?.[1]
    expect(target?.replace('${CLAUDE_PROJECT_DIR}', repo)).toBe(join(repo, `.claude/skills/forge-${phase}/SKILL.md`))
    expect(adapter.match(/\$ARGUMENTS/g)).toHaveLength(1)
  }
  expect(existsSync(join(repo, '.agents'))).toBe(false)
})

test('setup rejects unknown tools and a directory that is not a pack', () => {
  repo = mkdtempSync(join(tmpdir(), 'forge-setup-reject-'))
  expect(String(cli(['setup', '--tools', 'nope', '--pack', APP], { success: false }))).toContain(
    "unknown setup tool 'nope'",
  )
  const empty = mkdtempSync(join(tmpdir(), 'forge-not-pack-'))
  try {
    expect(String(cli(['setup', '--pack', empty], { success: false }))).toContain('skill pack not found')
  } finally {
    rmSync(empty, { recursive: true, force: true })
  }
})

test('setup refuses an incomplete phase pack before writing host files', () => {
  repo = mkdtempSync(join(tmpdir(), 'forge-setup-incomplete-'))
  const pack = mkdtempSync(join(tmpdir(), 'forge-old-pack-'))
  try {
    for (const path of ['skills/forge/SKILL.md', 'skills/forge-code-review/SKILL.md', 'agents/README.md', 'references/okf.md']) {
      mkdirSync(dirname(join(pack, path)), { recursive: true })
      writeFileSync(join(pack, path), '# fixture\n')
    }
    expect(() => setup_project(repo, parse_setup_tools('claude'), pack)).toThrow('skills/forge-spec/SKILL.md')
    expect(existsSync(join(repo, '.claude'))).toBe(false)
  } finally {
    rmSync(pack, { recursive: true, force: true })
  }
})

for (const missing of [
  'skills/forge-simplify/SKILL.md', 'commands/claude/forge/simplify.md',
  'skills/forge-verify/SKILL.md', 'commands/claude/forge/verify.md',
  ...['authority', 'pragmatism', 'severity', 'repair', 'target-harness']
    .map(name => `references/${name}.md`),
  'references/okf.md', 'templates/standing-spec.md',
]) {
  test(`setup refuses a pack missing ${missing} before changing hosts`, () => {
    repo = mkdtempSync(join(tmpdir(), 'forge-setup-missing-simplify-'))
    const pack = mkdtempSync(join(tmpdir(), 'forge-simplify-pack-'))
    try {
      for (const directory of ['skills', 'references', 'templates', 'agents', 'commands']) {
        cpSync(join(APP, directory), join(pack, directory), { recursive: true })
      }
      rmSync(join(pack, missing))
      expect(() => setup_project(repo, parse_setup_tools('agents,claude'), pack)).toThrow(missing)
      expect(readdirSync(repo)).toEqual([])
    } finally {
      rmSync(pack, { recursive: true, force: true })
    }
  })
}

for (const [label, path, tools, directory] of [
  ['skills ancestor', '.agents/skills', ['cursor', 'agents'], true],
  ['retired phase directory', '.agents/skills/forge-acceptance', ['cursor', 'agents'], true],
  ['Claude commands ancestor', '.claude/commands', ['agents', 'claude'], true],
  ['professional subdirectory', '.forge/agents/engineer', ['cursor', 'agents'], true],
  ['shared references directory', '.forge/references', ['cursor', 'agents'], true],
  ['OKF file', '.forge/references/okf.md', ['cursor', 'agents'], false],
] as const) {
  test(`setup rejects a symlinked ${label} before changing any selected host or outside content`, () => {
    repo = mkdtempSync(join(tmpdir(), 'forge-setup-symlink-'))
    const outside = mkdtempSync(join(tmpdir(), 'forge-setup-outside-'))
    try {
      const sentinel = join(outside, 'forge/sentinel.md')
      mkdirSync(dirname(sentinel), { recursive: true })
      writeFileSync(sentinel, 'outside content\n')
      const link = join(repo, path)
      const target = directory ? outside : sentinel
      mkdirSync(dirname(link), { recursive: true })
      symlinkSync(target, link)
      const retained = join(repo, SETUP_TOOLS[tools[0]], 'skills/forge/SKILL.md')
      mkdirSync(dirname(retained), { recursive: true })
      writeFileSync(retained, 'existing installation\n')
      const before = readdirSync(repo, { recursive: true }).sort()

      expect(() => setup_project(repo, [...tools], APP)).toThrow(/symlink paths are not managed/)

      expect(readFileSync(sentinel, 'utf8')).toBe('outside content\n')
      expect(readdirSync(outside, { recursive: true }).sort()).toEqual(['forge', 'forge/sentinel.md'])
      expect(readFileSync(retained, 'utf8')).toBe('existing installation\n')
      expect(readdirSync(repo, { recursive: true }).sort()).toEqual(before)
      expect(readlinkSync(link)).toBe(target)
    } finally {
      rmSync(outside, { recursive: true, force: true })
    }
  })
}

test('setup without --pack clones the tag matching the CLI version', () => {
  repo = mkdtempSync(join(tmpdir(), 'forge-setup-tag-'))
  const calls: string[][] = []
  _setup_test_hooks.git = (args) => {
    calls.push(args)
    for (const directory of ['skills', 'references', 'templates', 'agents', 'commands']) {
      cpSync(join(APP, directory), join(args.at(-1)!, directory), { recursive: true })
    }
    return { status: 0, stdout: '', stderr: '' }
  }
  try {
    const result = setup_project(repo, parse_setup_tools('agents'))
    expect(calls).toHaveLength(1)
    expect(calls[0]!.slice(0, 6)).toEqual(['clone', '--depth', '1', '--quiet', '--branch', `v${version}`])
    expect(calls[0]![6]).toBe('https://github.com/brightstack/forge')
    expect(result.pack).toBe('https://github.com/brightstack/forge')
    expect(result.ref).toBe(`v${version}`)
    expect(existsSync(join(repo, '.agents/skills/forge/SKILL.md'))).toBe(true)
  } finally {
    delete _setup_test_hooks.git
  }
})

test('setup names the missing release tag and suggests --pack before changing the project', () => {
  repo = mkdtempSync(join(tmpdir(), 'forge-setup-no-tag-'))
  _setup_test_hooks.git = () => ({ status: 128, stdout: '', stderr: `warning: Could not find remote branch v${version} to clone.\nfatal: Remote branch v${version} not found in upstream origin\n` })
  try {
    expect(() => setup_project(repo, parse_setup_tools('agents'))).toThrow(`skill pack tag v${version} does not exist`)
    expect(() => setup_project(repo, parse_setup_tools('agents'))).toThrow('--pack')
    expect(readdirSync(repo)).toEqual([])
  } finally {
    delete _setup_test_hooks.git
  }
})
