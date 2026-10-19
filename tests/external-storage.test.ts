import { afterEach, beforeEach, expect, test } from 'bun:test'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join, relative } from 'node:path'
import { randomUUID } from 'node:crypto'
import { spawn, spawnSync } from 'node:child_process'
import { create_document, init_loop, loops_path, read_document, register_document, resolve_loop, serialize_document } from '../src/records.ts'
import { _memory_test_hooks, apply_prepared, verify_prepared } from '../src/memory.ts'
import { candidate_snapshot, validate_documents } from '../src/validation.ts'

const command = process.env.FORGE_TEST_BINARY
  ? [process.env.FORGE_TEST_BINARY]
  : [process.execPath, join(import.meta.dir, '../src/cli.ts')]
let work = ''
let repo = ''
let storage = ''

function write(path: string, content: string): string {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
  return path
}

function cli(args: string[], success = true): Record<string, unknown> | string {
  const result = spawnSync(command[0]!, [...command.slice(1), ...args, '--repo', repo], { encoding: 'utf8' })
  if (!success) {
    expect(result.status).not.toBe(0)
    return result.stderr
  }
  expect(result.status, result.stderr).toBe(0)
  return JSON.parse(result.stdout) as Record<string, unknown>
}

function concurrent(args: string[]): Promise<{ status: number | null; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(command[0]!, [...command.slice(1), ...args, '--repo', repo])
    let stderr = ''
    child.stderr.on('data', (chunk) => { stderr += chunk })
    child.on('close', (status) => resolve({ status, stderr }))
  })
}

function hash(content: string): string { return Bun.CryptoHasher.hash('sha256', content, 'hex') }

beforeEach(() => {
  work = mkdtempSync(join(tmpdir(), 'forge-external-'))
  repo = join(work, 'repo')
  storage = join(work, 'loops')
  mkdirSync(repo)
  write(join(repo, 'forge.yml'), `loopsPath: ${JSON.stringify(storage)}\n`)
})

afterEach(() => {
  delete _memory_test_hooks.check_current_state
  rmSync(work, { recursive: true, force: true })
})

test('default groups repositories under home without creating storage; override accepts relative, home and absolute paths', () => {
  rmSync(join(repo, 'forge.yml'))
  const home = join(work, 'unused-home')
  const target = loops_path(repo, home)
  expect(target.startsWith(join(home, '.forge/repos', `${basename(repo)}-`))).toBeTrue()
  expect(target.endsWith('/loops')).toBeTrue()
  expect(existsSync(home)).toBeFalse()
  const second = join(work, 'other', 'repo')
  mkdirSync(second, { recursive: true })
  expect(loops_path(second, home)).not.toBe(target)
  for (const [configured, expected] of [['artifacts/loops', join(realpathSync(repo), 'artifacts/loops')], ['~/loops', join(home, 'loops')], [storage, storage]]) {
    write(join(repo, 'forge.yml'), `loopsPath: ${JSON.stringify(configured)}\n`)
    expect(loops_path(repo, home)).toBe(expected!)
  }
  write(join(repo, 'forge.yml'), 'loopsPath: ../loops\n')
  expect((init_loop(repo, 'relative', 'Relative') as { root: string }).root).toBe(realpathSync(join(storage, 'relative')))
  write(join(repo, 'forge.yml'), 'loopsPath: [bad]\n')
  expect(() => loops_path(repo, home)).toThrow('loopsPath')
})

test('external loop records use Markdown identities, local codes, qualified links, and no JSON registry', async () => {
  const first = cli(['init', 'alpha', '--title', 'Alpha']) as { root: string }
  cli(['init', 'beta', '--title', 'Beta'])
  expect(first.root).toBe(realpathSync(join(storage, 'alpha')))
  expect(existsSync(join(repo, '.forge/identities.json'))).toBeFalse()
  const results = await Promise.all(['alpha', 'beta'].flatMap((loop) => Array.from({ length: 6 }, (_, index) => concurrent([
    'docs', 'create', 'issue', `issues/${index}.md`, '--title', `${loop} ${index}`, '--code', `ISSUE-${index}`, '--loop', loop,
  ]))))
  for (const result of results) expect(result.status, result.stderr).toBe(0)
  expect(cli(['docs', 'create', 'issue', 'duplicate.md', '--title', 'Duplicate', '--code', 'ISSUE-0', '--loop', 'alpha'], false)).toContain('duplicate')
  expect(cli(['docs', 'update', 'issues/0.md', '--set', 'id=forged', '--loop', 'alpha'], false)).toContain('immutable')
  const issue = join(storage, 'alpha/issues/0.md')
  const [metadata] = read_document(issue)
  writeFileSync(issue, readFileSync(issue, 'utf8').replace(metadata.id as string, randomUUID()) + '\n[Other loop](../../beta/issues/0.md)\n')
  write(join(storage, 'alpha/sources/baseline.snapshot'), readFileSync(issue, 'utf8'))
  // With no historical sidecar, a valid raw UUID edit is accepted by the Markdown scan.
  expect(validate_documents(repo, undefined, 'alpha').checked).toHaveLength(10)
  write(join(repo, '.forge/identities.json'), 'deliberately invalid legacy registry')
  cli(['init', 'gamma', '--title', 'Gamma'])
  cli(['docs', 'create', 'issue', 'issue.md', '--title', 'Gamma issue', '--loop', 'gamma'])
  cli(['docs', 'update', 'issues/0.md', '--set', 'status=ready', '--loop', 'alpha'])
  cli(['docs', 'validate', '--loop', 'alpha'])
  expect(read_document(issue)[0].status).toBe('ready')
  expect(readFileSync(join(repo, '.forge/identities.json'), 'utf8')).toBe('deliberately invalid legacy registry')
  expect(existsSync(join(storage, 'alpha/identities.json'))).toBeFalse()
  expect(existsSync(join(storage, 'beta/identities.json'))).toBeFalse()
  expect(cli(['docs', 'create', 'issue', '../beta/escape.md', '--title', 'Escape', '--loop', 'alpha'], false)).toContain('within repository')
})

test('legacy history and registry bytes remain in place when a new parent is configured', () => {
  write(join(repo, 'forge.yml'), 'loopsPath: .forge/loops\n')
  const legacy = init_loop(repo, 'legacy', 'Legacy') as { root: string }
  const index = join(legacy.root, 'index.md')
  const [identity] = read_document(index)
  const registry = JSON.stringify({ '.forge/loops/legacy/index.md': { id: identity.id, code: identity.code, type: identity.type } }, null, 2)
  write(join(repo, '.forge/identities.json'), registry)
  const before = readFileSync(index)
  write(join(repo, 'forge.yml'), `loopsPath: ${JSON.stringify(storage)}\n`)
  expect(resolve_loop(repo, 'legacy')).toBe(legacy.root)
  expect(resolve_loop(repo, '.forge/loops/legacy')).toBe(legacy.root)
  const next = init_loop(repo, 'new', 'New') as { root: string }
  expect(next.root).toBe(realpathSync(join(storage, 'new')))
  cli(['docs', 'validate', '--loop', 'legacy'])
  expect(readFileSync(index)).toEqual(before)
  expect(readFileSync(join(repo, '.forge/identities.json'), 'utf8')).toBe(registry)
})

test('decision record reads selected external authority and appends a qualified canonical reference', () => {
  const loop = (init_loop(repo, 'decision', 'Decision') as { root: string }).root
  write(join(loop, 'authority.txt'), 'Keep the accepted task identity.\n')
  write(join(loop, 'authorization.json'), JSON.stringify({ actor: 'human', source: 'authority.txt', quote: 'Keep the accepted task identity.', scope: 'Task identity', date: '2026-10-15' }))
  write(join(loop, 'body.md'), '# Task identity\n\nKeep task identity stable.\n')
  const result = cli(['decision', 'record', 'decisions.md', '--loop', 'decision', '--authorization-file', 'authorization.json', '--body-file', 'body.md']) as { decision: string }
  expect(result.decision).toBe('D1')
  const canonical = readFileSync(join(repo, 'docs/knowledge/decisions/D1-task-identity.md'), 'utf8')
  expect(canonical).toContain(join(loop, 'authority.txt'))
  expect(readFileSync(join(loop, 'decisions.md'), 'utf8')).toContain('../../repo/docs/knowledge/decisions/D1-task-identity.md')
  cli(['docs', 'validate', '--loop', 'decision'])
  const identities = JSON.parse(readFileSync(join(repo, '.forge/identities.json'), 'utf8'))
  expect(Object.keys(identities).every((path) => path.startsWith('docs/knowledge/'))).toBeTrue()
})

test('external prepared Spec inputs stay bounded while canonical apply, stale checks, receipts and retry target the repository', () => {
  const loop = (init_loop(repo, 'spec', 'Spec') as { root: string }).root
  const proposed = create_document(repo, 'standing-spec', 'prepared/spec.md', 'Tasks', 'TASKS-SPEC', undefined, { loop: 'spec' }) as { path: string }
  const next = readFileSync(proposed.path, 'utf8').replace(/<!--[^]*?-->/g, '') + '\nGIVEN a task\nWHEN it is listed\nTHEN it appears.\n'
  write(proposed.path, next)
  write(join(loop, 'authority.txt'), 'Human approves the retained Spec change.\n')
  write(join(loop, 'authorization.json'), JSON.stringify({ actor: 'human', source: 'authority.txt', quote: 'Human approves the retained Spec change.', scope: 'Tasks Spec', date: '2026-10-15' }))
  write(join(loop, 'baseline.snapshot'), '# Before\n')
  write(join(loop, 'change.snapshot'), '# Approved Tasks change\n')
  const manifest = {
    version: 1, operation_id: 'EXTERNAL-SPEC', application: 'spec', authorization_file: 'authorization.json',
    proof: { status: 'document-only', source: ['change.snapshot'], evidence: [], acceptance: [] },
    retained_inputs: [
      { role: 'accepted-baseline', source: 'baseline.snapshot', sha256: hash('# Before\n') },
      { role: 'approved-change', source: 'change.snapshot', sha256: hash('# Approved Tasks change\n') },
    ],
    changes: [{ path: 'docs/specs/tasks/SPEC.md', kind: 'standing-spec', action: 'add', base_sha256: null, proposed_file: 'prepared/spec.md', proposed_sha256: hash(next), metadata_changes: [] }],
  }
  const manifestPath = write(join(loop, 'prepared/apply.json'), JSON.stringify(manifest))
  expect(() => verify_prepared(repo, manifestPath)).toThrow('within repository')
  expect(verify_prepared(repo, 'prepared/apply.json', 'spec').valid).toBeTrue()
  write(join(loop, 'change.snapshot'), '# Changed later\n')
  expect(() => apply_prepared(repo, manifestPath, 'spec')).toThrow('stale retained')
  expect(existsSync(join(repo, 'docs/specs/tasks/SPEC.md'))).toBeFalse()
  write(join(loop, 'change.snapshot'), '# Approved Tasks change\n')
  const arbitrary = write(join(work, 'unselected.md'), next)
  write(manifestPath, JSON.stringify({ ...manifest, changes: [{ ...manifest.changes[0], proposed_file: arbitrary }] }))
  expect(() => verify_prepared(repo, manifestPath, 'spec')).toThrow()
  write(manifestPath, JSON.stringify({ ...manifest, changes: [{ ...manifest.changes[0], path: '../outside/SPEC.md' }] }))
  expect(() => apply_prepared(repo, manifestPath, 'spec')).toThrow('within repository')
  write(manifestPath, JSON.stringify(manifest))
  const canonicalSource = write(join(repo, 'docs/specs/retained/SPEC.md'), next)
  write(manifestPath, JSON.stringify({ ...manifest, retained_inputs: [{ ...manifest.retained_inputs[0], source: canonicalSource, sha256: hash(next) }, manifest.retained_inputs[1]] }))
  expect(() => verify_prepared(repo, manifestPath, 'spec')).toThrow('retained independently of canonical files')
  rmSync(canonicalSource)
  write(manifestPath, JSON.stringify(manifest))
  _memory_test_hooks.check_current_state = () => { write(join(loop, 'authority.txt'), 'Changed after preparation.\n') }
  expect(() => apply_prepared(repo, manifestPath, 'spec')).toThrow('authorization source changed while preparing')
  delete _memory_test_hooks.check_current_state
  write(join(loop, 'authority.txt'), 'Human approves the retained Spec change.\n')
  expect(apply_prepared(repo, manifestPath, 'spec').applied).toBeTrue()
  expect(readFileSync(join(repo, 'docs/specs/tasks/SPEC.md'), 'utf8')).toBe(next)
  expect(existsSync(join(loop, 'docs/specs/tasks/SPEC.md'))).toBeFalse()
  expect(existsSync(join(repo, '.forge/memory/EXTERNAL-SPEC.json'))).toBeTrue()
  expect(apply_prepared(repo, manifestPath, 'spec').already_applied).toBeTrue()
  expect(Object.keys(JSON.parse(readFileSync(join(repo, '.forge/identities.json'), 'utf8')))).toEqual(['docs/specs/tasks/SPEC.md'])
  write(manifestPath, JSON.stringify({ ...manifest, operation_id: 'EXTERNAL-UPDATE', changes: [{ ...manifest.changes[0], action: 'update', base_sha256: '0'.repeat(64) }] }))
  expect(() => apply_prepared(repo, manifestPath, 'spec')).toThrow('stale base')
  expect(readFileSync(join(repo, 'docs/specs/tasks/SPEC.md'), 'utf8')).toBe(next)
})

test('broad or canonical storage configuration cannot bypass canonical identities or exclude repository source', () => {
  write(join(repo, 'forge.yml'), 'loopsPath: .\n')
  const content = serialize_document({ id: randomUUID(), code: 'TASKS', type: 'standing-spec', title: 'Tasks', status: 'active', createdAt: '2026-10-15', updatedAt: '2026-10-15' }, '# Tasks\n\nGIVEN a task\nWHEN it is listed\nTHEN it appears.\n')
  const canonical = write(join(repo, 'docs/specs/tasks/SPEC.md'), content)
  register_document(repo, canonical, content)
  const registry = readFileSync(join(repo, '.forge/identities.json'))
  expect(() => init_loop(repo, 'docs', 'Unsafe')).toThrow('overlap canonical memory')
  write(canonical, content.replace('code: "TASKS"', 'code: "CHANGED"'))
  expect(() => validate_documents(repo, [canonical])).toThrow('immutable identity changed')
  write(canonical, content)
  expect(() => create_document(repo, 'product', 'docs/specs/tasks/extra.md', 'Protected')).toThrow('dedicated decision or memory operation')
  write(join(repo, 'forge.yml'), 'loopsPath: docs/specs\n')
  expect(() => init_loop(repo, 'unsafe', 'Unsafe')).toThrow('overlap canonical memory')
  write(join(repo, 'forge.yml'), 'loopsPath: .\n')
  write(join(repo, 'src/main.ts'), 'first\n')
  write(join(repo, 'src/index.md'), '# Source documentation\n')
  const git = (...args: string[]) => {
    const result = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8' })
    expect(result.status, result.stderr).toBe(0)
  }
  git('init', '-q')
  git('add', 'forge.yml', 'src', 'docs')
  git('-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-qm', 'baseline')
  const baseline = candidate_snapshot(repo).candidate
  init_loop(repo, 'work', 'Work')
  expect(candidate_snapshot(repo).candidate).toBe(baseline)
  write(join(repo, 'src/main.ts'), 'changed\n')
  expect(candidate_snapshot(repo).candidate).not.toBe(baseline)
  expect(validate_documents(repo).checked).toHaveLength(5)
  expect(readFileSync(join(repo, '.forge/identities.json'))).toEqual(registry)
})

test('candidate keeps repository code root and includes only explicitly selected external loop inputs', () => {
  const git = (...args: string[]) => {
    const result = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8' })
    expect(result.status, result.stderr).toBe(0)
  }
  git('init', '-q')
  write(join(repo, 'main.ts'), 'first\n')
  git('add', 'main.ts', 'forge.yml')
  git('-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-qm', 'baseline')
  const loop = (init_loop(repo, 'candidate', 'Candidate') as { root: string }).root
  const input = write(join(loop, 'accepted.snapshot'), 'accepted\n')
  const baseline = candidate_snapshot(repo).candidate
  const exact = candidate_snapshot(repo, ['main.ts', input], 'candidate').candidate
  write(input, 'changed\n')
  expect(candidate_snapshot(repo).candidate).toBe(baseline)
  expect(candidate_snapshot(repo, ['main.ts', input], 'candidate').candidate).not.toBe(exact)
  expect(() => candidate_snapshot(repo, [input])).toThrow('within repository')
  expect(() => candidate_snapshot(repo, [join(work, 'elsewhere')], 'candidate')).toThrow()
  const gitMetadata = write(join(loop, '.git/config'), 'metadata\n')
  expect(() => candidate_snapshot(repo, [gitMetadata], 'candidate')).toThrow('cannot select .git metadata')
  expect((cli(['candidate', '--path', 'main.ts', '--path', input, '--loop', 'candidate']) as { paths: string[] }).paths).toEqual(['main.ts', relative(realpathSync(repo), input)])
})
