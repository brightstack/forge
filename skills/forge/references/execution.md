# Lifecycle composition

Full delivery accounts for `Spec → Plan → Build → Acceptance → Ship`. Each phase is
also a useful stopping boundary. The coordinator records whether a phase ran,
reused current accepted evidence, remains pending, or is blocked; absence is never
silently treated as success.

Start with [Launch and workflow selection](workflows.md). Quick/Full depth governs
preparation and staffing; Guided/Auto governs pauses within explicit authority.
Launch is an opening step, not another phase. Review stays inside Build and
`verify` selects Acceptance, not an additional phase.

| Entry | Result and stopping boundary |
| --- | --- |
| Explore | Answers a question or compares approaches; creates no delivery authority |
| Spec | Defines accepted intent and, after human approval, may apply its exact target with document-only provenance |
| Plan | Defines the implementation approach and useful outcome Issues |
| Build | Produces one integrated candidate, simplifies it, and obtains independent Review |
| Review | Judges one pinned candidate without editing it |
| Acceptance | Exercises the actual Review-passed outcome |
| Ship | Checks the complete accepted candidate once, records concise closure, and performs authorized publication |
| Spec apply / legacy Spec merge / KB | Maintains canonical meaning directly, without claiming software delivery |

A full run may reuse an accepted ticket as Spec and record a one-sentence Plan for
a tiny change. It still accounts for those phases. A direct Build or Review stops
without inventing broader acceptance. An Acceptance failure returns to Build,
then affected independent Review and Acceptance. A human-owned semantic decision
returns to the human.

Before moving forward, record the exact candidate, accepted sources, current gaps,
and authority for the next action. Publication, merge, deployment, release, or
production changes require the corresponding user authority.
