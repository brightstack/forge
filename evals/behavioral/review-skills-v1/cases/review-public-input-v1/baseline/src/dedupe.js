export function dedupeEvents(events) {
  const seen = new Set()
  const result = []
  for (const event of events) {
    const key = `${event.tenantId}\u0000${event.eventId}`
    if (seen.has(key)) continue
    seen.add(key)
    result.push(event)
  }
  return result
}
