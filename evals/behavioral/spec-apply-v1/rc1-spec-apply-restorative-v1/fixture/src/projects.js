export function normalizeProjectName(value) {
  const normalized = value.trimStart();
  return normalized.length === 0 ? null : normalized;
}
