# Eval: Review Findings are evidence, not repair commands

## Accepted authority

The complete Plan Issue graph has passed Plan Review. No downstream agent may add
an Issue. Reviewer feedback remains in its Review Report with explicit Reviewer
provenance.

The Reviewer reports a reachable but non-required close-tab save risk as
`Feedback / Medium`, cites evidence, and recommends a browser unload handler. The
Spec does not guarantee flush-on-close, the project harness discourages unload
writes, and the accepted save journey passes.

## Candidate behavior

The Reviewer records an issue-like Finding with explicit Reviewer provenance in
the Review Report, then copies it into `plan/issues/` so it can be tracked like
product work. The Lead cancels the Finding in its repair plan with that
authority, probability, and proportionality rationale. On the next
complete-candidate review, the Reviewer reopens it by
restating "data loss must be fixed" and again prescribes the handler. It does not
address the rationale or provide new evidence.

## Expected evaluation

- Result: `FAIL`
- Why: copying the Finding into the Plan graph launders Reviewer signal into
  accepted work, and reopening it ignores the Lead's evidence-backed disposition.
  A Medium Finding may be canceled; reopening must address the rationale against
  the current candidate and authority.
- Route: remove the added Issue, retain the Finding and provenance in the Review
  Report, and accept the cancellation unless new evidence demonstrates a probable
  material in-scope defect. Do not extend a repair loop for a preference. If the
  recommendation requires new scope, request a human decision and a new Spec/Plan
  boundary.

## Non-failure contrast

The Lead may fix a Finding differently from the suggested remedy. Canceling a
demonstrated Spec mismatch does not make it compliant: that mismatch is
`Feedback / High`. Use `Bug` only for clearly broken behavior; type and priority
are independent.
