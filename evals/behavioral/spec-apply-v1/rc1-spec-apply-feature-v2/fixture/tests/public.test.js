import { expect, test } from "bun:test";
import { deliverDueReminder } from "../src/delivery.js";
import { updateReminder } from "../src/reminders.js";

test("updates a supported cadence", () => {
  const current = { cadence: "daily", paused: false };
  expect(updateReminder(current, { cadence: "weekly" })).toEqual({
    status: 200,
    reminder: { cadence: "weekly", paused: false },
  });
});

test("rejects an unsupported cadence without mutation", () => {
  const current = { cadence: "daily", paused: false };
  const result = updateReminder(current, { cadence: "hourly" });
  expect(result).toEqual({ status: 400, reminder: current });
  expect(result.reminder).toBe(current);
});

test("an active due reminder emits one delivery on its cadence", () => {
  const outbox = [];
  expect(deliverDueReminder({ cadence: "weekly", paused: false }, outbox)).toEqual({
    cadence: "weekly",
  });
  expect(outbox).toEqual([{ cadence: "weekly" }]);
});
