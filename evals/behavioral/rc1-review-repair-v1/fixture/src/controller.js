export function createController(order) {
  let displayedSubtotal = order.subtotal()
  let lastItem

  return {
    add(item) {
      lastItem = { ...item }
      order.add(item)
      displayedSubtotal = order.subtotal()
    },
    changeQuantity(id, quantity) {
      order.changeQuantity(id, quantity)
    },
    remove(id) {
      order.remove(id)
      displayedSubtotal = order.subtotal()
    },
    quantityKeyDown(key) {
      if (key === 'Enter' && lastItem) this.add(lastItem)
    },
    displayedSubtotal() { return displayedSubtotal },
  }
}
