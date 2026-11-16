# Pragmatism

Use one fixed bar: the smallest well-designed outcome that does what the human
asked. The bar limits what work may contain; it is not a list of topics to cover.
Anything the asked outcome can work without stays out. The request still carries
what it depends on: if the asked change crosses a real security, accessibility,
trust, or data-loss boundary, that boundary holds, and it holds without being
written up as new scope.

Normal-use proportionality: the asked behavior includes its ordinary, reachable
failures, such as a request that times out or an input the user can actually
send. Handling them is part of doing what was asked, not new scope, and Review
checks both overbuilding and underbuilding of the asked behavior. Rare,
contrived, or speculative conditions stay out. In a proposed Spec, the
necessary-consequence test still decides what gets written down.

Stricter human requirements and the target repository's
[actual standards](target-harness.md) remain binding. Phase rubrics apply this
bar to their own decisions; they do not add guarantees.

Resolve available facts and understand the request, changed owners, and relevant
callers before choosing a change. Surface material assumptions, competing meanings,
and simpler alternatives; return unresolved consequential choices before dependent
work. Routine reversible tactics stay with the Builder.

Understand the actual flow, then stop at the first sound route: no change,
existing owner/pattern, standard library, native platform, installed dependency,
then the smallest new mechanism. Extra machinery needs evidence
of exposure and consequence in current expected operation, failure of the simpler
route, and benefit worth its concepts. A merely imaginable or reachable trigger
is insufficient. Defer speculative scale, coincident independent failures, and
contrived conditions by default; record a relevant limitation and revisit it when
evidence warrants. Future flexibility and a reviewer's preference do not earn it.
Ask which essential outcome needs the addition and why the simpler existing route
cannot deliver it. Singleton, once-only, cross-device, and other strengthened
guarantees need their own authority; ordinary reuse or recovery does not imply them.

New layers, state, parsers, configuration, contracts, or dependencies earn their
cost when removing them breaks the asked outcome or a present boundary, collapses
current distinct meanings, or defeats demonstrated necessary coordination. When
unsure whether to add a capability or machinery, build less: an omission the user
notices is cheap to add, while unasked machinery stays in the system. This does
not apply to handling the asked behavior's ordinary failures. Preserve real security, trust-boundary input
validation, data-loss prevention, accessibility, and explicit requirements. A
real defect stays real when its remedy needs a consequential decision. Those labels
still need a supported exposure and consequence; repeated incidents are not a
prerequisite for protecting an actual boundary.

Keep edits traceable to the task and match existing style. Leave unrelated cleanup
alone; mention unrelated dead code when useful rather than deleting it. Remove
only the orphans this change creates. Avoid speculative features, single-use
abstractions, configuration, and impossible-case handling. Inline local
literals; share or configure them when real synchronization or runtime variation
requires it. Simplify when the same sound result needs fewer concepts or lines.

Set an observable success criterion and the smallest discriminating check before
changing the result. Multi-step work earns a brief plan with a check per step;
nontrivial logic earns a runnable regression check under the target's test policy.
Verify the result and report gaps honestly. A proposed Spec needs testable scenarios
and a credible proof route, not implementation checks before code exists.

These practices reconcile all four sections of the [Karpathy-inspired
CLAUDE.md](https://github.com/forrestchang/andrej-karpathy-skills/blob/main/CLAUDE.md):
think before coding, simplicity, surgical changes, and verifiable goals.
