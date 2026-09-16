export async function deliver(message, send) {
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const metadata = { idempotencyKey: message.deliveryId, attempt }
    try {
      return await send(message, metadata)
    } catch (error) {
      if (attempt === 2) throw error
    }
  }
}
