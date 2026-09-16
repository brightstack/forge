import { expect, test } from "bun:test";
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
