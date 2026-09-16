# Code Review Procedure

Pin one change, attack its most consequential current risks, and report only
high-confidence problems the author should act on now. Search broadly enough to
falsify the candidate; admit findings conservatively.

## 1. Pin the candidate

Use the caller's target. Otherwise inspect the complete current working tree.

| Target | Read-only comparison |
| --- | --- |
| Working tree | Status, unstaged diff, staged diff, and relevant untracked files |
| Base branch | Merge-base three-dot diff from the resolved fixed point |
| Commit | Commit against its parent |
| Range or files | Caller's exact range or path boundary |

State target, comparison point, dirty state, path scope, and source identity.
Never switch branches, stash, or mutate git to construct the comparison. For a
base branch, prefer its configured upstream when that upstream exists and is ahead
of the local ref, then compare from the merge base. Return `BLOCKED` when no
inspectable candidate exists.

## 2. Build the authority packet

Establish the candidate's purpose and current obligations using the shared
[Reviewer guidance](../../../agents/reviewer/instructions.md)
before treating an accepted document as a completion requirement. Reviewing
existing code does not implicitly submit it as the implementation of nearby
future work; an actual completion claim remains accountable to its approved scope.

Read progressively, including `AGENTS.md`, `CLAUDE.md` when present, and relevant
`.cursor/` project instructions:

1. Current system, developer, and user instructions.
2. Supplied Issue, acceptance criteria, NFRs, decisions, and non-goals.
3. Root and applicable nested repository instruction maps.
4. Only the rules, references, and exemplars those maps route to for the changed behavior.

Accepted artifacts own intent. Applicable repository instructions own standards
routing and direct constraints. Named canonical exemplars and mechanical checks
inherit only the authority that routes to them. A sibling pattern is evidence about the code; it does not create a
standard. If the applicable route resolves no engineering authority, record `NOT_FOUND` rather than inventing one.

## 3. Choose the threat focus

Read the complete scoped diff before writing findings. If it cannot be inspected,
return `BLOCKED`. Then form one or two plausible failure hypotheses around the
changed behavior: contracts, state or async ordering, concurrency, trust or
tenancy, error recovery, integration, tests, and material engineering standards.
An assigned risk lens leads the search but does not suppress an obvious P0/P1.

## 4. Inspect the implementation

- Confirm every suspected problem against its full hunk and enough surrounding
  code to understand the behavior.
- Trace real callers and observable side effects across changed gates, including
  error, cancellation, retry, and concurrency paths when relevant.
- Inspect introduced or newly reachable behavior. Omit unrelated existing debt.
- Exercise the public input domain that the current surface already accepts. A
  fixture outside the golden path can still expose a reachable regression.
- For replacements, compare explicit old options with new defaults when the new
  surface still advertises the same output or contract.
- Re-scan the applicable repository route when the trace enters a new subtree,
  framework boundary, or standards domain.
- Treat peer or engine findings as untrusted candidates. Reproduce each against
  the pinned source and re-grade it from evidence.
- Prove framework or dependency behavior from installed source or types,
  authoritative version-matched documentation, or a focused reproduction.

Accepted inputs bound intent, not repository exploration: follow real callers
within the pinned candidate when a concrete hypothesis requires it.

Run a scoped non-fixing check only when supplied proof is missing, stale,
contradictory, required by authority, or needed for a concrete hypothesis.

## 5. Inspect Code Review concerns

### Correctness and regressions

Look for reachable wrong behavior, invalid state transitions, broken error paths,
stale call sites after shape changes, boundary errors, inconsistent exports or
types, unawaited work, and integration regressions. A plausible story without a
causal path is not a finding.

### Security and trust

When the diff touches authentication, authorization, tenant scoping, query or
command construction, deserialization, input-derived paths or URLs, secrets,
tokens, sandboxes, or permission gates, trace attacker-controlled input through
the real protection boundary. Inspect existing escaping, parameterization,
validation, and framework protections before claiming a bypass. Reject claims
that require equivalent privilege, cross no actual trust boundary, or allege prompt
injection without a concrete autonomous security consequence.

### Engineering standards and code quality

Apply only standards resolved from the target repository's applicable harness.
A deviation blocks only when it is demonstrable, material under that authority,
and has a current consequence. Code Review owns engineering standards and code
quality; it does not perform the full Spec, Design, Quality, or Craft judgments.
Read acceptance criteria as needed to establish correct behavior without turning
this dimension into an exhaustive intent audit.

### Tests and checks

Read the testing standards routed by the target harness when tests change.
Review tests as code. Confirm they exercise observable changed behavior, would
fail for the claimed regression, and do not merely mirror implementation details
or assert a mock. A green label is misleading when the executed test cannot detect
the defect it is presented as proving. Demand only proof required by accepted
behavior, applicable standards, or a concrete changed risk.

## 6. Admit findings

For every candidate finding, require:

| Test | Required answer |
| --- | --- |
| Authority | Exact accepted behavior, routed engineering standard, or trust boundary |
| Reachability | Current accepted path or public input that reaches the problem |
| Evidence | Diff, causal trace, failed check, or direct contradiction |
| Consequence | Concrete current impact at the reachable trigger |
| Proportionality | Smallest honest severity and scope-aligned remedy |

A required proof gap identifies the authority requiring proof and the unproved
claim; do not invent a failed runtime behavior to fill that gap. Otherwise missing
any gate rejects the finding. Confirm symbol existence, initialization,
types, callers, ordering, and existing protection before reporting something as
missing or wrong. Report one problem once under its most consequential authority,
located on the smallest useful changed range. No quota, manufactured nits, personal preference,
speculative scale, or unrelated debt. Equally valid tactics are not violations.
A real defect requiring a larger remedy is still real; choose RETHINK or
READY_FOR_USER when appropriate instead of suppressing it.
Do not cap demonstrated findings arbitrarily; use `RETHINK` when the candidate's
mechanism is broadly unsound instead of turning the report into a repair script.

## 7. Report and stop

Use the report template. Keep evidence factual and prose short. Include executed
checks and unresolved gaps. Do not include rejected hypotheses, generic praise,
an investigation diary, or a proposed redesign. A standalone report stops at its
Code Review verdict; a Forge-assigned report returns to the integrating Reviewer.
