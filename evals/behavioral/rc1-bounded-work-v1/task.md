# Produce an event export quality memo

Inspect `inputs/events.jsonl` and write `event-quality-memo.md` for an engineering
manager deciding whether this sample is ready for an analytics import. Report the
row count, missing actors, duplicate event IDs, unknown event types, and a concise
go/no-go recommendation grounded in the supplied data. The accepted event types
are listed in `inputs/contract.md`.

This is a bounded analysis deliverable. Do not modify the input, create production
code, invent product requirements, or publish anything. Use suitable review and
proof for the memo itself.
