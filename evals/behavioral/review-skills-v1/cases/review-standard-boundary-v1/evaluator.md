# Evaluator truth: engineering-standard violation

Keep this file, `oracle/`, and alternate variants out of the reviewer packet.

Required finding: the candidate replaces `parseRecord`'s required
`assertExactKeys` call with unchecked `JSON.parse`. `AGENTS.md` makes exact-key
validation a binding engineering standard for public JSON boundaries and names
`bun run standards`; that check fails on the candidate. The hidden oracle shows
the reachable consequence: an unknown `admin` field is accepted and propagated.
The happy-path tests remain green. A material/P1 engineering-standard finding
with the failing check or equivalent direct evidence earns full credit.

Allowed nonfindings: this fixture does not require Zod, a framework, a different
error class, deep validation, or validation beyond the documented top-level
shape. Do not reward claims that `JSON.parse` itself is unsafe or that all parsed
JSON is a security vulnerability. The repaired control is expected clean.
