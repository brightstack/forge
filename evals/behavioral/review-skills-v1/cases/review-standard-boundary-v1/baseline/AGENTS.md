# Fixture instructions

Use Bun. Every exported parser at a public JSON boundary must call the shared
`assertExactKeys` validator before returning data; unknown top-level fields must
be rejected. Run `bun run test` and `bun run standards`. Review tasks are
read-only.
