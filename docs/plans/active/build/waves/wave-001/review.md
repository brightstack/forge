# Wave Review: wave-001

BLUF: FIX - four material contract gaps must close before Wave 2 starts.

- Pass: initial
- Original candidate: `7e540c1cf` to `a521e11a179f05cd6f93c5f82738bb3c24d75b62`
- Closure candidate: none
- Accepted authority: user Forge v1 plan; accepted Build package and repository rules
- Activated lenses: correctness, accepted intent, repository standards, and simplicity
- Evidence packet: pinned diff, roles, workflows, templates, evals, and scoped checks
- Verdict: `FIX`

## Findings

### [P1] Wave 2 has no durable CLI signature contract

- ID: W001-F001
- Authority: the accepted Forge v1 plan specifies each CLI signature; FORGE-D1,
  FORGE-D2, and FORGE-D9 bind the Wave 2 boundary.
- Reachability: after this Review passes, the CLI Builders load FORGE-002 and the
  Technical Design. Those files name commands but omit the accepted signatures for
  `init`, `append`, Issue operations, and checks.
- Direct evidence: the pinned tree preserves only command names and the fallback
  `forge agent` signatures.
- Material impact: Wave 2 must recover chat or invent its public CLI.
- Correction boundary: persist the complete accepted Forge CLI surface in Wave 2's
  durable authority without adding commands, policy, or provider behavior.

### [P1] The repair reference permits a forbidden second repair cycle

- ID: W001-F002
- Authority: FORGE-D7 and `plan.md` steps 5-7 allow one repair batch and closure,
  then require replan or user input for any remaining material finding.
- Reachability: when targeted closure leaves a local material defect,
  `references/build.md:75-79` directs the Manager to create a successor repair Wave.
- Direct evidence: the route contradicts `plan.md:30-31` and starts another repair.
- Material impact: the supposedly bounded loop can continue under a renamed Wave,
  recreating the runaway cost and ceremony Forge is meant to prevent.
- Correction boundary: stop remaining Wave Review failures at replan or user input.
  Preserve Final Verify's separately accepted source-repair route.

### [P1] Moving an Issue breaks its accepted references

- ID: W001-F003
- Authority: the Technical Design and `references/protocol.md:75-92` make location
  the only Issue status; the Spec requires records to survive context changes.
- Reachability: a PASS on this Review immediately moves FORGE-001 from `review/` to
  `verify/`.
- Direct evidence: performing that move in an archive of the pinned candidate makes
  the links in `plan.md:10` and `wave-001/index.md:4` fail the scoped link checker.
- Material impact: the Plan and Wave record lose the Issue while releasing Wave 2.
- Correction boundary: keep one movable Issue file as status while ensuring durable
  Plan, Wave, and dependency references remain resolvable after every legal move.

### [P1] Wave 1 has no direct Builder or integration records

- ID: W001-F004
- Authority: `spec.md:52-56`, `plan.md:21-24`, and the protocol require Builder
  plans/results, exact identity, integration evidence, and Manager links.
- Reachability: Review and resume must distinguish three Builds and integration from
  Manager-authored state.
- Direct evidence: the pinned Wave tree contains only `wave-001/index.md`; its claimed
  direct plans, results, integration checks, owners, and links do not exist.
- Material impact: direct ownership, consumed inputs, integration proof, and the
  Manager boundary are unproven.
- Correction boundary: have the accountable agents write and link honest direct Wave
  1 Build and integration records. Do not have the Manager fabricate retrospective
  specialist conclusions.

## Coverage

- Inspected: complete diff, authority, roles, workflows, templates, evals, Issue
  transitions, links, vocabulary, and whitespace.
- Checks: `git diff --check` passed; scoped Markdown links passed before transition;
  Forge contains neither the former name nor the forbidden runtime term; the
  `review -> verify` fixture reproduced two broken links.
- Not covered: Wave 2 mechanics and tests, which are not present in this candidate;
  security and visual lenses were not triggered.

## Targeted closure

- Closure candidate: `ac3403a42ad53fe8370372cd9b13412f5a0724d0`
- Repair range: `a521e11a179f05cd6f93c5f82738bb3c24d75b62` to closure candidate
- Final verdict: `PASS`

| Finding | Result | Evidence |
| --- | --- | --- |
| W001-F001 | RESOLVED | The Technical Design preserves the exact accepted command surface once; FORGE-002 and Wave 2 link to it. |
| W001-F002 | RESOLVED | `references/build.md` now stops after failed targeted closure and preserves Final Verify's separate source-failure route. |
| W001-F003 | RESOLVED | Durable records use stable Issue IDs plus the board root; scoped links passed after tested moves through `in-progress`, `review`, `verify`, and `ship`. |
| W001-F004 | RESOLVED | The three original Builders wrote linked plan/result pairs with explicit retrospective timing; the Integration Builder wrote and linked the direct integration record. |

Focused checks passed: repair `git diff --check`, scoped Forge links, one exact CLI
signature block, bounded repair routing, direct-record presence, and Issue-transition
link checks. No original material finding remains, and no directly reachable material
defect was introduced in the repaired surfaces.
