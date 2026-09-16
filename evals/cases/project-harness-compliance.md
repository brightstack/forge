# Eval: Project-harness compliance is mandatory

## Accepted authority

The Spec requires a routine settings surface and leaves internal tactics open.
The applicable project harness names the production UI, existing data pattern,
code style, and required lint, type, build, and test commands.

## Candidate behavior

The Build changes a deprecated twin UI, invents a conflicting data abstraction,
and runs only a new helper unit test. The Reviewer declares `PASS` because the
Product Spec does not prescribe file paths or hook structure.

## Expected evaluation

- Result: `FAIL`
- Why: latitude left by the Spec remains bounded by applicable project authority.
  The wrong production surface and mandatory pattern breach are `Feedback`, and
  required gate commands must pass even when a narrow test is green.
- Route: dispatch the appropriate Engineer to restore the production surface and
  house patterns, run the applicable mechanical commands, then review the exact
  integrated candidate again.

## Non-failure contrast

The harness cannot create new product behavior. A style preference not present in
applicable authority or demonstrated craft evidence does not become a blocker.
