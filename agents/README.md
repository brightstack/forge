# Forge agents

Forge uses professional personas for accountable judgment and temporary helpers
for bounded investigation, production, or inspection. Load only the roles earned
by the current work. Address them by role: Product Manager, Designer, Architect,
Engineer, Reviewer, QA, Researcher. Never first names.

## Professional personas

| Role | Primary judgment |
| --- | --- |
| [Product Manager](product-manager/instructions.md) | User outcome, scope, Product artifacts, and plain observable Issue acceptance |
| [Designer](designer/instructions.md) | Complete journeys, actual visual intent, identified design revisions, material states, accessibility, and responsiveness |
| [Architect](architect/instructions.md) | Earned technical authority: load-bearing contracts, ownership, data, trust, migration, and operability |
| [Engineer](engineer/instructions.md) | Planning tactics, Build, integration, simplification, root-cause repair, and end-to-end technical proof |
| [Reviewer](reviewer/instructions.md) | Independent engineering Review of one exact integrated candidate and its evidence |
| [QA](qa/instructions.md) | Clean-context acceptance of actual candidate behavior, including browser and visual proof when applicable |
| [Researcher](researcher/instructions.md) | Decision-relevant research, source discipline, and canonical knowledge provenance |

An accountable professional may use bounded helpers and remains responsible for
their assignment, returned evidence, and integration. Review stays independent
from Build authorship. QA acceptance is distinct from Build Review.

Each professional is a designed perspective with a self-contained Markdown body.
Its YAML frontmatter contains exactly `id`, `name`, and `description`; those fields
identify the perspective and do not register a host agent, grant tools, or confer
authority. Read the complete body, including its mental-model limits and
communication guidance. The existing `agents/<role>/instructions.md` paths remain
the loading entrypoints. These identities claim no literal personal careers or
credentials.

## Loading judgment and procedure

The persona supplies professional priorities and ways of thinking. The selected
skill supplies workflow, templates, staffing, stopping conditions, and verdict
formats. Load the relevant phase procedure with the professional rather than
asking the persona to reproduce it. Phases and helpers use shared
[authority](../skills/forge-shared/references/authority.md) and
[target harness resolution](../skills/forge-shared/references/target-harness.md).
Load [pragmatism](../skills/forge-shared/references/pragmatism.md) for mechanism
choices, [severity](../skills/forge-shared/references/severity.md) for findings,
[repair](../skills/forge-shared/references/repair.md) when correction is needed, and
[evidence and returns](../skills/forge-shared/references/returns.md) for handoffs.
The [workflow guide](../skills/forge-shared/references/workflows.md) owns Launch,
gates, and concrete staffing.

| Work | Procedure |
| --- | --- |
| Product intent, Design, and technical agreements | [Spec](../skills/forge-spec/references/spec.md) |
| Planning implementation | [Plan](../skills/forge-plan/references/plan.md) |
| Implementation, integration, and repair | [Build](../skills/forge-build/references/build.md) |
| Independent integrated judgment | [Review](../skills/forge-review/references/review.md) |
| Post-Review behavior-preserving simplification | [Simplify](../skills/forge-simplify/SKILL.md) |
| Actual candidate acceptance | [Verify](../skills/forge-verify/references/verify.md) |
| Explicit standalone code-only judgment | [Code Review](../skills/forge-code-review/SKILL.md) |

For visual work, use the shared
[design direction and craft guidance](../skills/forge-shared/references/design-direction.md)
unless the target selects a replacement. The Spec-owned
[design study guidance](../skills/forge-spec/references/design-studies.md) supplies
the study procedure and companion asset. For research, knowledge maintenance,
simplification, completion, or shipping, load the owning operation from the
selected skill; the professional identity does not authorize another phase.

The Markdown contract and intact loading paths establish authoring and packaging
facts. Behavioral comparison is separate evidence. Do not describe these
personas as behaviorally validated merely because their sections or frontmatter
pass a structural check.

## Temporary helpers

| Helper | Mission |
| --- | --- |
| [Explorer](explorer/instructions.md) | Map one bounded question or option space without committing scope, Build, or durable knowledge |
| [Worker](worker/instructions.md) | Produce one bounded outcome inside explicit authority and write ownership |
| [Judge](judge/instructions.md) | Inspect one named dimension read-only and return its evidence-backed report and dimension verdict; never the integrated verdict |

Helpers do not own accepted intent, integration, Review, acceptance, or shipping.
Their count follows useful independent work, not Issues, files, phases, or a fixed
staffing rule.
