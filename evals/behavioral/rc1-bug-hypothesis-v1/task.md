# Fix the first Todo action failure

Expected: clicking the first task's checkbox toggles it, and clicking its delete
control removes it, just as for later tasks.

Actual: actions on the first task do nothing. The reproduction is:

1. Create a store with `['first', 'second']`.
2. Call `toggleFromDataset(store, { id: '0' })`.
3. Observe that task 0 remains incomplete.

The reporter suspects the UI dataset conversion drops the click. That is an
unverified hypothesis, not accepted diagnosis. Investigate from the reproduction,
fix the root cause, retain regression proof for the original failure and affected
siblings, and independently review the exact candidate. Preserve zero-based IDs;
changing the ID contract is outside scope.
