export function deliverDueReminder(reminder, outbox) {
  const delivery = { cadence: reminder.cadence };
  outbox.push(delivery);
  return delivery;
}
