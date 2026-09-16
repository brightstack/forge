# Acceptance

Acceptance exercises the actual outcome after independent Review. Use a
clean-context QA professional for software or the relevant acceptance specialist
for general work. Acceptance stays read-only on the candidate and does not
prescribe implementation.
The natural requests `Forge acceptance` and `Forge verify` enter this same phase;
the `verify.md` filename and `verify/` evidence path remain stable compatibility
names.

Pin the Review-passed candidate/base and load accepted scenarios, NFRs, design
revision, relevant decisions, environment/fixtures, runnable setup, and known
gaps. If current independent Review is missing, changed, or unbound, first obtain a
bounded Review of the same candidate. That Review does not itself prove acceptance.
For an early-applied Spec, also retain the accepted baseline and approved delta as
independent inputs; the current canonical file and matching receipt do not prove
authority or implementation.

Load the reviewed preservation scope. Exercise changed or new outcomes, affected
unchanged outcomes, and material failure paths named by the obligations. Reuse
unaffected proof only with a reason tied to the scope. A changed path list alone
does not establish preservation, and every patch does not require full-product
reverification.

For each applicable item, record in [acceptance.md](../assets/acceptance.md):
scenario/NFR, environment and candidate, action or command, expected result,
observed result, `PASS | FAIL | NOT RUN`, and trace/output/visual link. Written
tests, generated mocks, structural validation, source inspection, and prior labels
do not replace required current runtime proof. Required unavailable proof blocks
acceptance and stays explicit. Actively try to falsify consequential claims through
current public inputs and real failure paths, then require authority, reachability,
observed evidence, and material consequence before declaring a failure. No finding
quota, manufactured nits, personal taste, speculative scale, or unrelated debt.
Material accepted standards remain binding; missing proof stays NOT RUN rather
than an invented runtime failure.

## Complete outcome

Judge whether the integrated result realizes the accepted product or technical
end state, including confirmed design, cross-Issue behavior, preserved standing
commitments, and material regressions. Passing every listed Issue or scenario is
not sufficient when the combined experience is missing or contradictory. Reuse
current credible evidence; runtime contradictions outrank earlier green checks.
This is part of Acceptance, not an additional Product gate. A project checkpoint
uses the same Review then Acceptance composition over its stated completed scope
and names unfinished outcomes without claiming full-project completion.

Acceptance exercises the obligations selected by the Builder and challenged by
Review. It may use the KB to locate authority, but KB search, OKF validation, and
history output never establish candidate compliance.

## Browser and visual acceptance

For applicable UI work, use an actual browser against the identified candidate.
Confirm URL/build identity, authentication, test data, browser ownership, states,
and representative viewports. Exercise real interactions and inspect console,
network, persistence, focus, keyboard behavior, semantics, responsive behavior,
and regressions when relevant.

Compare the rendered candidate with the accepted design/mock revision and states.
Record images or traces through [visual.md](../assets/visual.md). Judge material
fidelity, hierarchy, spacing, typography, alignment, clipping, overflow, contrast,
interaction feedback, and responsive behavior. Code inspection is not visual
acceptance; pixel precision applies only when accepted authority requires it.

Use synthetic-user journeys to exercise accepted scope from specific goals,
knowledge, permissions, and starting states. They are simulated acceptance or
exploratory tests, not real user research, and cannot invent requirements.

For a bug, rerun the original reproduction plus affected behavior. For a visual
artifact, open/render it and inspect the actual output. For other general work,
exercise or inspect the deliverable against its stated purpose and source standard.

Return `PASS`, `FAIL`, `RETHINK`, `READY_FOR_USER`, `INCONCLUSIVE`, or
`BLOCKED`. A material failure returns the complete accepted packet and evidence
to Build, followed by affected Review and Acceptance. Use the shared finite repair
count; never mark unrun evidence PASS.
