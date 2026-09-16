# Design direction and craft

Use this during Design, UI Build, and Design review when the target harness has
not selected a replacement. It is Forge's own baseline guidance; no external
skill or design service is required. Selected specialists refine these choices
within the same accepted scope. Study assembly and proof live in
[design studies](design-studies.md); review admission lives in
[the Design rubric](judges.md#design-rubric).

## Choose a direction from the job

Identify what a person must notice, understand, and do. An operational screen
prioritizes state and efficient action; a reading surface prioritizes structure
and comfortable reading; a persuasive surface needs credible reasons to act;
an exploratory artifact can let its content lead. These are questions for
judgment, not styles to impose on whole product categories.

For existing UI, begin with its actual components, typography, tokens, assets,
content and interaction conventions. Refinement preserves that identity and
behavior outside the requested delta. A replacement needs explicit scope.
For a new surface, use nearby established patterns. For a genuinely new product,
propose a coherent direction grounded in its audience and material; distinguish
a recommendation from human approval.

Describe the visible problem and the proposed effect in one concrete sentence.
For example, “The filter produces an unexplained blank; keep the surrounding list
layout and show the active scope with a way back to results.” Choose the principal
change that solves it: hierarchy, grouping, density, reading, state, or recovery.
Other adjustments should support that change. Do not require a named style,
aesthetic dial, invented alternative, or decorative signature for a small fix.

## Make the direction visible

Use the relevant questions below, not a checklist of mandatory treatments.

| Concern | Design judgment | Evidence to inspect |
| --- | --- | --- |
| Hierarchy and layout | Let the primary task lead. Use proximity and alignment to express relationships before adding containers. Preserve information needed to act. | At normal size, can someone distinguish current state, primary content and next action? Does grouping survive a narrow viewport? |
| Typography and content | Reuse the system's type roles. Tune measure, weight and line spacing to real content; keep labels distinct from values. Keep product terms and factual claims intact. | Long names, wrapping, truncation and fallback fonts; can a person still read and identify the item? |
| Color and contrast | Give color a semantic job. Reuse established action and status roles; include text or shape for meaning. Compare actual foreground and background pairs. | Text, controls, focus and selected states remain distinguishable; muted content is still readable. |
| Density and responsiveness | Choose what wraps, reorders or scrolls according to the task. Preserve meaningful relationships and reading order. | Actual product viewport, not a scaled desktop image; long content and controls at narrow width; any deliberate scrolling is usable. |
| Interaction and recovery | Prefer the target's native or established controls. Make the action, immediate feedback and recovery understandable. Include only states earned by the journey. | Mouse and keyboard activation, focus after updates, repeated actions, and relevant empty/error/pending states. A screenshot cannot prove these. |
| Imagery and motion | Use imagery to explain the subject or establish relevant character. Motion should explain change or provide feedback without blocking action. | Text remains real and readable, assets have a purpose, reduced-motion behavior is usable when animation is present. No image or animation is required. |

Visible labels, semantic controls, useful focus indication and understandable
reading order are part of the design. Avoid simulating an interactive control
with an inert decoration. If a study omits an out-of-scope interaction, disclose
that locally rather than pretending it works. Do not invent destructive,
optimistic, or persistence behavior to make a prototype feel complete.

## Critique the outcome

Inspect the rendered result against the user job and incumbent or accepted
visual authority. Start with the strongest claim the design makes and try a
plausible counterexample: an unusually long existing name, narrow width,
keyboard-only recovery, or a state transition that removes the focused control.
Select checks that could change the recommendation, not a universal state matrix.

Separate a demonstrated failure from another valid treatment. Explain the user
consequence and location of a material issue; avoid judgments such as “not premium”
or demands for more visual novelty. Batch related corrections, preserve the
whole intended outcome, and follow the study workflow's bounded inspection cycle.
A study recommendation and successful local inspection do not approve a design
or establish production Acceptance.

The handoff should make the direction buildable: what changes, what stays,
which states and responsive transformations matter, and what the rendered
artifact demonstrates. Put this in the existing design/visual record; no extra
report or phase is required.
