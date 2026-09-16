import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  rmdirSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { spawnSync } from 'node:child_process'

const APP = join(import.meta.dir, '..')
const command = process.env.FORGE_TEST_BINARY
  ? [process.env.FORGE_TEST_BINARY]
  : [process.execPath, join(APP, 'src/cli.ts')]
let repo = ''

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

function git(...args: string[]): void {
  const result = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8' })
  expect(result.status, result.stderr).toBe(0)
}

function write(name: string, body: string): string {
  const path = join(repo, name)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, body)
  return path
}

beforeEach(() => {
  repo = mkdtempSync(join(tmpdir(), 'forge-candidate-'))
  git('init', '-q')
  write('.gitignore', 'generated.js\nignored/\n.forge/\n')
  write('main.py', 'print("hello")\n')
  git('add', '.gitignore', 'main.py')
  git('-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-qm', 'baseline')
})

afterEach(() => {
  rmSync(repo, { recursive: true, force: true })
})

describe('candidate CLI', () => {
  test('explicit ignored file and directory contents are fingerprinted', () => {
    const generated = write('generated.js', 'first\n')
    const ignored = write('ignored/child.js', 'first\n')
    const spec = write('.forge/loops/demo/spec/issue.md', 'first\n')
    for (const [selected, changed] of [
      ['generated.js', generated],
      ['ignored', ignored],
      ['.forge/loops/demo/spec', spec],
    ]) {
      const candidate = (cli(['candidate', '--path', selected as string]) as { candidate: string })
        .candidate
      writeFileSync(changed as string, 'changed\n')
      expect(
        cli(['candidate', '--path', selected as string, '--expect', candidate], { success: false }),
      ).toContain('candidate changed')
    }
  })

  test('explicit tracked file and directory deletions change the candidate', () => {
    const gone = write('gone.js', 'tracked\n')
    const nested = write('removed/child.js', 'tracked\n')
    git('add', 'gone.js', 'removed/child.js')
    git('-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-qm', 'tracked files')
    const fileCandidate = (cli(['candidate', '--path', 'gone.js']) as { candidate: string }).candidate
    const directoryCandidate = (cli(['candidate', '--path', 'removed']) as { candidate: string })
      .candidate
    unlinkSync(gone)
    unlinkSync(nested)
    rmdirSync(dirname(nested))
    expect(
      cli(['candidate', '--path', 'gone.js', '--expect', fileCandidate], { success: false }),
    ).toContain('candidate changed')
    expect(
      cli(['candidate', '--path', 'removed', '--expect', directoryCandidate], { success: false }),
    ).toContain('candidate changed')
  })

  test('explicit missing, escape, and symlink inputs are rejected', () => {
    expect(cli(['candidate', '--path', 'misspelled.js'], { success: false })).toContain(
      'candidate path does not exist',
    )
    cli(['candidate', '--path', '../outside.js'], { success: false })
    const target = write('target.js', 'target\n')
    symlinkSync(target, join(repo, 'alias.js'))
    expect(cli(['candidate', '--path', 'alias.js'], { success: false })).toContain(
      'symlink paths are not managed',
    )
  })

  test('explicit root excludes Git metadata', () => {
    const first = cli(['candidate', '--path', '.']) as {
      candidate: string
      paths: string[]
      excludes: string
    }
    expect(first.paths).toEqual(['.'])
    expect(first.excludes).toContain('.git metadata')
    write('.git/forge-noise', 'changed outside candidate\n')
    expect((cli(['candidate', '--path', '.']) as { candidate: string }).candidate).toBe(
      first.candidate,
    )
  })
})
