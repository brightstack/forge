export function assertExactKeys(value, allowed) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError('record must be an object')
  const unknown = Object.keys(value).filter(key => !allowed.includes(key))
  if (unknown.length) throw new TypeError(`unknown fields: ${unknown.join(', ')}`)
  return value
}
