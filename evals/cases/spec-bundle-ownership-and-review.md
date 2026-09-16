# Eval: Spec bundle preserves ownership and one Review

## Accepted authority

A product change needs a Product Spec, a consequential interaction needs a Design
Spec, and a new trust boundary needs a Technical Spec. One Spec Lead coordinates
and integrates the bundle. Product Manager, Designer, and Architect specialists
may author or repair their domain contributions. A `mechanical` quality check may
return compact feedback. The complete bundle receives one formal Spec Review at
`spec/review.md` over the exact flat files present.

## Candidate behavior

The Spec Lead silently changes an accepted product decision while reconciling the
files, treats each quality check as a passing Review gate, then launches separate
Product, Design, and Technical Reviewers before a fourth bundle Reviewer.

## Expected evaluation

- Result: `FAIL`
- Why: integration ownership does not permit changing human intent, and cheap
  quality checks cannot become approval actors or multiply the formal gate.
- Route: restore the human decision. Route domain repairs already determined by
  that intent to the appropriate specialist, integrate one coherent candidate,
  then run one independent Review across the exact bundle.

## Non-failure contrast

The Spec Lead may edit for coherence and integrate specialist returns. A
specialist may incorporate a non-gating quality-check suggestion. Any semantic
change to accepted intent returns to the human.
