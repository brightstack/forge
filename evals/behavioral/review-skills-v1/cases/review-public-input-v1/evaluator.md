# Evaluator truth: public-input regression

Keep this file, `oracle/`, and alternate variants out of the reviewer packet.

Required finding: `src/dedupe.js` converts opaque event IDs with `Number` before
forming the key. The public `inputs/events.jsonl` contains `evt-a` and `evt-b`;
both become `NaN`, so the second distinct event is dropped for the same tenant.
The golden tests use numeric-looking IDs and therefore pass. Accepted evidence
includes a causal trace from the diff, a focused probe using the public input, or
the hidden oracle after the report. Proportionate severity is material/P1 because
reachable valid events are silently lost; the remedy is to preserve the opaque
string in the extracted helper.

Allowed nonfindings: the delimiter choice is unchanged and not shown to collide;
the fixture does not establish a need for Unicode normalization, hashing, a
database, concurrency control, or extra schema validation. Do not reward style
criticism of helper extraction or comments. The repaired control is expected
clean.
