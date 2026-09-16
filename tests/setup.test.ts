import { afterEach, expect, test } from 'bun:test'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { parse_setup_tools, setup_project } from '../src/setup.ts'

const APP = join(import.meta.dir, '..')
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
  const result = cli(['setup', '--pack', APP]) as {
    tools: string[]
    pack: string
    hosts: Array<{ tool: string; dir: string; skill: string }>
  }
  expect(result.tools).toEqual(['agents'])
  expect(result.pack).toBe(resolve(APP))
  expect(existsSync(join(repo, '.agents/skills/forge/SKILL.md'))).toBe(true)
  expect(existsSync(join(repo, '.agents/skills/forge-code-review/SKILL.md'))).toBe(true)
  expect(existsSync(join(repo, '.agents/agents/README.md'))).toBe(true)
  expect(existsSync(join(repo, '.agents/OKF.md'))).toBe(true)
  expect(existsSync(resolve(dirname(join(repo, '.agents/skills/forge/SKILL.md')), '../../agents/README.md'))).toBe(true)
  expect(existsSync(join(repo, '.agents/skills/other/SKILL.md'))).toBe(true)
  expect(existsSync(join(repo, 'skills'))).toBe(false)
})

test('setup --tools claude writes the claude host', () => {
  repo = mkdtempSync(join(tmpdir(), 'forge-setup-claude-'))
  const result = setup_project(repo, parse_setup_tools('claude'), APP)
  expect(result.tools).toEqual(['claude'])
  expect(existsSync(join(repo, '.claude/skills/forge/SKILL.md'))).toBe(true)
  expect(existsSync(join(repo, '.claude/agents/README.md'))).toBe(true)
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
