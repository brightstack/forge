const CADENCES = new Set(["daily", "weekly"]);

export function updateReminder(current, patch) {
  if (patch.cadence !== undefined && !CADENCES.has(patch.cadence)) {
    return { status: 400, reminder: current };
  }

  return {
    status: 200,
    reminder: {
      ...current,
      cadence: patch.cadence ?? current.cadence,
    },
  };
}
