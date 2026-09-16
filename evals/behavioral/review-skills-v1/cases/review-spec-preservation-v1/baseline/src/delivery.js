export async function deliver(message, send) {
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      return await send(message, { idempotencyKey: message.deliveryId })
    } catch (error) {
      if (attempt === 2) throw error
    }
  }
}
