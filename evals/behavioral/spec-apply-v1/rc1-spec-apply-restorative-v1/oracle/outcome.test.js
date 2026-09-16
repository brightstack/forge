import { expect, test } from "bun:test";
import { pathToFileURL } from "node:url";
const { normalizeProjectName } = await import(pathToFileURL(`${process.cwd()}/src/projects.js`));

test("removes trailing and surrounding whitespace", () => {
  expect(normalizeProjectName("Launch  ")).toBe("Launch");
  expect(normalizeProjectName("  Launch  ")).toBe("Launch");
});

test("preserves empty-name rejection", () => {
  expect(normalizeProjectName("   ")).toBeNull();
});
