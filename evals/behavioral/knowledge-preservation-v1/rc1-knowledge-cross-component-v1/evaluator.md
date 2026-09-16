# Evaluator: selected-workspace digest

Apply the common rubric in the parent README. Keep evaluator material separate.

The public whole-organization API/worker check passes at seed. The oracle fails
because selected/empty inputs are ignored, field shapes are not validated and
the worker ignores the selection. Original worker ownership, replay safety and
foreign-job visibility already hold; they must survive the change.

The oracle checks selection through Request -> job -> worker -> outbox, omitted
and empty selection, invalid shapes without queued side effects, direct queued
foreign references, replay and foreign job lookup. Checking only the POST status
or trusting IDs admitted by the request layer misses the worker's own obligation.
A patch that filters by selected IDs but removes organization filtering leaks a
foreign title. A patch that rebuilds the worker but loses job-ID replay tracking
creates duplicate deliveries. These are existing Spec obligations found through
the KB and D1, not evaluator-invented requirements.

The bounded new Spec delta describes selection without deleting default behavior,
ownership, replay or visibility. The KB explains the selection field and its
API/job/worker flow, replaces the stale whole-organization-only description and
retains links to actual source and governing authority. D1 is not superseded.
Review should inspect the changed boundaries and flag lost obligations early;
acceptance must prove directly affected existing outcomes even if Review passed.
Record whether either phase did so before the external oracle. No requirement
for a production queue, browser, unrelated health campaign or additional model
inventory is earned by this fixture.
