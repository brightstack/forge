import fs from 'node:fs'

const source = fs.readFileSync(new URL('../src/records.js', import.meta.url), 'utf8')
if (!/assertExactKeys\s*\(\s*JSON\.parse\s*\(/.test(source)) {
  console.error('src/records.js must validate JSON.parse output with assertExactKeys')
  process.exit(1)
}
console.log('public-boundary exact-key validation: PASS')
