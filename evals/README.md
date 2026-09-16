# Forge semantic evals

These Markdown cases are the cheap normative regression layer. Live comparative
evaluation is separate and optional; use the [behavioral corpus](behavioral/README.md)
when a harness behavior or cost decision earns fresh native-agent trials.

These cases catch authority and workflow regressions without locking prompt wording.

Evaluate each case against:

1. the user's current request and recorded decisions;
2. accepted `spec/review.md`, its exact bundle, the Plan review, and applicable
   project-harness authority;
3. the exact candidate or workflow transition; and
4. direct evidence, including contradictions.

Return one result:

- `PASS` - no demonstrated regression.
- `FAIL` - the candidate exhibits the named failure with a reachable effect.
- `QUESTION` - a material human decision is missing.
- `N/A` - the case does not apply.

A failure needs accepted authority, a reachable consequence, and direct evidence
or a causal trace. Preferences, nits, theoretical improvements, and unrequested
stronger systems do not fail. Return the smallest route: continue, ask, restore
authority, send work to its owner, run one focused check, repair, replan, or stop.

The cases describe behavior, not required phrases. Equivalent evidence and
concise result formats are valid.

## Authority model

- Forge exposes `Work | Build | Bug Fix`. Build uses exactly `Intake -> Spec ->
  Plan -> Build -> Verify -> Simplify -> Ship`; Research and Debug are internal
  capabilities.
- Human decisions and the accepted Spec are absolute. Product, Bug, or Work
  intent starts one conditional Spec bundle, with Design and Technical Specs
  only when earned.
- Specs share the approved Summary, Context, End State, optional decision and task
  sections, Plan, and References shape. Optional sections are omitted when they
  add no useful contract. Ontology, when present, uses the canonical term,
  entity, and process groupings rather than a freeform glossary.
- One Lead plans, delegates, inspects, and integrates each work-producing phase.
  Lead is an assignment. Workers own bounded meaningful outcomes, not gates.
- One Reviewer selects phase-specific mechanical checks and read-only Judges,
  validates their evidence, and returns the sole verdict over one integrated
  candidate. There is no Review per Issue, Worker, file, or finding.
- Plan and Issues allocate accepted obligations without strengthening them or
  freezing runtime staffing. Review findings are evidence, not requirements.
- Each Plan Issue has only the canonical frontmatter fields, exactly one delivery
  label, and a human-readable Context, Acceptance Criteria, QA, and References
  body. Status stays in the parent directory. Authority, proof, seams, and Wave
  strategy stay in their owning body sections or Plan instead of duplicating
  hidden metadata.
- Build may use provisional seams, mocks, fixtures, or stubs and tolerate
  temporary incompatibility before Lead integration.
- Review Reports contain issue-like Findings with explicit Reviewer provenance,
  `Bug | Feedback`, and `High | Medium | Low`. They never enter the Plan Issue
  graph. The Lead owns disposition and remedy; the Reviewer must address its
  rationale before reopening a Finding.
- Every repair loop rebuilds and reviews the complete outcome. At most three
  repair loops follow the initial verdict, and Low findings never extend one.
- Simplify preserves accepted behavior. Ship creates the pull request only.

Evaluate artifact meaning and decisions. Deterministic tests own exact artifact
headings and frontmatter. Semantic evals do not test prompt strings or wording.
