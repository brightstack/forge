import { expect, test } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const pack = join(import.meta.dir, '..')

test('package.json scripts that invoke a local file point at a real file', () => {
  const pkg = JSON.parse(readFileSync(join(pack, 'package.json'), 'utf8')) as {
    scripts: Record<string, string>
  }
  for (const [name, command] of Object.entries(pkg.scripts)) {
    for (const match of command.matchAll(/\bbun(?:\s+run)?\s+(\S+\.(?:ts|js|mjs|cjs))\b/g)) {
      const file = match[1]!
      expect(existsSync(join(pack, file)), `${name}: missing ${file}`).toBe(true)
    }
  }
})
