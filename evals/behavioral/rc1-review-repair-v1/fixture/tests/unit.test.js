import { expect, test } from 'bun:test'
import { createOrder } from '../src/order.js'

test('order model supports each operation', () => {
  const order = createOrder()
  order.add({ id: 1, price: 10, quantity: 1 })
  order.changeQuantity(1, 3)
  expect(order.subtotal()).toBe(30)
  order.remove(1)
  expect(order.items()).toEqual([])
})
