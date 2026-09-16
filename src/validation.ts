import { createHash } from 'node:crypto'
import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  statSync,
} from 'node:fs'
import { dirname, extname, relative, resolve, sep } from 'node:path'
import { spawnSync } from 'node:child_process'
import { ForgeError } from './errors.ts'
import {
  _registry,
  check_identity,
  contained_path,
  read_utf8,
  validate_document_content,
} from './records.ts'

function repoRelative(repo: string, path: string): string {
  return relative(repo, path).split(sep).join('/') || '.'
}

function metadataString(metadata: Record<string, unknown>, field: string): string {
  const value = metadata[field]
  if (typeof value !== 'string') throw new ForgeError(`${field} must be a string`)
  return value
}

export function validate_documents(
  repoInput: string,
  paths?: string[],
): Record<string, unknown> {
  const repo = contained_path(repoInput, '.', { must_exist: true })
  const registry = _registry(repo)
  const selected = paths?.length
    ? paths
    : Object.keys(registry).filter((path) => !path.startsWith('docs/knowledge/'))
  const checked: string[] = []
  const identifiers = new Map<string, string>()
  const codes = new Map<string, string>()

  for (const [registeredPath, identity] of Object.entries(registry)) {
    for (const [field, seen] of [
      ['id', identifiers],
      ['code', codes],
    ] as const) {
      const value = identity[field]
      const previous = seen.get(value)
      if (previous) throw new ForgeError(`duplicate ${field}: ${registeredPath} and ${previous}`)
      seen.set(value, registeredPath)
    }
  }

  for (const raw of selected) {
    const path = contained_path(repo, raw, { must_exist: true })
    const relativePath = repoRelative(repo, path)
    if (relativePath.startsWith('docs/knowledge/')) {
      throw new ForgeError('canonical knowledge uses kb verify')
    }
    const content = read_utf8(path)
    const metadata = validate_document_content(content)
    check_identity(repo, path, metadata)
    for (const [field, seen] of [
      ['id', identifiers],
      ['code', codes],
    ] as const) {
      const value = metadataString(metadata, field)
      const previous = seen.get(value)
      if (previous && previous !== relativePath) {
        throw new ForgeError(`duplicate ${field}: ${relativePath} and ${previous}`)
      }
      seen.set(value, relativePath)
    }

    for (const match of content.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
      let reference = (match[1] ?? '').trim().split(' "', 1)[0]?.replace(/^<|>$/g, '') ?? ''
      if (/^[A-Za-z][A-Za-z0-9+.-]*:/.test(reference)) continue
      const hash = reference.indexOf('#')
      const fragment = hash >= 0 ? reference.slice(hash + 1) : ''
      reference = hash >= 0 ? reference.slice(0, hash) : reference
      const query = reference.indexOf('?')
      if (query >= 0) reference = reference.slice(0, query)
      if (!reference) continue
      const decodedPath = decodeURIComponent(reference)
      const destination = contained_path(repo, resolve(dirname(path), decodedPath), {
        must_exist: true,
      })
      if (fragment && extname(destination) === '.md') {
        const headings = [...read_utf8(destination).matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)]
        const anchors = new Set(
          headings.map((heading) =>
            (heading[1] ?? '')
              .toLowerCase()
              .replace(/[^\p{L}\p{N}_\- ]/gu, '')
              .replaceAll(' ', '-'),
          ),
        )
        if (!anchors.has(decodeURIComponent(fragment))) {
          throw new ForgeError(`missing reference anchor: ${match[1]} in ${relativePath}`)
        }
      }
    }
    checked.push(relativePath)
  }
  return {
    checked,
    scope: 'structure, identities, local links; not approval or execution proof',
  }
}

function contains(selected: string, name: string): boolean {
  const clean = selected.replace(/\/$/, '')
  return clean === '.' || name === clean || name.startsWith(`${clean}/`)
}

function git(repo: string, ...args: string[]): Buffer {
  const result = spawnSync('git', ['-C', repo, ...args], { encoding: 'buffer' })
  if (result.status !== 0) {
    const stderr = result.stderr?.toString().trim()
    throw new ForgeError(stderr || 'candidate requires a git repository')
  }
  return result.stdout ?? Buffer.alloc(0)
}

function walk(repo: string, directory: string, names: Map<string, Buffer>): void {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git') continue
    const path = resolve(directory, entry.name)
    const relativePath = repoRelative(repo, path)
    const status = lstatSync(path)
    if (status.isSymbolicLink()) {
      names.set(relativePath, Buffer.from(relativePath))
    } else if (status.isDirectory()) {
      walk(repo, path, names)
    } else {
      names.set(relativePath, Buffer.from(relativePath))
    }
  }
}

export function candidate_snapshot(repoInput: string, paths?: string[]): Record<string, unknown> {
  const repo = contained_path(repoInput, '.', { must_exist: true })
  const selectedPaths = paths?.map((path) => contained_path(repo, path))
  const relativePaths = selectedPaths?.map((path) => repoRelative(repo, path))
  const scope = relativePaths?.length ? relativePaths : ['.']
  const head = git(repo, 'rev-parse', 'HEAD').toString().trim()
  const pathspecs = scope.map((path) => `:(literal)${path}`)
  const rawNames = git(
    repo,
    'ls-files',
    '-z',
    '--cached',
    '--others',
    '--exclude-standard',
    '--',
    ...pathspecs,
  ).subarray()
  const names = new Map<string, Buffer>()
  for (const raw of rawNames.toString().split('\0')) {
    if (raw) names.set(raw, Buffer.from(raw))
  }

  selectedPaths?.forEach((selectedPath, index) => {
    const selected = relativePaths?.[index]
    if (selected === undefined) return
    if (selected === '.git' || selected.startsWith('.git/')) {
      throw new ForgeError(`candidate paths cannot select .git metadata: ${selected}`)
    }
    if (!existsSync(selectedPath)) {
      if (![...names].some(([name]) => contains(selected, name))) {
        throw new ForgeError(`candidate path does not exist or contain tracked deletions: ${selected}`)
      }
      return
    }
    const status = lstatSync(selectedPath)
    if (!status.isDirectory()) {
      names.set(selected, Buffer.from(selected))
      return
    }
    walk(repo, selectedPath, names)
  })

  const digest = createHash('sha256')
  const sorted = [...names.values()].sort(Buffer.compare)
  for (const raw of sorted) {
    const name = raw.toString()
    if (
      (name === '.forge' || name.startsWith('.forge/')) &&
      !relativePaths?.some((selected) => contains(selected, name))
    ) {
      continue
    }
    const path = resolve(repo, name)
    digest.update(raw)
    digest.update('\0')
    const status = lstatSync(path, { throwIfNoEntry: false })
    if (status?.isSymbolicLink()) {
      digest.update('link\0')
      digest.update(readlinkSync(path))
    } else if (status?.isFile()) {
      digest.update('file\0')
      digest.update(String(statSync(path).mode & 0o777))
      digest.update('\0')
      digest.update(readFileSync(path))
    } else {
      digest.update('deleted\0')
    }
  }
  return {
    candidate: `git:${head}:sha256:${digest.digest('hex')}`,
    base: head,
    paths: scope,
    excludes:
      '.git metadata always; default candidate excludes .forge state, explicit --path includes selected ignored content',
  }
}
