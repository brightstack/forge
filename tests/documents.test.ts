import { afterEach, describe, expect, test } from 'bun:test'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { KINDS, read_document } from '../src/records.ts'

const APP = join(import.meta.dir, '..')
const command = process.env.FORGE_TEST_BINARY
  ? [process.env.FORGE_TEST_BINARY]
  : [process.execPath, join(APP, 'src/cli.ts')]
let repo = ''

afterEach(() => {
  if (repo) rmSync(repo, { recursive: true, force: true })
  repo = ''
})

function setup(): void {
  repo = mkdtempSync(join(tmpdir(), 'forge-documents-'))
}

function cli(
  args: Array<string | number>,
  options: { success?: boolean } = {},
): Record<string, unknown> | string {
  const result = spawnSync(command[0] as string, [...command.slice(1), ...args.map(String), '--repo', repo], {
    encoding: 'utf8',
  })
  if (options.success === false) {
    expect(result.status).not.toBe(0)
    return result.stderr
  }
  expect(result.status, result.stderr).toBe(0)
  return JSON.parse(result.stdout) as Record<string, unknown>
}

function write(name: string, body: string): string {
  const path = join(repo, name)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, body)
  return path
}

function create(kind = 'issue', path = 'task.md', code?: string): Record<string, unknown> {
  const args = ['docs', 'create', kind, path, '--title', 'A readable task']
  if (code) args.push('--code', code)
  return cli(args) as Record<string, unknown>
}

function git(...args: string[]): string {
  const result = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8' })
  expect(result.status, result.stderr).toBe(0)
  return result.stdout
}

function authorization(changes: Record<string, unknown> = {}): string {
  write('transcript.txt', 'Human: Preserve task identity when archiving.\n')
  return write(
    'authorization.json',
    JSON.stringify({
      actor: 'human',
      source: 'transcript.txt',
      quote: 'Preserve task identity when archiving.',
      scope: 'Task archive behavior',
      date: '2026-09-09',
      ...changes,
    }),
  )
}

describe('document CLI', () => {
  test('every template creates an identified draft', () => {
    setup()
    cli(['init', 'demo', '--title', 'Demo'])
    for (const kind of [...KINDS].sort().filter((kind) => kind !== 'decisions')) {
      expect(create(kind, `.forge/loops/demo/drafts/${kind}.md`).status).toBe('draft')
    }
    const result = cli(['docs', 'validate']) as { checked: string[] }
    expect(result.checked).toHaveLength(KINDS.size + 3)
  })

  test('create supplies a missing title without changing an explicit title or weakening updates', () => {
    setup()
    const body = write('body.txt', 'Change the retry limit; preserve the exported name.\n')
    cli(['docs', 'create', 'plan', 'plan.md', '--title', 'Retry limit plan', '--body-file', body])
    const [metadata, content] = read_document(join(repo, 'plan.md'))
    expect(content).toBe('# Retry limit plan\n\nChange the retry limit; preserve the exported name.\n')
    expect(metadata.title).toBe('Retry limit plan')
    cli(['docs', 'validate', 'plan.md'])
    const original = readFileSync(join(repo, 'plan.md'))
    cli(['docs', 'update', 'plan.md', '--body-file', body], { success: false })
    expect(readFileSync(join(repo, 'plan.md'))).toEqual(original)

    const explicit = '# Existing descriptive title\n\nKeep this body intact.\n'
    cli(['docs', 'create', 'plan', 'explicit.md', '--title', 'Metadata title', '--body-file', write('explicit.txt', explicit)])
    expect(read_document(join(repo, 'explicit.md'))[1]).toBe(explicit)

    for (const invalid of ['', ' \n\t', '---\ninvalid header\n---\nBody\n']) {
      cli(['docs', 'create', 'plan', 'invalid.md', '--title', 'A title', '--body-file', write('invalid.txt', invalid)], { success: false })
      expect(existsSync(join(repo, 'invalid.md'))).toBe(false)
    }
  })

  test('malformed UTF-8 rejects document, body, decision, and registry operations without rewriting bytes', () => {
    setup()
    create()
    const target = join(repo, 'task.md')
    const original = readFileSync(target)
    const malformed = Buffer.concat([original, Buffer.from('\nJos'), Buffer.from([0xe9])])
    writeFileSync(target, malformed)
    cli(['docs', 'validate', 'task.md'], { success: false })
    cli(['docs', 'update', 'task.md', '--set', 'status=ready'], { success: false })
    expect(readFileSync(target)).toEqual(malformed)
    writeFileSync(target, Buffer.concat([original, Buffer.from('\n[Title](linked.md#title)\n')]))
    writeFileSync(write('linked.md', ''), Buffer.from('# Title\nJos\xe9', 'latin1'))
    cli(['docs', 'validate', 'task.md'], { success: false })
    writeFileSync(target, original)

    const body = write('body.txt', '# Body\n')
    writeFileSync(body, Buffer.from([0x23, 0x20, 0x4a, 0x6f, 0x73, 0xe9]))
    cli(['docs', 'create', 'issue', 'new.md', '--title', 'New', '--body-file', body], { success: false })
    expect(existsSync(join(repo, 'new.md'))).toBe(false)
    cli(['docs', 'update', 'task.md', '--body-file', body], { success: false })
    expect(readFileSync(target)).toEqual(original)

    cli(['init', 'utf8', '--title', 'UTF-8'])
    const decisions = '.forge/loops/utf8/decisions.md'
    const log = '.forge/loops/utf8/log.md'
    const decisionBefore = readFileSync(join(repo, decisions))
    const logBefore = readFileSync(join(repo, log))
    const auth = authorization()
    cli(['decision', 'record', decisions, '--authorization-file', auth, '--body-file', body], { success: false })
    cli(['docs', 'append', log, '--heading', 'UTF-8', '--body-file', body], { success: false })
    expect(readFileSync(join(repo, decisions))).toEqual(decisionBefore)
    expect(readFileSync(join(repo, log))).toEqual(logBefore)
    writeFileSync(body, 'Approved body')
    for (const path of [join(repo, decisions), join(repo, log), auth, join(repo, 'transcript.txt')]) {
      const before = readFileSync(path)
      const bytes = Buffer.concat([before, Buffer.from([0xe9])])
      writeFileSync(path, bytes)
      const args = path === join(repo, log)
        ? ['docs', 'append', log, '--heading', 'UTF-8', '--body-file', body]
        : ['decision', 'record', decisions, '--authorization-file', auth, '--body-file', body]
      cli(args, { success: false })
      expect(readFileSync(path)).toEqual(bytes)
      writeFileSync(path, before)
    }
    const registry = join(repo, '.forge/identities.json')
    const invalidRegistry = Buffer.from('{"other.md":{"id":"11111111-1111-4111-8111-111111111111","code":"Jos\xe9","type":"issue"}}', 'latin1')
    writeFileSync(registry, invalidRegistry)
    cli(['docs', 'create', 'issue', 'new.md', '--title', 'New'], { success: false })
    expect(readFileSync(registry)).toEqual(invalidRegistry)
    expect(existsSync(join(repo, 'new.md'))).toBe(false)
  })

  test('valid UTF-8 body bytes including a leading BOM are preserved', () => {
    setup()
    create()
    const body = write('body.txt', '\uFEFF\n# Body\n\nJosé 😀\n')
    cli(['docs', 'update', 'task.md', '--body-file', body])
    expect(read_document(join(repo, 'task.md'))[1]).toBe(readFileSync(body, 'utf8'))
    const prefixed = Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), readFileSync(join(repo, 'task.md'))])
    writeFileSync(join(repo, 'task.md'), prefixed)
    cli(['docs', 'update', 'task.md', '--set', 'status=ready'], { success: false })
    expect(readFileSync(join(repo, 'task.md'))).toEqual(prefixed)
  })

  test('body and metadata updates preserve unknown YAML blocks byte for byte', () => {
    setup()
    create()
    const path = join(repo, 'task.md')
    let before = readFileSync(path, 'utf8')
    const marker = before.indexOf('\n---\n', 4)
    const unknown =
      '\nvendor:\n  nested: [a, b]\n  note: |\n    retain this exact value\n# preserve comment\ncustom: [1, 2]'
    before = before.slice(0, marker) + unknown + before.slice(marker)
    writeFileSync(path, before)
    const [original] = read_document(path)
    const body = write(
      'body.txt',
      '# Pin affordance\n\n## Context\n\nPins occupy space.\n\n## Acceptance Criteria\n\nA pinned task remains keyboard accessible.\n',
    )
    cli(['docs', 'update', 'task.md', '--body-file', body])
    expect(readFileSync(path, 'utf8').startsWith(`${before.split('\n---\n', 1)[0]}\n---\n`)).toBeTrue()
    cli([
      'docs',
      'update',
      'task.md',
      '--set',
      'status=ready',
      '--set',
      'description=Readable details',
    ])
    const updated = readFileSync(path, 'utf8')
    expect(updated).toContain(unknown)
    expect(updated.endsWith(readFileSync(body, 'utf8'))).toBeTrue()
    const [metadata] = read_document(path)
    expect(metadata.id).toBe(original.id)
    expect(metadata.code).toBe(original.code)
    cli(['docs', 'validate'])
  })

  test('identity edits and duplicate codes are rejected', () => {
    setup()
    const first = create('issue', 'task.md', 'ISSUE-ONE')
    expect(
      cli(['docs', 'create', 'issue', 'other.md', '--title', 'Other', '--code', 'ISSUE-ONE'], {
        success: false,
      }),
    ).toContain('duplicate')
    expect(existsSync(join(repo, 'other.md'))).toBeFalse()
    expect(cli(['docs', 'update', 'task.md', '--set', 'id=abc'], { success: false })).toContain(
      'immutable',
    )
    const path = join(repo, 'task.md')
    writeFileSync(path, readFileSync(path, 'utf8').replace(first.code as string, 'ISSUE-CHANGED'))
    expect(cli(['docs', 'validate'], { success: false })).toContain('immutable')
  })

  test('frontmatter accepts UUID variants and rejects duplicates and malformed dates', () => {
    setup()
    const document = (id: string, code: string) =>
      `---\nid: ${id}\ncode: ${code}\ntype: issue\ntitle: Legacy\nstatus: draft\ncreatedAt: 2026-09-09\nupdatedAt: 2026-09-09T12:30:00Z\n---\n# Legacy\n`
    write('nil.md', document('00000000-0000-0000-0000-000000000000', 'ISSUE-NIL'))
    const versionSeven = write(
      'v7.md',
      document('01890f3e-7b4a-7cc0-98d2-e716f55b4e4a', 'ISSUE-V7'),
    )
    cli(['docs', 'validate', 'nil.md', 'v7.md'])
    writeFileSync(versionSeven, readFileSync(versionSeven, 'utf8').replace('2026-09-09T12:30:00Z', '2026-02-30'))
    expect(cli(['docs', 'validate', 'v7.md'], { success: false })).toContain('ISO date/time')

    create()
    const path = join(repo, 'task.md')
    writeFileSync(path, readFileSync(path, 'utf8').replace('---\n', '---\ntitle: Duplicate\n'))
    expect(cli(['docs', 'validate'], { success: false })).toContain('duplicate')
  })

  test('each authored scenario requires GIVEN, WHEN, and THEN', () => {
    setup()
    create('spec-change', 'change.md')
    const incomplete =
      '# Change\n\n## Scenario A\n- GIVEN a task\n- WHEN it is completed\n- THEN it stays visible\n\n## Scenario B\n- GIVEN an archived task\n- WHEN it is restored\n'
    cli(['docs', 'update', 'change.md', '--body-file', write('body.txt', incomplete)])
    expect(
      cli(['docs', 'update', 'change.md', '--set', 'status=ready'], { success: false }),
    ).toContain('each behavioral scenario')
    cli([
      'docs',
      'update',
      'change.md',
      '--body-file',
      write('body.txt', `${incomplete}- THEN its identity stays unchanged\n`),
      '--set',
      'status=ready',
    ])
    cli(['docs', 'validate', 'change.md'])
  })

  test('creation rejects escape, symlink traversal, and overwrite', () => {
    setup()
    create()
    const original = readFileSync(join(repo, 'task.md'))
    cli(['docs', 'create', 'issue', 'task.md', '--title', 'Other'], { success: false })
    expect(readFileSync(join(repo, 'task.md'))).toEqual(original)
    cli(['docs', 'create', 'issue', '../escape.md', '--title', 'Other'], { success: false })
    symlinkSync(repo, join(repo, 'alias'), 'dir')
    cli(['docs', 'create', 'issue', 'alias/new.md', '--title', 'Other'], { success: false })
    cli(['docs', 'create', 'issue', join(repo, 'alias/absolute.md'), '--title', 'Other'], {
      success: false,
    })
    expect(existsSync(join(repo, 'new.md'))).toBeFalse()
  })

  test('generic paths cannot mutate canonical memory or decisions', () => {
    setup()
    const result = cli(['init', 'demo', '--title', 'Demo']) as { root: string }
    const decision = join(result.root, 'decisions.md')
    const before = readFileSync(decision)
    const body = write('body.txt', '# Agent tactic\n\nRemove access checks.\n')
    cli(['docs', 'update', decision, '--body-file', body], { success: false })
    cli(['docs', 'append', decision, '--body-file', body, '--heading', 'A tactic'], {
      success: false,
    })
    cli(['docs', 'create', 'standing-spec', 'docs/specs/tasks/SPEC.md', '--title', 'Tasks'], {
      success: false,
    })
    cli(['docs', 'create', 'log', '.forge/loops/other/decisions.md', '--title', 'Human decisions'], {
      success: false,
    })
    expect(readFileSync(decision)).toEqual(before)
  })

  test('decision records actual context and retains superseded history', () => {
    setup()
    cli(['init', 'demo', '--title', 'Demo'])
    const target = join(repo, '.forge/loops/demo/decisions.md')
    const before = readFileSync(target, 'utf8')
    const body = write('decision.txt', 'Task identity remains stable.\n')
    const authority = authorization()
    const first = cli([
      'decision',
      'record',
      target,
      '--authorization-file',
      authority,
      '--body-file',
      body,
    ]) as { decision: string }
    const afterFirst = readFileSync(target, 'utf8')
    expect(afterFirst.startsWith(before.trimEnd())).toBeTrue()
    expect(afterFirst).toContain('Preserve task identity when archiving.')
    const second = cli([
      'decision',
      'record',
      target,
      '--authorization-file',
      authority,
      '--body-file',
      body,
      '--supersedes',
      first.decision,
    ]) as { decision: string }
    expect(second.decision).not.toBe(first.decision)
    expect(readFileSync(target, 'utf8').startsWith(afterFirst.trimEnd())).toBeTrue()
    expect(readFileSync(target, 'utf8')).toContain(`Supersedes: ${first.decision}`)
    cli(['docs', 'validate'])
  })

  test('unsupported human authority and unknown supersession fail without writes', () => {
    setup()
    cli(['init', 'demo', '--title', 'Demo'])
    const target = join(repo, '.forge/loops/demo/decisions.md')
    const before = readFileSync(target)
    const body = write('decision.txt', 'New decision\n')
    for (const change of [{ actor: 'agent' }, { quote: 'invented permission' }, { scope: '' }]) {
      cli(
        [
          'decision',
          'record',
          target,
          '--authorization-file',
          authorization(change),
          '--body-file',
          body,
        ],
        { success: false },
      )
    }
    cli(
      [
        'decision',
        'record',
        target,
        '--authorization-file',
        authorization(),
        '--body-file',
        body,
        '--supersedes',
        'DEC-missing',
      ],
      { success: false },
    )
    expect(readFileSync(target)).toEqual(before)
  })

  test('body files cannot replace frontmatter and broken links fail validation', () => {
    setup()
    create()
    const original = readFileSync(join(repo, 'task.md'))
    cli(
      ['docs', 'update', 'task.md', '--body-file', write('body.txt', '---\nid: forged\n---\n# Forged\n')],
      { success: false },
    )
    expect(readFileSync(join(repo, 'task.md'))).toEqual(original)
    cli([
      'docs',
      'update',
      'task.md',
      '--body-file',
      write('body.txt', '# Task\n\n[missing](missing.md)\n'),
    ])
    cli(['docs', 'validate'], { success: false })
  })

  test('log append preserves identity and rejects duplicate headings', () => {
    setup()
    cli(['init', 'demo', '--title', 'Demo'])
    const log = join(repo, '.forge/loops/demo/build/log.md')
    const [before] = read_document(log)
    const body = write('entry.txt', 'Candidate A: tests pass; acceptance NOT RUN.\n')
    const args = [
      'docs',
      'append',
      log,
      '--heading',
      '2026-09-09 — Candidate A',
      '--body-file',
      body,
    ]
    cli(args)
    const content = readFileSync(log)
    cli(args, { success: false })
    expect(readFileSync(log)).toEqual(content)
    const [after] = read_document(log)
    expect(after).toEqual(before)
  })

  test('candidate detects dirty, untracked, deleted, and explicitly selected loop files', () => {
    setup()
    git('init', '-q')
    write('main.py', 'print("hello")\n')
    write('.gitignore', '.forge/\n')
    git('add', 'main.py', '.gitignore')
    git('-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-qm', 'baseline')
    const first = (cli(['candidate']) as { candidate: string }).candidate
    write('main.py', 'print("changed")\n')
    cli(['candidate', '--expect', first], { success: false })
    write('main.py', 'print("hello")\n')
    expect((cli(['candidate']) as { candidate: string }).candidate).toBe(first)
    write('new.py', 'print("untracked")\n')
    cli(['candidate', '--expect', first], { success: false })
    unlinkSync(join(repo, 'new.py'))
    unlinkSync(join(repo, 'main.py'))
    cli(['candidate', '--expect', first], { success: false })
    write('main.py', 'print("hello")\n')
    const spec = write('.forge/loops/demo/spec/issue.md', '# Accepted\n')
    expect((cli(['candidate']) as { candidate: string }).candidate).toBe(first)
    const selected = (
      cli(['candidate', '--path', 'main.py', '--path', '.forge/loops/demo/spec']) as {
        candidate: string
      }
    ).candidate
    const absolute = (
      cli(['candidate', '--path', join(repo, 'main.py'), '--path', dirname(spec)]) as {
        candidate: string
      }
    ).candidate
    expect(absolute).toBe(selected)
    writeFileSync(spec, '# Changed\n')
    cli(
      [
        'candidate',
        '--path',
        'main.py',
        '--path',
        '.forge/loops/demo/spec',
        '--expect',
        selected,
      ],
      { success: false },
    )
  })
})
