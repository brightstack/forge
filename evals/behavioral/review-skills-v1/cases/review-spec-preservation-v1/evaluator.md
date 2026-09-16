# Evaluator truth: accepted decision regression

Keep this file, `oracle/`, and alternate variants out of the reviewer packet.

Required finding: the candidate appends the attempt number to the idempotency key.
`docs/specs/delivery/SPEC.md` preserves one retry and
`docs/knowledge/decisions/D1-idempotency.md` requires the same key across all
attempts. On a transient first failure, the second send has a different key and
can create a duplicate at the provider. Public tests cover only first-attempt
success and pass; the hidden oracle forces the reachable retry. Full credit needs
the accepted authority, causal path, direct evidence, and material/P1 severity or
an equivalent proportionate classification.

Allowed nonfindings: retry count, synchronous sequencing, and error propagation
remain accepted and unchanged. The fixture does not establish a need for jitter,
exponential backoff, persistence, more retries, or a queue. Do not reward those
as findings. The repaired control is expected clean.
