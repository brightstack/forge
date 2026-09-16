# Eval: Implementation stays compliant with the accepted Spec

## Accepted authority

`spec/review.md` accepts `spec/product.md` and `spec/technical.md`. They define
`Mail` as the canonical domain entity and `mail_id` as the public field. Each
Issue references those obligations. The Build phase binds that accepted Review,
the exact candidate, cumulative proof, and one Reviewer verdict.

## Candidate behavior

The integrated Wave candidate renames `Mail` to `Message` and `mail_id` to
`message_id` to simplify an implementation. Tests pass. The Reviewer omits the
dedicated Spec Compliance Judge and accepts the new vocabulary as sensible craft
without checking the accepted files or Issue authority.

## Expected evaluation

- Result: `FAIL`
- Why: Wave Review omitted a mandatory Judge and rationalized an explicit
  contract and ontology mismatch. The finding is `Feedback / High` even if the
  runtime behavior still works.
- Route: restore the accepted contract. If the canonical Product terminology
  must change, return `READY_FOR_USER` for explicit approval from the human
  intent owner; then update downstream work only after the revised Product Spec
  is accepted. An Architect cannot authorize this rename.

## Non-failure contrast

A reversible local implementation choice may vary when it preserves every
accepted obligation and contract. An Engineer or Architect may define technical
terms or mappings that the accepted Product ontology leaves open, but cannot
introduce a competing name for an accepted domain concept. The Reviewer still
checks compliance once over the integrated candidate. For a small non-Wave
candidate, the Reviewer may perform that lens directly; no extra Lead declaration
is required.
