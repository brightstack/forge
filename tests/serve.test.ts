import { afterEach, beforeEach, expect, test } from 'bun:test'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, renameSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawn, type ChildProcess } from 'node:child_process'

let root = ''
let artifact = ''
const children: ChildProcess[] = []
const command = process.env.FORGE_TEST_BINARY
  ? [resolve(process.env.FORGE_TEST_BINARY)]
  : [process.execPath, resolve(import.meta.dir, '../src/cli.ts')]

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'forge-serve-'))
  artifact = join(root, 'study')
  mkdirSync(join(artifact, 'frames'), { recursive: true })
  writeFileSync(join(artifact, 'index.html'), '<!doctype html><title>Study r1</title>')
  writeFileSync(join(artifact, 'frames/index.html'), '<link rel="stylesheet" href="theme.css">Frame')
  writeFileSync(join(artifact, 'frames/theme.css'), 'body { color: teal; }')
})

afterEach(async () => {
  for (const child of children.splice(0)) {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill('SIGKILL')
      await new Promise<void>(done => child.once('exit', () => done()))
    }
  }
  rmSync(root, { recursive: true, force: true })
})

function launch(args: string[], executable = command, cleanPath = false) {
  const child = spawn(executable[0]!, [...executable.slice(1), ...args], {
    cwd: root,
    env: { ...process.env, ...(cleanPath ? { PATH: '/nonexistent' } : {}) },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  children.push(child)
  let stdout = '', stderr = ''
  child.stdout!.on('data', chunk => { stdout += chunk })
  child.stderr!.on('data', chunk => { stderr += chunk })
  const exited = new Promise<number | null>((done, reject) => {
    child.once('error', reject)
    child.once('exit', code => done(code))
  })
  const ready = new Promise<{ url: string; root: string; port: number; pid: number }>((done, reject) => {
    const timer = setTimeout(() => reject(new Error(`No readiness: ${stderr}`)), 3000)
    child.stdout!.on('data', () => {
      if (stdout.includes('\n')) {
        clearTimeout(timer)
        try { done(JSON.parse(stdout.split('\n')[0]!)) } catch (error) { reject(error) }
      }
    })
    child.once('error', error => { clearTimeout(timer); reject(error) })
    child.once('exit', () => { clearTimeout(timer); reject(new Error(stderr || 'Exited before ready')) })
  })
  // Invalid-command cases inspect process exit instead of awaiting readiness.
  void ready.catch(() => {})
  return { child, ready, exited, output: () => ({ stdout, stderr }) }
}

test('serves live artifacts, relative directory links, MIME types and HEAD after readiness', async () => {
  writeFileSync(join(artifact, 'view.js'), 'document.title = "interactive";')
  writeFileSync(join(artifact, 'image.svg'), '<svg xmlns="http://www.w3.org/2000/svg"/>')
  writeFileSync(join(artifact, 'report.pdf'), '%PDF-1.7\n')
  writeFileSync(join(artifact, 'notes.md'), '# Notes')
  writeFileSync(join(artifact, 'space name.txt'), 'space')
  const process = launch(['serve', artifact, '--json'])
  const ready = await process.ready
  expect(ready.root).toBe(realpathSync(artifact))
  expect(ready.pid).toBe(process.child.pid!)
  expect(ready.port).toBeGreaterThan(0)
  expect(ready.url).toBe(`http://127.0.0.1:${ready.port}/`)
  const response = await fetch(ready.url)
  expect(response.status).toBe(200)
  expect(await response.text()).toContain('Study r1')
  expect(response.headers.get('cache-control')).toBe('no-store')
  expect(response.headers.get('x-content-type-options')).toBe('nosniff')
  const redirected = await fetch(`${ready.url}frames?mode=example`, { redirect: 'manual' })
  expect(redirected.status).toBe(308)
  expect(redirected.headers.get('location')).toBe(`${ready.url}frames/?mode=example`)
  expect(await (await fetch(`${ready.url}frames/`)).text()).toContain('href="theme.css"')
  for (const [path, type] of [['index.html', 'text/html'], ['frames/theme.css', 'text/css'], ['view.js', 'javascript'], ['image.svg', 'image/svg+xml'], ['report.pdf', 'application/pdf'], ['notes.md', 'text/markdown']]) {
    const asset = await fetch(`${ready.url}${path}`)
    expect(asset.status).toBe(200)
    expect(asset.headers.get('content-type')).toContain(type!)
    await asset.arrayBuffer()
  }
  expect(await (await fetch(`${ready.url}space%20name.txt`)).text()).toBe('space')
  const head = await fetch(ready.url, { method: 'HEAD' })
  expect(head.status).toBe(200)
  expect(head.headers.get('content-length')).toBe(String(readFileSync(join(artifact, 'index.html')).length))
  expect(await head.text()).toBe('')
  writeFileSync(join(artifact, 'index.html'), '<!doctype html><title>Study r2</title>')
  expect(await (await fetch(ready.url)).text()).toContain('Study r2')
})

test('contains requests to ordinary files in the selected root and rejects writes', async () => {
  writeFileSync(join(root, 'secret.txt'), 'outside')
  writeFileSync(join(artifact, '.env'), 'private')
  mkdirSync(join(artifact, '.git'))
  writeFileSync(join(artifact, '.git/config'), 'private')
  mkdirSync(join(artifact, 'empty'))
  symlinkSync(join(root, 'secret.txt'), join(artifact, 'escape.txt'))
  symlinkSync(root, join(artifact, 'linked'))
  symlinkSync(join(root, 'secret.txt'), join(artifact, 'empty/index.html'))
  const { url } = await launch(['serve', artifact, '--json']).ready
  for (const path of ['missing', 'empty/', 'escape.txt', 'linked/secret.txt', '.env', '%2eenv', '.git/config', '%2e%2e%2fsecret.txt', '..%2fsecret.txt']) {
    expect((await fetch(`${url}${path}`)).status, path).toBe(404)
  }
  for (const path of ['bad%00name', 'bad%5cname', '%ZZ']) {
    expect((await fetch(`${url}${path}`)).status, path).toBe(400)
  }
  expect((await fetch(url, { headers: { Host: 'external.example' } })).status).toBe(403)
  const write = await fetch(`${url}index.html`, { method: 'POST', body: 'overwrite' })
  expect(write.status).toBe(405)
  expect(write.headers.get('allow')).toBe('GET, HEAD')
  expect(readFileSync(join(artifact, 'index.html'), 'utf8')).toContain('Study r1')
  renameSync(artifact, join(root, 'moved'))
  symlinkSync(root, artifact)
  expect((await fetch(`${url}secret.txt`)).status).toBe(404)
})

test('reports occupied ports and invalid inputs without false readiness, and stops on signals', async () => {
  const first = launch(['serve', artifact, '--port', '0', '--json'])
  const { port, url } = await first.ready
  for (const args of [
    ['serve', artifact, '--port', String(port), '--json'],
    ...['-1', '65536', '1.5', 'abc', ''].map(value => ['serve', artifact, '--port', value, '--json']),
    ['serve', join(root, 'absent'), '--json'],
    ['serve', join(artifact, 'index.html'), '--json'],
  ]) {
    const failed = launch(args)
    expect(await failed.exited).not.toBe(0)
    expect(failed.output().stdout).toBe('')
    expect(failed.output().stderr).toContain('forge:')
  }
  first.child.kill('SIGTERM')
  expect(await first.exited).toBe(0)
  await expect(fetch(url)).rejects.toThrow()
  const second = launch(['serve', artifact, '--port', String(port), '--json'])
  expect((await second.ready).port).toBe(port)
  second.child.kill('SIGINT')
  expect(await second.exited).toBe(0)
}, 10000)

test('prints a human preview URL by default', async () => {
  const server = launch(['serve', artifact])
  await expect(server.ready).rejects.toThrow()
  expect(server.output().stdout).toContain('Serving ')
  expect(server.output().stdout).toMatch(/http:\/\/127\.0\.0\.1:\d+\//)
  server.child.kill('SIGTERM')
  expect(await server.exited).toBe(0)
})

;(process.env.FORGE_TEST_BINARY ? test : test.skip)('copied executable serves without a runtime, Git, or project dependencies on PATH', async () => {
  const binary = join(root, 'forge')
  copyFileSync(command[0]!, binary)
  const server = launch(['serve', artifact, '--json'], [binary], true)
  const { url } = await server.ready
  expect(await (await fetch(url)).text()).toContain('Study r1')
  server.child.kill('SIGTERM')
  expect(await server.exited).toBe(0)
})
