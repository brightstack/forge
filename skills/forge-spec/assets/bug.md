# TODO bug outcome

<!--
Forge Bug Issue description body. Preserve the same deliberate Issue format.
Context records expected/actual behavior, accepted source, impact, and reproduction status.
Notes carry a safe reproduction and falsifiable hypotheses with their distinguishing evidence;
Plan carries proof cues for the original reproduction and affected consumers. Do not assume the reported cause.
Mandatory contract - preserve these section headings and order after the managed frontmatter and outer title.
Load this asset once before drafting and reuse the held copy. Re-read only after truncation, conflict,
relevant template change, or loss of held context.

Forge managed frontmatter supplies identity and title; retain the outer # title.
Feature, Tech Task, and Bug remain delivery types, not replacement body sections.
Use supported delivery-type metadata when available, otherwise a short Context cue; preserve the generated immutable record kind.
Preserve section order and meaning. Major body sections use ##; Plan cues use ###.

Lean: Context is 1-3 short paragraphs; everything else is bullets.
Self-contained enough for Plan mode to expand - do NOT pre-write file-level subtasks here.
Optional ## Plan section: Plan-mode handoff cues only (key files, verification commands).
-->

## Context

<!-- 1-3 short paragraphs: applicable user/job, why this exists, what outcome it delivers, what depends on it.
     Summarize required PRD context here; link source docs in References. -->

## Acceptance Criteria

<!-- Functional end state: user-facing or system outcomes the user can verify - not implementation steps. Binary, demonstrable bullets. Put file paths, patterns, and impl hints under ## Notes.
     GOOD: "User sees ranked top-5 urgent items from Linear, GitHub, and Slack on the home screen"
     BAD: "Update HomeView.tsx to fetch from three APIs" or "Make it better" -->

- <a visible behavior the user can verify>

## Non-Functional Requirements

<!-- Only what applies: latency budget, idempotency, constraints to honor. -->

- <e.g. p95 latency budget, idempotency, a side effect to preserve>

## Notes

<!-- Implementation cues: patterns, files or areas likely touched, out-of-scope edges. -->

- <cue or idea>

## Plan

<!-- Plan-mode handoff cues only - not file-level subtasks. Delete if not needed. -->

### Key files

<!-- Likely files or areas to touch - from plan or codebase grounding. -->

- <path or area>

### Verification commands

<!-- Exact test/build/lint command from repo conventions (AGENTS.md, CLAUDE.md, .cursor/rules/) - not hardcoded. -->

- <command>

### Approach notes

<!-- High-level approach or sequencing - not a task list. -->

- <note>

## References

<!-- Internal: code paths, project PRD, reference docs. External: current-year sources. -->

- Internal: <link>
- External: <link>
