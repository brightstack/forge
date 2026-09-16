export function summarize(items) {
  const totals = new Map()
  for (const item of items) {
    totals.set(item.sku, (totals.get(item.sku) ?? 0) + item.quantity)
  }
  const result = []
  for (const [sku, quantity] of totals) result.push({ sku, quantity })
  return result
}
