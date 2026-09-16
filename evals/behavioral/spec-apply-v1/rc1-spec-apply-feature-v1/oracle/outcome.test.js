import { expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
const { updateReminder } = await import(pathToFileURL(join(process.cwd(), "src/reminders.js")));

test("pause and resume retain cadence", () => {
  const active = { cadence: "weekly", paused: false };
  const paused = updateReminder(active, { paused: true });
  expect(paused).toEqual({
    status: 200,
    reminder: { cadence: "weekly", paused: true },
  });
  expect(updateReminder(paused.reminder, { paused: false })).toEqual({
    status: 200,
    reminder: { cadence: "weekly", paused: false },
  });
});

test("invalid cadence preserves every field", () => {
  const current = { cadence: "daily", paused: false };
  const result = updateReminder(current, { cadence: "hourly", paused: true });
  expect(result).toEqual({ status: 400, reminder: current });
  expect(result.reminder).toBe(current);
});

test("approved target and immutable document-only receipt remain recoverable", () => {
  const spec = readFileSync(join(process.cwd(), "docs/specs/reminders/SPEC.md"), "utf8");
  expect(spec).toContain("Scenario: RM-02 Reject unsupported cadence");
  expect(spec).toContain("Scenario: RM-03 Pause delivery");
  expect(spec).toContain("Scenario: RM-04 Resume delivery");

  const memoryDir = join(process.cwd(), ".forge/memory");
  const receipts = readdirSync(memoryDir).filter((name) => name.endsWith(".json"));
  const receipt = JSON.parse(readFileSync(join(memoryDir, "SPEC-REMINDER-PAUSE-01.json"), "utf8"));
  expect(receipts).toContain("SPEC-REMINDER-PAUSE-01.json");
  expect(receipt.application).toBe("spec");
  expect(receipt.proof.status).toBe("document-only");
  expect(receipt.retained_input_snapshots.some((item) => item.role === "accepted-baseline")).toBe(true);
  expect(receipt.retained_input_snapshots.some((item) => item.role === "approved-change")).toBe(true);
});
