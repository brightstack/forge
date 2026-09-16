# Codebase-anchored design studies

Produce one browsable page that helps the human understand a proposed UI change.
Use this during Spec Design when a visual decision needs a mock, study, or board.
A direct request stops with the study and its handoff. A small Build patch with
an accepted design reuses that design; it does not earn a new study or approval gate.

The Designer owns the direction and rendered critique. Read the target harness
and [design direction and craft](design-direction.md), or the selected replacement
design specialist, first. Their craft guidance informs this
artifact within Forge's phase and authority boundaries.

## Ground the decision

Start with what the user must accomplish: operate a tool, understand information,
make a decision or explore an artifact. Let that job determine hierarchy, density
and expression. State whether this is a refinement within the incumbent system
or an authorized replacement. Choose one coherent treatment that serves the job;
do not stack unrelated styling moves to make the study look more elaborate.

Name the user, task, proposed change, preserved behavior, and decision the page
must make visible. Preserve the incumbent visual system unless the user asks to
replace it. Missing design documentation does not make an existing app greenfield.

Inspect the target route or surface, its nearest components, tokens/theme and
assets, representative content and state behavior, and package manifest. Record
a short source map in the existing Design or visual record: repository revision
(including relevant dirty changes), paths and symbols, what is reused, and what
is proposed. Read the implementation behind each anchor; a plausible path is not
grounding. Use faithful fixture content and label it as illustrative.

When runnable, inspect the current surface in the browser. Distinguish a captured
baseline from a source reconstruction. If runtime, credentials, source, or assets
are unavailable, label the affected frame and evidence gap; never present a
reconstruction as an observed screenshot. A new surface uses a nearby incumbent
pattern as context, without inventing a before screen.

## Compose one study page

Start from [design-study.html](../assets/design-study.html). Copy and customize it
as an ordinary visual asset, usually `spec/studies/<slug>/r1/index.html`. Use the
existing [Design](../assets/design.md) and [visual companion](../assets/visual.md)
records for intent and identity. Scaffold the companion with `forge docs create visual`
using [CLI mechanics](cli.md), edit its body, and run `forge docs validate` before
handoff; copying a Markdown template or inventing frontmatter does not create a
valid managed record. For a small study, the existing ticket plus one
visual record can carry the brief and source map; do not duplicate prose.

Template the presentation structure, not the product screens:

- **Brief strip:** change, decision, exact revision, proposed/exploratory/accepted
  status, and a visible link to the companion record.
- **Main frames:** a believable slice of the real product with enough surrounding
  context to understand the change. For a refinement, normally show current and
  proposed with the same content, state, viewport, and scale. For an unresolved
  choice, show two or three materially different treatments, explain tradeoffs,
  and recommend one. A single clear direction needs no invented alternatives.
- **Material states:** add only the narrow viewport, empty/loading/failure,
  focus, or other state that the actual decision earns. Give frames stable IDs,
  state, viewport dimensions, evidence type, and revision. A responsive board
  does not prove that the represented product is responsive.
- **Annotations:** put short consequences next to the relevant frames. Separate
  observed behavior, proposed changes, preserved commitments, and open questions.
  Favor product language; keep technical anchors in a compact source section.

Use quiet board chrome and let the product occupy most of the page. The starter's
type, colors, and frame sizes belong to its chrome, never to the target app. Reuse
installed project components when a local preview seam makes that straightforward;
otherwise use an explicitly labelled faithful HTML/CSS reconstruction. Copy only
the necessary tokens and primitives with source anchors. Do not flatten a real
product into generic cards, fake metrics, or a new aesthetic chosen by category.

Plain HTML/CSS with small local scripts is the default for a bounded study. Use
the existing project preview stack only when imports or interaction fidelity earn
it. Isolate frame CSS from board chrome: an iframe gives a real viewport for media
queries; scoped CSS alone does not. Label a scaled desktop frame as scaled desktop,
not mobile proof. Keep full-size frames inspectable through local scrolling or a
frame link. The page itself must remain readable on a narrow screen and keyboard
usable. Model decision-critical interactions locally, label simulated behavior,
and avoid live writes or real account actions from the study.

No editor, canvas engine, new runtime dependency, generated image, or external
design account is required. An existing accepted external design can remain the
visual authority; do not rebuild it just to fit this starter. Use image generation
only when the requested visual material earns it, not to rasterize core UI text
and controls. Respect the host's filesystem and preview capabilities; do not
invent preview URLs or a Forge rendering command. HTML is not a managed Markdown
document and does not go through `forge docs create`.

## Inspect the actual artifact

For static studies, use the executable `forge serve <study-directory> --json`
from [CLI mechanics](cli.md) and keep it running in a host-owned terminal/session.
Open its returned URL and verify that it shows this revision. If the executable
or local listening capability is unavailable, use an available host preview and
report the actual mechanism and gap. Framework-backed studies use their existing
project preview pipeline. Inspect rendered desktop and narrow views together, including
the product frames at their declared viewports. Exercise decision-critical controls
and keyboard focus; check content, clipping, readability, contrast, and material
states against the brief. Capture and view the resulting images. Repair material
defects in one batch and recapture once; name remaining gaps rather than extending
a cosmetic polishing loop. Existing Forge defect escalation still governs blockers.

Save preview observations and final screenshots beside the study, linked from
the companion. This is study inspection, not production Acceptance; do not place
it under `verify/` as if the application had passed. If browser proof is unavailable,
return the useful artifact with inspection pending and the concrete gap. Source
inspection or a generated image cannot substitute for rendered proof.

## Hand off and preserve authority

Return the page path, verified preview URL (mark ephemeral when applicable), exact
revision, final image paths, recommendation/tradeoff, source map, and gaps. Keep
the companion's represented-state links synchronized with actual frame IDs.

A recommendation, selected comparison, local toggle, screenshot, or reviewer PASS
never records human acceptance. Reuse actual human authority when it covers the
same choices; otherwise keep the page proposed and ask only for the consequential
decision after making it reviewable. Record accepted revision, states, materially
locked choices, and Builder latitude in the existing visual record. Preserve an
accepted revision before making a new proposal; editing a proposed study does not
silently update accepted intent.

When an accepted asset lives under `.forge`, explicitly include its revision and
companion in the Review/Acceptance authority packet or selected candidate paths;
the default candidate check excludes loop mechanics. Bind screenshots to the
inspected asset revision and recapture affected states after edits.

Build follows the accepted choices and reuses production architecture rather than
shipping disposable study code. Review and Acceptance compare the real candidate
against the exact accepted frames and interactions, including material preserved
states. Unaccepted variants remain decision evidence, not requirements.
