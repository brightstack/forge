# Bug diagnosis

Treat a bug as a discrepancy between accepted expected behavior and observed
behavior. The report or [bug template](../assets/bug.md) records expected and
actual results, impact, environment, reproduction steps or evidence, and relevant
Given/When/Then scenarios. A conflict with standing behavior is a human decision.

Before source edits, reproduce through the lowest realistic seam when possible.
Record observations separately from hypotheses. Rank falsifiable hypotheses by
fit and cost, then run the cheapest observation that distinguishes them. Revise
the explanation when evidence falsifies it; do not preserve the first plausible
story.

Trace the behavior through real callers and shared state owners. Fix the common
cause and inspect affected siblings rather than patching one visible symptom.
Remove temporary probes after diagnosis. Preserve the original reproduction as
acceptance proof and add focused regression evidence at the correct seam.

If the behavior, expected result, environment, or required access cannot be
established, report the exact gap instead of guessing. Hotfix urgency can narrow
depth and sequencing; it cannot waive accepted intent, independent Review, the
original-reproduction check, or honest proof limits.
