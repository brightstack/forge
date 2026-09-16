export function summarize(items) {
  const totals = items.reduce(
    (bySku, { sku, quantity }) => bySku.set(sku, (bySku.get(sku) ?? 0) + quantity),
    new Map(),
  )
  return Array.from(totals, ([sku, quantity]) => ({ sku, quantity }))
}
