import {
  closeSync,
  existsSync,
  fsyncSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { homedir } from 'node:os'
import {
  basename,
  dirname,
  extname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from 'node:path'
import { randomUUID } from 'node:crypto'
import { ForgeError } from './errors.ts'
import { withMutationLock } from './lock.ts'
import { TEMPLATES } from './templates.ts'

export type Metadata = Record<string, unknown>
export type Identity = Record<'id' | 'code' | 'type', string>
export type Registry = Record<string, Identity>

export const KINDS = new Set(
  'index decisions log build-log product design tech work issue bug plan spec-change standing-spec visual acceptance review ship concept kb-decision process interface kb-index kb-log'.split(
    ' ',
  ),
)
export const IDENTITY_FIELDS = new Set(['id', 'code', 'type'] as const)

const REQUIRED = new Set(['id', 'code', 'type', 'title', 'status', 'createdAt', 'updatedAt'])
const CODE = /^[A-Za-z0-9]+(?:[-_.][A-Za-z0-9]+)*$/

function expandUser(path: string): string {
  if (path === '~') return homedir()
  if (path.startsWith(`~${sep}`)) return join(homedir(), path.slice(2))
  return path
}

function isWithin(root: string, path: string): boolean {
  const rel = relative(root, path)
  return rel === '' || (!rel.startsWith(`..${sep}`) && rel !== '..' && !isAbsolute(rel))
}

export function contained_path(
  rootInput: string,
  candidate: string,
  options: { must_exist?: boolean } = {},
): string {
  const originalRoot = resolve(expandUser(rootInput))
  let root: string
  try {
    root = realpathSync(originalRoot)
  } catch {
    throw new ForgeError(`path must exist within repository: ${originalRoot}`)
  }

  const expanded = expandUser(candidate)
  let raw: string
  if (!isAbsolute(expanded)) {
    raw = resolve(root, expanded)
  } else if (isWithin(originalRoot, resolve(expanded))) {
    raw = resolve(root, relative(originalRoot, resolve(expanded)))
  } else {
    raw = resolve(expanded)
    let parent = dirname(raw)
    while (parent !== dirname(parent)) {
      const status = lstatSync(parent, { throwIfNoEntry: false })
      if (status && !status.isSymbolicLink()) {
        try {
          if (realpathSync(parent) === root) {
            raw = resolve(root, relative(parent, raw))
            break
          }
        } catch {
          // A disappearing ancestor is rejected by the containment check below.
        }
      }
      parent = dirname(parent)
    }
  }

  let probe = raw
  while (probe !== root && probe !== dirname(probe)) {
    if (lstatSync(probe, { throwIfNoEntry: false })?.isSymbolicLink()) {
      throw new ForgeError(`symlink paths are not managed: ${raw}`)
    }
    probe = dirname(probe)
  }

  let path = raw
  if (options.must_exist) {
    try {
      path = realpathSync(raw)
    } catch {
      throw new ForgeError(`path must exist within repository: ${raw}`)
    }
  }
  if (!isWithin(root, path)) throw new ForgeError(`path must exist within repository: ${raw}`)
  return path
}

function parts(content: string): [string, string, string] {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(content)
  if (!match || match[1] === undefined) throw new ForgeError('document requires YAML frontmatter')
  return [match[1], content.slice(match[0].length), match[0]]
}

export function parse_document(content: string): [Metadata, string] {
  const [header, body] = parts(content)
  const metadata: Metadata = {}
  for (const line of header.split(/\r?\n/)) {
    if (!line.trim() || line.startsWith('#') || line.startsWith(' ') || line.startsWith('\t')) {
      continue
    }
    const match = /^([A-Za-z][A-Za-z0-9_-]*):(?:[ \t]*(.*))?$/.exec(line)
    if (!match || match[1] === undefined) {
      throw new ForgeError(`unsupported top-level frontmatter line: ${line}`)
    }
    const key = match[1]
    const value = match[2] ?? ''
    if (Object.hasOwn(metadata, key)) throw new ForgeError(`duplicate frontmatter field: ${key}`)
    try {
      metadata[key] = JSON.parse(value)
    } catch {
      metadata[key] =
        value.startsWith("'") && value.endsWith("'")
          ? value.slice(1, -1).replaceAll("''", "'")
          : value
    }
  }
  return [metadata, body]
}

export function read_utf8(path: string): string {
  try {
    // Keep a valid BOM as text; fatal decoding must never replace malformed bytes.
    return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(readFileSync(path))
  } catch (error) {
    if (error instanceof TypeError) throw new ForgeError(`file must be UTF-8: ${path}`)
    throw error
  }
}

export function read_document(path: string): [Metadata, string] {
  return parse_document(read_utf8(path))
}

export function serialize_document(metadata: Metadata, body: string): string {
  const header = Object.entries(metadata)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}\n`)
    .join('')
  return `---\n${header}---\n${body.replace(/^\n+/, '')}`
}

function stringField(metadata: Metadata, field: string): string {
  const value = metadata[field]
  if (typeof value !== 'string') throw new ForgeError(`${field} must be a non-empty scalar string`)
  return value
}

function isUuid(value: string): boolean {
  const normalized = value
    .replace(/^urn:uuid:/i, '')
    .replace(/^\{([\s\S]*)\}$/, '$1')
    .replaceAll('-', '')
  return /^[0-9a-f]{32}$/i.test(normalized)
}

export function isIsoDateTime(value: string): boolean {
  const match =
    /^(\d{4})-?(\d{2})-?(\d{2})(?:[T ](\d{2})(?::?(\d{2}))?(?::?(\d{2})(?:[.,]\d+)?)?(?:Z|[+-](\d{2})(?::?(\d{2}))?)?)?$/.exec(
      value,
    )
  if (!match) return false
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > (days[month - 1] ?? 0)) return false
  const [, , , , hour = '0', minute = '0', second = '0', offsetHour = '0', offsetMinute = '0'] =
    match
  return (
    Number(hour) <= 23 &&
    Number(minute) <= 59 &&
    Number(second) <= 59 &&
    Number(offsetHour) <= 23 &&
    Number(offsetMinute) <= 59
  )
}

export function validate_document_content(content: string, expected_kind?: string): Metadata {
  const [metadata, body] = parse_document(content)
  const missing = [...REQUIRED].filter((key) => !Object.hasOwn(metadata, key)).sort()
  if (missing.length) throw new ForgeError(`missing metadata: ${missing.join(', ')}`)
  for (const key of REQUIRED) {
    if (typeof metadata[key] !== 'string' || !(metadata[key] as string).trim()) {
      throw new ForgeError(`${key} must be a non-empty scalar string`)
    }
  }

  const id = stringField(metadata, 'id')
  if (!isUuid(id)) {
    throw new ForgeError('id must be a UUID assigned by Forge')
  }
  const code = stringField(metadata, 'code')
  if (!CODE.test(code)) {
    throw new ForgeError('code must contain letters/numbers separated by -, _, or .')
  }
  const kind = stringField(metadata, 'type')
  if (!KINDS.has(kind) || (expected_kind && kind !== expected_kind)) {
    throw new ForgeError(`unsupported or mismatched document type: ${kind}`)
  }
  for (const key of ['createdAt', 'updatedAt']) {
    const value = stringField(metadata, key)
    if (!isIsoDateTime(value)) throw new ForgeError(`${key} must be an ISO date/time`)
  }
  if (!/^#\s+\S/m.test(body)) throw new ForgeError('document body requires a descriptive title')

  if (metadata.status !== 'draft') {
    if (kind === 'issue' || kind === 'bug') {
      for (const heading of ['Context', 'Acceptance Criteria']) {
        if (!new RegExp(`^#{1,3}\\s+${heading}\\s*$`, 'm').test(body)) {
          throw new ForgeError(`${kind} requires ${heading}`)
        }
      }
    }
    if (kind === 'spec-change' || kind === 'standing-spec') {
      const scenarios = body.split(/^#{1,6}\s+.*$/m).flatMap((section) => {
        const fields = new Set(
          [...section.matchAll(/^\s*(?:[-*]\s*)?(?:\*\*)?(GIVEN|WHEN|THEN)\b/gim)].map(
            (match) => match[1]?.toUpperCase(),
          ),
        )
        return fields.size ? [fields] : []
      })
      if (
        !scenarios.length ||
        scenarios.some(
          (fields) => fields.size !== 3 || !['GIVEN', 'WHEN', 'THEN'].every((field) => fields.has(field)),
        )
      ) {
        throw new ForgeError('each behavioral scenario requires GIVEN, WHEN, and THEN fields')
      }
    }
  }
  return metadata
}

export function _registry(repo: string): Registry {
  const path = contained_path(repo, '.forge/identities.json')
  if (!existsSync(path)) return {}
  try {
    const value: unknown = JSON.parse(read_utf8(path))
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('expected object')
    for (const [path, identity] of Object.entries(value)) {
      if (
        typeof path !== 'string' ||
        !identity ||
        typeof identity !== 'object' ||
        Array.isArray(identity) ||
        Object.keys(identity).sort().join(',') !== 'code,id,type'
      ) {
        throw new Error('expected path to id/code/type records')
      }
      if (Object.values(identity).some((item) => typeof item !== 'string' || !item)) {
        throw new Error('identity values must be nonempty strings')
      }
    }
    return value as Registry
  } catch (error) {
    throw new ForgeError(`invalid identity registry: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export function _write_atomic(path: string, content: string | Uint8Array): void {
  mkdirSync(dirname(path), { recursive: true })
  const temporary = join(dirname(path), `.${basename(path)}-${randomUUID()}`)
  const descriptor = openSync(temporary, 'wx')
  try {
    writeFileSync(descriptor, content)
    fsyncSync(descriptor)
    closeSync(descriptor)
    renameSync(temporary, path)
  } catch (error) {
    try {
      closeSync(descriptor)
    } catch {
      // The descriptor was already closed after a successful flush.
    }
    throw error
  } finally {
    if (existsSync(temporary)) unlinkSync(temporary)
  }
}

function identity(metadata: Metadata): Identity {
  return {
    id: stringField(metadata, 'id'),
    code: stringField(metadata, 'code'),
    type: stringField(metadata, 'type'),
  }
}

function sameIdentity(left: Identity | undefined, right: Identity): boolean {
  return !!left && [...IDENTITY_FIELDS].every((key) => left[key] === right[key])
}

function relativePath(repo: string, path: string): string {
  return relative(realpathSync(repo), contained_path(repo, path)).split(sep).join('/')
}

function sortedRegistry(registry: Registry): Registry {
  return Object.fromEntries(
    Object.entries(registry).sort(([left], [right]) => Buffer.compare(Buffer.from(left), Buffer.from(right))),
  )
}

function writeRegistry(repo: string, registry: Registry): void {
  _write_atomic(
    contained_path(repo, '.forge/identities.json'),
    `${JSON.stringify(sortedRegistry(registry), null, 2)}\n`,
  )
}

export function set_registered_identity(
  repo: string,
  path: string,
  next: Identity | null,
  options: { transfer_from?: string } = {},
): void {
  withMutationLock(repo, () => {
    const target = relativePath(repo, path)
    const source = options.transfer_from ? relativePath(repo, options.transfer_from) : null
    const registry = _registry(repo)
    if (source && source !== target) {
      if (next === null || !sameIdentity(registry[source], next)) {
        throw new ForgeError('registered transfer source identity changed')
      }
      delete registry[source]
    }
    if (next === null) {
      delete registry[target]
      writeRegistry(repo, registry)
      return
    }
    if (!isUuid(next.id)) throw new ForgeError('registered identity id must be a UUID')
    if (!CODE.test(next.code)) throw new ForgeError('registered identity code is invalid')
    if (!next.type.trim()) throw new ForgeError('registered identity type is required')
    for (const [other, existing] of Object.entries(registry)) {
      if (other !== target && (existing.id === next.id || existing.code === next.code)) {
        throw new ForgeError(`duplicate id/code with ${other}`)
      }
    }
    registry[target] = next
    writeRegistry(repo, registry)
  })
}

export function check_identity(repo: string, path: string, metadata: Metadata): Metadata {
  const relative = relativePath(repo, path)
  const registry = _registry(repo)
  const current = identity(metadata)
  const previous = registry[relative]
  if (previous && [...IDENTITY_FIELDS].some((key) => previous[key] !== current[key])) {
    throw new ForgeError(`immutable identity changed: ${relative}`)
  }
  for (const [other, existing] of Object.entries(registry)) {
    if (other !== relative && (existing.id === current.id || existing.code === current.code)) {
      throw new ForgeError(`duplicate id/code with ${other}`)
    }
  }
  return metadata
}

export function register_document(repo: string, path: string, content: string): Metadata {
  return withMutationLock(repo, () => {
    const metadata = validate_document_content(content)
    check_identity(repo, path, metadata)
    const registry = _registry(repo)
    registry[relativePath(repo, path)] = identity(metadata)
    writeRegistry(repo, registry)
    return metadata
  })
}

export function unregister_identity(
  repo: string,
  path: string,
  content: string,
  options: { dry_run?: boolean } = {},
): Metadata {
  return withMutationLock(repo, () => {
    const relative = relativePath(repo, path)
    const metadata = validate_document_content(content)
    const registry = _registry(repo)
    const previous = registry[relative]
    const current = identity(metadata)
    if (previous && !sameIdentity(previous, current)) {
      throw new ForgeError('removed document does not match its registered identity')
    }
    if (!options.dry_run && previous) {
      delete registry[relative]
      writeRegistry(repo, registry)
    }
    return metadata
  })
}

export function transfer_identity(
  repo: string,
  source_path: string,
  target_path: string,
  content: string,
  options: { dry_run?: boolean } = {},
): Metadata {
  return withMutationLock(repo, () => {
    const source = relativePath(repo, contained_path(repo, source_path, { must_exist: true }))
    const target = relativePath(repo, target_path)
    const metadata = validate_document_content(content)
    const registry = _registry(repo)
    const current = identity(metadata)
    if (!sameIdentity(registry[source], current) || Object.hasOwn(registry, target)) {
      throw new ForgeError('identity transfer needs its registered draft and an unused target')
    }
    for (const [other, existing] of Object.entries(registry)) {
      if (other !== source && (existing.id === current.id || existing.code === current.code)) {
        throw new ForgeError(`duplicate id/code with ${other}`)
      }
    }
    if (!options.dry_run) {
      registry[target] = registry[source] as Identity
      delete registry[source]
      writeRegistry(repo, registry)
    }
    return metadata
  })
}

function protectedTarget(repo: string, path: string, kind: string): boolean {
  const relative = relativePath(repo, path)
  return (
    kind === 'decisions' ||
    basename(relative) === 'decisions.md' ||
    relative.startsWith('docs/specs/') ||
    relative.startsWith('docs/knowledge/')
  )
}

export function create_document(
  repo: string,
  kind: string,
  path: string,
  title: string,
  code?: string,
  body_file?: string,
  options: { _guarded?: boolean; _status?: string; _body?: string } = {},
): Record<string, unknown> {
  return withMutationLock(repo, () => {
    if (!KINDS.has(kind)) throw new ForgeError(`unknown template kind: ${kind}`)
    const target = contained_path(repo, path)
    if (protectedTarget(repo, target, kind) && !options._guarded) {
      throw new ForgeError(`${kind} requires the dedicated decision or memory operation`)
    }
    if (extname(target) !== '.md' || existsSync(target)) {
      throw new ForgeError('create needs an unused .md path')
    }
    let body = body_file ? read_utf8(body_file) : options._body ?? TEMPLATES[kind]
    if (body === undefined) throw new ForgeError(`unknown template kind: ${kind}`)
    if (body.startsWith('---\n')) [, body] = parse_document(body)
    if (!body.trim()) throw new ForgeError('document body is empty')
    if (!/^#\s+\S/m.test(body)) body = `# ${title}\n\n${body}`
    const id = randomUUID()
    const timestamp = new Date().toISOString()
    const status = options._status ?? 'draft'
    const metadata: Metadata = {
      id,
      code: code ?? `${kind.toUpperCase()}-${id.slice(0, 8)}`,
      type: kind,
      title,
      status,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    const content = serialize_document(metadata, body)
    validate_document_content(content)
    check_identity(repo, target, metadata)
    mkdirSync(dirname(target), { recursive: true })
    const descriptor = openSync(target, 'wx')
    writeFileSync(descriptor, content)
    closeSync(descriptor)
    try {
      register_document(repo, target, content)
    } catch (error) {
      unlinkSync(target)
      throw error
    }
    return { path: target, id, code: metadata.code, status }
  })
}

function editMetadata(content: string, fields: Metadata): string {
  const [header, body] = parts(content)
  const lines = header.match(/.*(?:\r?\n|$)/g)?.filter(Boolean) ?? []
  for (const [key, value] of Object.entries(fields)) {
    if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(key)) throw new ForgeError('invalid metadata key')
    if (IDENTITY_FIELDS.has(key as 'id' | 'code' | 'type') || key === 'createdAt') {
      throw new ForgeError(`${key} is immutable`)
    }
    const start = lines.findIndex((line) => line.startsWith(`${key}:`))
    const encoded = JSON.stringify(value)
    if (encoded === undefined) throw new ForgeError(`unsupported metadata value: ${key}`)
    const replacement = `${key}: ${encoded}\n`
    if (start < 0) {
      if (lines.length && !lines[lines.length - 1]?.endsWith('\n')) {
        lines[lines.length - 1] += '\n'
      }
      lines.push(replacement)
    } else {
      let end = start + 1
      while (end < lines.length && (/^[ \t]/.test(lines[end] ?? '') || !(lines[end] ?? '').trim())) {
        end += 1
      }
      lines.splice(start, end - start, replacement)
    }
  }
  return `---\n${lines.join('').replace(/\n$/, '')}\n---\n${body}`
}

export function update_document(
  repo: string,
  path: string,
  body_file?: string,
  fields?: Metadata,
): Record<string, unknown> {
  return withMutationLock(repo, () => {
    const target = contained_path(repo, path, { must_exist: true })
    const old = read_utf8(target)
    const metadata = validate_document_content(old)
    check_identity(repo, target, metadata)
    if (protectedTarget(repo, target, stringField(metadata, 'type'))) {
      throw new ForgeError('generic updates cannot write protected decisions or canonical memory')
    }
    let content = old
    if (body_file) {
      const [, , prefix] = parts(old)
      const body = read_utf8(body_file)
      if (body.startsWith('---\n')) {
        throw new ForgeError('body-file must contain only the Markdown body')
      }
      content = prefix + body
    }
    if (fields && Object.keys(fields).length) content = editMetadata(content, fields)
    validate_document_content(content)
    _write_atomic(target, content)
    return { path: target, id: metadata.id, changed: content !== old }
  })
}

export function authorization_context(repo: string, path: string): Metadata {
  const source = contained_path(repo, path, { must_exist: true })
  let context: unknown
  try {
    context = JSON.parse(read_utf8(source))
  } catch {
    throw new ForgeError('authorization context must be a JSON file')
  }
  if (!context || typeof context !== 'object' || Array.isArray(context)) {
    throw new ForgeError('authorization context must be a JSON object')
  }
  const metadata = context as Metadata
  for (const key of ['actor', 'source', 'quote', 'scope', 'date']) {
    if (typeof metadata[key] !== 'string' || !(metadata[key] as string).trim()) {
      throw new ForgeError(`authorization requires actual ${key} context`)
    }
  }
  if (metadata.actor !== 'human') {
    throw new ForgeError('agent proposals cannot be recorded as human decisions')
  }
  if (!isIsoDateTime(metadata.date as string)) {
    throw new ForgeError('authorization date must be ISO format')
  }
  const sourceReference = metadata.source as string
  if (!/^https?:\/\//.test(sourceReference)) {
    const transcript = contained_path(repo, sourceReference, { must_exist: true })
    if (!read_utf8(transcript).includes(metadata.quote as string)) {
      throw new ForgeError('authorization quote is absent from its source')
    }
  }
  return metadata
}

export function init_loop(repo: string, loop_id: string, title: string): Record<string, unknown> {
  return withMutationLock(repo, () => {
    if (!CODE.test(loop_id)) throw new ForgeError('loop id must be a readable path-safe code')
    const root = contained_path(repo, `.forge/loops/${loop_id}`)
    if (existsSync(root)) throw new ForgeError('loop already exists')
    const created = [
      create_document(repo, 'index', join(root, 'index.md'), title, undefined, undefined, {
        _guarded: true,
        _status: 'active',
      }),
      create_document(repo, 'decisions', join(root, 'decisions.md'), 'Human decisions', undefined, undefined, {
        _guarded: true,
        _status: 'active',
      }),
      create_document(repo, 'log', join(root, 'log.md'), 'Execution log', undefined, undefined, {
        _guarded: true,
        _status: 'active',
      }),
      create_document(repo, 'build-log', join(root, 'build/log.md'), 'Build and independent Review', undefined, undefined, {
        _guarded: true,
        _status: 'active',
        _body: '# Build and independent Review\n\n<!-- Append candidate and Review entries when Build begins. -->\n',
      }),
    ]
    return { root, created, phase: 'Spec', verification: 'NOT RUN' }
  })
}

export function append_record(
  repo: string,
  path: string,
  heading: string,
  body_file: string,
): Record<string, unknown> {
  return withMutationLock(repo, () => {
    const target = contained_path(repo, path, { must_exist: true })
    const content = read_utf8(target)
    const metadata = validate_document_content(content)
    check_identity(repo, target, metadata)
    if (!['log', 'build-log', 'kb-log'].includes(stringField(metadata, 'type'))) {
      throw new ForgeError('append only supports execution logs; use decision record for human decisions')
    }
    if (!heading.trim() || heading.includes('\n') || heading.includes('\r')) {
      throw new ForgeError('heading must be one nonempty line')
    }
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (new RegExp(`^## ${escaped}\\s*$`, 'm').test(content)) {
      throw new ForgeError('duplicate log heading')
    }
    const body = read_utf8(body_file).trim()
    if (!body) throw new ForgeError('log body is empty')
    _write_atomic(target, `${content.trimEnd()}\n\n## ${heading}\n\n${body}\n`)
    return { path: target, heading }
  })
}

export { readlinkSync, statSync }
