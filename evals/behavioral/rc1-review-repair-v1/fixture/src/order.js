export function createOrder() {
  let items = []
  return {
    add(item) { items = [...items, { ...item }] },
    changeQuantity(id, quantity) { items = items.map((item) => item.id === id ? { ...item, quantity } : item) },
    remove(id) { items = items.filter((item) => item.id !== id) },
    items() { return items.map((item) => ({ ...item })) },
    subtotal() { return items.reduce((sum, item) => sum + item.price * item.quantity, 0) },
  }
}
