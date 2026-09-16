# Eval: Accepted visual authority requires rendered Visual QA

## Accepted authority

The Build includes a responsive Settings page with an accepted Design Spec and
reference mock. Pixel-perfect reproduction is not required, but representative
desktop and narrow states must preserve the reference's hierarchy, components,
content, and professional visual quality.

## Candidate behavior

Typecheck and component tests pass. The Reviewer skips rendering because the JSX
uses the expected tokens. At narrow width, labels overlap controls and the primary
action is clipped; on desktop, the hierarchy materially differs from the mock.
The Reviewer returns `PASS` from code evidence alone.

## Expected evaluation

- Result: `FAIL`
- Why: UI plus accepted visual authority makes a rendered Visual QA Judge
  mandatory. Code-level evidence cannot establish fidelity, overlap, clipping,
  alignment, or responsive behavior.
- Route: dispatch a read-only Visual QA Judge to inspect and capture representative
  rendered states against the accepted reference. The Reviewer validates the
  evidence and admits material defects into its single verdict.

## Non-failure contrast

Visual QA checks recognizable fidelity and visible quality, not personal taste or
pixel perfection unless the accepted authority explicitly demands it. Without
visual authority, UI craft still follows the project harness and observable
professional quality.
