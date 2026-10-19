# Lifecycle composition

Full delivery follows `Spec -> [Build <-> Review] -> Simplify -> Verify -> Ship`.
Plan remains a job before Build and a separately invocable skill, not an obligatory
planning team or separate artifact. Each phase is also a useful stopping boundary. The coordinator records whether a phase ran,
reused current accepted evidence, remains pending, or is blocked; absence is never
silently treated as success.

Start with [Launch and workflow selection](workflows.md). Quick/Full depth governs
preparation and staffing; Guided/Auto governs pauses within explicit authority.
Launch is an opening step, not another phase. Build/Review first converges on a
working reviewed candidate. A separate Engineer then simplifies it before QA;
`verify` selects [Forge Verify](../../forge-verify/SKILL.md).

| Entry | Result and stopping boundary |
| --- | --- |
| Explore | Answers a question or compares approaches; creates no delivery authority |
| Spec | Defines and approves proposed intent without routine canonical writes |
| Plan | Defines the implementation approach and useful outcome Issues |
| Build | Produces one integrated candidate and obtains independent Review |
| Review | Judges one pinned candidate without editing it |
| Simplify | Simplifies within accepted scope; delivery follows passing Build/Review, while a direct request needs no pre-edit Review PASS; changed results require affected proof and independent Review bound to the whole result; no-op retains any actual prior evidence |
| Verify | Exercises the actual Review-passed outcome |
| Ship | Checks the complete accepted candidate once, records concise closure, and performs authorized publication |
| Finish | At actual work completion, reconciles approved unapplied memory and authorized existing-PR readiness; direct Spec and Plan remain proposal-only |
| Spec apply / legacy Spec merge / KB | Maintains canonical meaning directly, without claiming software delivery |

A full run may reuse an accepted ticket as Spec and record a one-sentence Plan for
a tiny change. It still accounts for those phases. A direct Build or Review stops
before Simplify unless that operation is also authorized, without inventing broader
acceptance. Direct Simplify honors its bounded request without a pre-edit Review
PASS gate, records actual prior evidence or its absence, and stops before QA.
Changed results need affected proof and independent Review bound to the whole
result under its [owning procedure](../../forge-simplify/references/simplify.md).
An Verify failure returns to Build/Review, proportionate authorized Simplify
reassessment, then affected Verify. Reuse unaffected evidence with its basis;
no automatic complete restart is required. A human-owned semantic decision returns
to the human.

Before moving forward, record the exact candidate, accepted sources, current gaps,
and authority for the next action. Publication, merge, deployment, release, or
production changes require the corresponding user authority.
