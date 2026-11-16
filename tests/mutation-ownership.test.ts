import { expect, test } from 'bun:test'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'

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

test('overlapping CLI creates keep every document and reject duplicate codes from frontmatter scans', async () => {
  const repo = mkdtempSync(join(tmpdir(), 'forge-mutation-'))
  try {
    const init = await run(repo, ['init', 'demo', '--title', 'Demo'])
    expect(init.code, init.stderr).toBe(0)
    const requests = Array.from({ length: 12 }, (_, index) => ({
      path: `task-${index}.md`,
      code: index === 11 ? 'ISSUE-0' : `ISSUE-${index}`,
    }))
    const results = await Promise.all(
      requests.map(({ path, code }, index) =>
        run(repo, ['docs', 'create', 'issue', path, '--title', `Task ${index}`, '--code', code, '--loop', 'demo']),
      ),
    )
    const successes = results.filter((result) => result.code === 0)
    const failures = results.filter((result) => result.code !== 0)
    expect(successes).toHaveLength(11)
    expect(failures).toHaveLength(1)
    expect(failures[0]?.stderr).toContain('duplicate')
    expect(existsSync(join(repo, '.forge/identities.json'))).toBeFalse()

    const validated = spawnSync(command[0] as string, [...command.slice(1), 'docs', 'validate', '--loop', 'demo', '--repo', repo], { encoding: 'utf8' })
    expect(validated.status, validated.stderr).toBe(0)
    expect(JSON.parse(validated.stdout).checked).toHaveLength(11 + 4)

    const [first, second] = successes.map((result) => (JSON.parse(result.stdout) as { path: string; id: string }))
    const target = second!.path
    writeFileSync(target, readFileSync(target, 'utf8').replace(second!.id, first!.id))
    const duplicate = spawnSync(command[0] as string, [...command.slice(1), 'docs', 'validate', '--loop', 'demo', '--repo', repo], { encoding: 'utf8' })
    expect(duplicate.status).not.toBe(0)
    expect(duplicate.stderr).toContain('duplicate')
    expect(basename(target)).toMatch(/^task-\d+\.md$/)
  } finally {
    rmSync(repo, { recursive: true, force: true })
  }
})

test('different checkouts serialize the same loop parent and preserve five concurrent loops', async () => {
  const work = mkdtempSync(join(tmpdir(), 'forge-lock-'))
  const first = join(work, 'factory', 'app')
  const second = join(work, 'elsewhere', 'app')
  const storage = join(work, 'records', 'runs')
  let holder: ReturnType<typeof spawn> | undefined
  try {
    for (const repo of [first, second]) {
      mkdirSync(repo, { recursive: true })
      writeFileSync(join(repo, 'forge.yml'), `storage: {loops: {path: ${JSON.stringify(storage)}}}\n`)
    }
    const inits = await Promise.all(Array.from({ length: 5 }, (_, index) => run(index % 2 ? first : second, ['init', `loop-${index}`, '--title', `Loop ${index}`])))
    for (const result of inits) expect(result.code, result.stderr).toBe(0)
    expect(readdirSync(storage).filter((name) => name.startsWith('loop-'))).toHaveLength(5)
    // Hold the real POSIX lock from one checkout. A CLI writer from another
    // checkout must wait even though its own target lock is available.
    const release = join(work, 'release')
    const script = `import { withMutationLock } from ${JSON.stringify(join(APP, 'src/lock.ts'))};
      import { existsSync } from 'node:fs';
      withMutationLock(${JSON.stringify(first)}, () => {
        process.stdout.write('locked\\n');
        while (!existsSync(${JSON.stringify(release)})) Bun.sleepSync(10);
      }, [${JSON.stringify(storage)}]);`
    holder = spawn(process.execPath, ['-e', script], { stdio: ['ignore', 'pipe', 'pipe'] })
    await new Promise<void>((resolve, reject) => {
      holder!.stdout!.once('data', () => resolve())
      holder!.once('error', reject)
      holder!.once('exit', (code) => { if (code !== 0) reject(new Error(`lock holder exited ${code}`)) })
    })
    let completed = false
    const waiting = run(second, ['docs', 'create', 'issue', 'held.md', '--title', 'Held', '--code', 'HELD', '--loop', 'loop-0']).then((result) => { completed = true; return result })
    await Bun.sleep(180)
    expect(completed).toBeFalse()
    writeFileSync(release, 'release')
    const released = await waiting
    expect(released.code, released.stderr).toBe(0)
    const writes = await Promise.all(Array.from({ length: 12 }, (_, index) => run(index % 2 ? first : second, ['docs', 'create', 'issue', `issue-${index}.md`, '--title', `Issue ${index}`, '--code', `ISSUE-${index % 6}`, '--loop', 'loop-0'])))
    expect(writes.filter((result) => result.code === 0)).toHaveLength(6)
    for (const result of writes.filter((result) => result.code !== 0)) expect(result.stderr).toContain('duplicate')
    for (const repo of [first, second]) {
      const validated = await run(repo, ['docs', 'validate', '--loop', 'loop-0'])
      expect(validated.code, validated.stderr).toBe(0)
      expect(JSON.parse(validated.stdout).checked).toHaveLength(11)
      expect(existsSync(join(repo, '.forge/identities.json'))).toBeFalse()
      expect(existsSync(join(repo, '.forge/mutation.lock'))).toBeTrue()
    }
    expect(existsSync(join(storage, '.mutation.lock'))).toBeTrue()
  } finally {
    holder?.kill()
    rmSync(work, { recursive: true, force: true })
  }
})
