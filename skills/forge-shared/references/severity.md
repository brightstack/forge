# Severity and finding admission

Grade demonstrated impact, then assess remedy authority separately under
[accepted scope](authority.md). A severe finding never approves its own remedy.

| Severity | Meaning | Action |
| --- | --- | --- |
| P0 | Demonstrated critical impact: an exploitable severe trust/security/privacy failure, unrecoverable material data loss, or a broken core outcome/build boundary that makes the candidate unusable. | Hold the affected boundary; repair within authority or return the material choice. |
| P1 | Pragmatic blocker with a current reachable trigger, supported evidence/causal trace, and material consequence for a current obligation or real boundary. | Repair proportionately within authority; otherwise return the material decision and reassess affected proof. |
| P2 | Nonblocking defect or useful optional advice without that blocker case. | Report only when useful; does not extend the loop. |

Severity follows demonstrated impact and evidence. A Spec mismatch is not
automatically P0: classify its actual consequence. Requirement/standard authority
and severity are separate from remedy eligibility; even a severe finding cannot
authorize a new requirement or material data/API change.

Before reporting a defect, locate the affected source or artifact, name the input
or state and bad outcome, inspect relevant callers and existing safeguards, and
support the smallest honest severity with evidence or a causal trace. Every
finding identifies that context, controlling obligation, consequence, and remedy
boundary. A theoretically reachable trigger alone does not justify machinery;
apply [normal-use proportionality](pragmatism.md).

Distinguish the allegation, its assessed status, and its suggested remedy in the
existing report:

- A defect fails an accepted outcome, applicable standard, necessary correctness
  property, or actual present boundary. Keep its impact visible even if the needed
  correction exceeds authority.
- A proposal adds capability or a stronger promise without an established current
  defect. Label it optional; it cannot block, become acceptance criteria, or enter
  automatic repair without authority.
- Reject received material feedback that lacks evidence, relevance, or proportion,
  with a concise reason. Rejecting a mechanism need not reject its underlying
  defect; the owner can choose a sound authorized correction.

Zero findings is a valid result. Do not manufacture findings, rejected items, nits,
or redesigns to demonstrate effort. Judge improvement against current obligations,
not perfection or how you would have written it. Real defects and required proof
retain their force. This admission approach draws on [ECC's code
reviewer](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md)
and [Addy Osmani's review
guidance](https://github.com/addyosmani/agent-skills/blob/main/skills/code-review-and-quality/SKILL.md),
without numeric confidence or file-size gates.

This shared severity/return contract governs phase and helper assignments;
older helper shorthand does not redefine its impact-based grading. A required
proof gap states its authority and unproved
claim; it is not an invented runtime defect or an inferred PASS.
