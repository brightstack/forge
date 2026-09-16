import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const root = process.cwd();
const { updateReminder } = await import(pathToFileURL(join(root, "src/reminders.js")));
const { deliverDueReminder } = await import(pathToFileURL(join(root, "src/delivery.js")));

test("pause suppresses and resume restores actual due delivery", () => {
  const active = { cadence: "weekly", paused: false };
  const paused = updateReminder(active, { paused: true });
  expect(paused).toEqual({
    status: 200,
    reminder: { cadence: "weekly", paused: true },
  });
  const pausedOutbox = [];
  expect(deliverDueReminder(paused.reminder, pausedOutbox)).toBeNull();
  expect(pausedOutbox).toEqual([]);

  const resumed = updateReminder(paused.reminder, { paused: false });
  expect(resumed).toEqual({
    status: 200,
    reminder: { cadence: "weekly", paused: false },
  });
  const resumedOutbox = [];
  expect(deliverDueReminder(resumed.reminder, resumedOutbox)).toEqual({ cadence: "weekly" });
  expect(resumedOutbox).toEqual([{ cadence: "weekly" }]);
});

test("invalid cadence preserves every field and emits from unchanged state", () => {
  const current = { cadence: "daily", paused: false };
  const result = updateReminder(current, { cadence: "hourly", paused: true });
  expect(result).toEqual({ status: 400, reminder: current });
  expect(result.reminder).toBe(current);
  const outbox = [];
  expect(deliverDueReminder(result.reminder, outbox)).toEqual({ cadence: "daily" });
  expect(outbox).toEqual([{ cadence: "daily" }]);
});

test("approved target and document-only receipt remain recoverable", () => {
  const spec = readFileSync(join(root, "docs/specs/reminders/SPEC.md"), "utf8");
  expect(spec).toContain("Scenario: RM-02 Reject unsupported cadence");
  expect(spec).toContain("Scenario: RM-03 Pause delivery");
  expect(spec).toContain("Scenario: RM-04 Resume delivery");
  const receipt = JSON.parse(
    readFileSync(join(root, ".forge/memory/SPEC-REMINDER-PAUSE-02.json"), "utf8"),
  );
  expect(receipt.application).toBe("spec");
  expect(receipt.proof.status).toBe("document-only");
  expect(receipt.retained_input_snapshots.some((item) => item.role === "accepted-baseline")).toBe(true);
  expect(receipt.retained_input_snapshots.some((item) => item.role === "approved-change")).toBe(true);
});
