import { expect, test } from 'bun:test'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

const APP = join(import.meta.dir, '..')
const command = process.env.FORGE_TEST_BINARY
  ? [process.env.FORGE_TEST_BINARY]
  : [process.execPath, join(APP, 'src/cli.ts')]

function run(repo: string, args: string[]): Promise<{ code: number | null; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(command[0] as string, [...command.slice(1), ...args, '--repo', repo])
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (chunk) => (stdout += chunk))
    child.stderr.on('data', (chunk) => (stderr += chunk))
    child.on('close', (code) => resolve({ code, stdout, stderr }))
  })
}

test('overlapping CLI creates preserve every registration and reject duplicate codes', async () => {
  const repo = mkdtempSync(join(tmpdir(), 'forge-mutation-'))
  try {
    const requests = Array.from({ length: 12 }, (_, index) => ({
      path: `task-${index}.md`,
      code: index === 11 ? 'ISSUE-0' : `ISSUE-${index}`,
    }))
    const results = await Promise.all(
      requests.map(({ path, code }, index) =>
        run(repo, [
          'docs',
          'create',
          'issue',
          path,
          '--title',
          `Task ${index}`,
          '--code',
          code,
        ]),
      ),
    )
    const successes = results.filter((result) => result.code === 0)
    const failures = results.filter((result) => result.code !== 0)
    expect(successes).toHaveLength(11)
    expect(failures).toHaveLength(1)
    expect(failures[0]?.stderr).toContain('duplicate')

    const registry = JSON.parse(readFileSync(join(repo, '.forge/identities.json'), 'utf8')) as Record<
      string,
      { id: string; code: string; type: string }
    >
    expect(Object.keys(registry)).toHaveLength(11)
    for (const result of successes) {
      const output = JSON.parse(result.stdout) as { path: string }
      const relative = basename(output.path)
      expect(registry[relative]).toBeDefined()
    }

    const relative = Object.keys(registry)[0] as string
    const target = join(repo, relative)
    const original = readFileSync(target, 'utf8')
    writeFileSync(target, original.replace(registry[relative]?.id as string, randomUUID()))
    for (const paths of [[], [relative]]) {
      const result = spawnSync(
        command[0] as string,
        [...command.slice(1), 'docs', 'validate', ...paths, '--repo', repo],
        { encoding: 'utf8' },
      )
      expect(result.status).not.toBe(0)
      expect(result.stderr).toContain('immutable identity changed')
    }
  } finally {
    rmSync(repo, { recursive: true, force: true })
  }
})
