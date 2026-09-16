export function toggleFromDataset(store, dataset) {
  store.toggle(Number(dataset.id))
}

export function deleteFromDataset(store, dataset) {
  return store.remove(Number(dataset.id))
}
