import { expect, test } from 'bun:test'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const workspace = process.cwd()
const { createOrder } = await import(pathToFileURL(path.join(workspace, 'src/order.js')))
const { createController } = await import(pathToFileURL(path.join(workspace, 'src/controller.js')))

test('whole order outcome remains coherent through repair', () => {
  const order = createOrder()
  const controller = createController(order)
  controller.add({ id: 1, price: 10, quantity: 1 })
  expect(controller.displayedSubtotal()).toBe(10)
  controller.changeQuantity(1, 3)
  expect(controller.displayedSubtotal()).toBe(30)
  controller.quantityKeyDown('Enter')
  expect(order.items()).toHaveLength(1)
  expect(controller.displayedSubtotal()).toBe(30)
  controller.remove(1)
  expect(order.items()).toEqual([])
  expect(controller.displayedSubtotal()).toBe(0)
})
