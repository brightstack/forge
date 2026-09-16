# Plan Review - Lead and Reviewer topology proposal

- Target: `Plan`
- Pinned candidate: `lead-reviewer-proposal.md` at git object
  `a2222b68ff5fb51e297cc334d0455b478358e298`
- Verdict: `REVISE`
- Threat focus: accepted-authority ownership and bounded repair convergence
- BLUF: The topology matches the human direction, but two authority ambiguities and
  one incomplete repair exit can still permit unauthorized Spec changes or revive
  the feedback loop this proposal intends to remove.

## Decision assessment

| Axis | Verdict | Decisive evidence |
| --- | --- | --- |
| Upstream fidelity | `FAIL` | The proposal makes accepted Spec immutable at lines 68-71, then permits a Spec conflict to return to either a human or an owning specialist at lines 72-74. |
| Technical coherence and reuse | `PASS` | One Lead-owned candidate, one Reviewer-owned verdict, provisional seams, integrated proof, and risk-selected Judges form a coherent topology. |
| Proportionality (locks only what must be locked) | `PASS` | Lines 79-83 preserve Builder latitude, and lines 94-98 reject continuous semantic monitoring. |
| Contracts, ownership, and failure behavior | `FAIL` | The single phase Lead contract does not preserve the flat Spec bundle's exclusive multi-owner authorship, and the repair ceiling lacks a deterministic exhausted state. |
| Issues and dispatch inputs | `PASS` | Lines 61-64 and 111-120 keep Issues as legible outcome and coverage units without making them agent or source boundaries. |
| Proof | `PASS` | Lines 194-215 map the material topology risks to concrete acceptance cases and adoption signals. |

## Required changes

### Preserve exclusive Spec ownership under the phase Lead

- Authority or risk: VNEXT-D2 assigns Product, Design, and Architecture exclusive
  ownership of their respective Spec files. A phase-level Lead cannot integrate
  another owner's substantive authority as if it were Worker output.
- Reachable scenario: A Product Lead receives a Design or Technical supplement,
  reconciles a conflict while assembling the one phase candidate, and silently
  changes a decision that only Design, Architecture, or the human can resolve.
- Evidence: Proposal lines 3-5 and 44-59 give one Lead responsibility to delegate,
  inspect, and integrate every work-producing phase, but lines 102-110 provide no
  Spec exception. `decisions.md` lines 24-29 require owner-authored files and one
  bundle Review.
- Smallest correction: Keep one Spec Lead for coordination and publication, but
  state that each named owner authors and approves its own file. The Lead may
  assemble pointers and surface contradictions, but cannot edit or reconcile
  another owner's substantive decisions.

### Route every accepted-Spec conflict to the human

- Authority or risk: Accepted Spec and recorded human decisions cannot change,
  weaken, strengthen, or be reinterpreted without human approval.
- Reachable scenario: A repository UI or schema rule conflicts with an explicit
  accepted field, behavior, or NFR. The phrase "human or owning specialist" lets
  an agent resolve the conflict and mutate authority without approval.
- Evidence: Proposal lines 68-71 declare the authority absolute, while lines 72-74
  allow either destination. VNEXT-D8 requires explicit Spec obligations regardless
  of rarity and routes ambiguity through `AUTHORITY_GAP`.
- Smallest correction: Route any conflict that would alter or reinterpret accepted
  Spec or a human decision to `READY_FOR_USER`. A specialist may recommend a
  resolution or repair a stale harness implementation only when the accepted
  authority remains unchanged.

### Define the exhausted repair state

- Authority or risk: Repair must converge on the whole accepted end state and must
  not continue indefinitely as finding-by-finding patching.
- Reachable scenario: Three repair candidates each close the prior finding but
  retain or introduce another admitted P0 or P1. The gate cannot pass, but the
  proposal does not say whether the Reviewer stops, requests another repair, or
  chooses between `RETHINK` and `READY_FOR_USER`.
- Evidence: Lines 22-26 identify the current `apps/forge/AGENTS.md` contract as
  stale, but line 157 says to keep its existing three-continuation ceiling. Lines
  157-159 do not define counting or the mandatory terminal disposition. The
  accepted VNEXT-D5 defines targeted closure but no continuation ceiling.
- Smallest correction: Adopt the limit as a new explicit decision, define it as a
  maximum number of repair submissions after the initial verdict, and forbid a
  fourth. If any P0 or P1 remains, return `RETHINK`; use `READY_FOR_USER` only when
  an exact authority decision is required. Apply the same exit after one failed
  evidence exchange over a disputed finding.

## Advisory

- Implement the protected-file identity check with the existing accepted
  `spec/review.md` boundary and repository-native identity. Do not add another
  lifecycle artifact, attestation schema, or custom fingerprint protocol under
  VNEXT-D2 and VNEXT-D6.

## Routing

- Status: `REVISE`
- Open blocker: Spec-phase ownership, human-only authority conflict routing, and a
  deterministic repair-loop exit
- Next: `author-revise`

## Review surface

The proposal gets dynamic Build and adaptive Review right; residual risk is
limited to who may change accepted authority and exactly how a failed repair loop
terminates.

## Closure review

- Revised candidate: `lead-reviewer-proposal.md` at git object
  `e0cb1f21cb782f14806e6f7c711666196257eb9b`
- Verdict: `PASS`
- Prior findings: Closed. Lines 61-65 and 116-118 preserve exclusive Spec-file
  ownership under one coordinating Lead. Lines 78-82 route every accepted-Spec or
  human-decision conflict to `READY_FOR_USER`. Lines 168-175 allow exactly two
  repair submissions, define earlier `RETHINK` triggers, and reserve
  `READY_FOR_USER` for an exact authority decision.
- New P0/P1 findings: None. The corrections preserve the one candidate, one
  verdict, full-end-state repair, and no-feedback-as-authority contracts.
- Residual advisory: The protected-file identity check should still reuse the
  accepted `spec/review.md` boundary and repository-native identity rather than
  add a lifecycle artifact or custom protocol.
