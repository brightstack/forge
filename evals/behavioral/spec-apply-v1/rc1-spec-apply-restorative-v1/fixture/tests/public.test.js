import { expect, test } from "bun:test";
import { normalizeProjectName } from "../src/projects.js";

test("keeps an already normalized name", () => {
  expect(normalizeProjectName("Launch")).toBe("Launch");
});

test("removes leading whitespace", () => {
  expect(normalizeProjectName("  Launch")).toBe("Launch");
});

test("rejects an empty normalized name", () => {
  expect(normalizeProjectName("   ")).toBeNull();
});
