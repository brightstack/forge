# Wave Review: wave-002

BLUF: FIX. The pinned Forge candidate is mechanically green, but three accepted
Wave 2 guarantees fail on direct black-box paths.

- Pass: initial
- Original candidate: full-project base `7e540c1cf`; Wave 2 base
  `dc9736b07a582cbcb92bcb4cb82f45d1c36f75f0`; integrated commit
  `7b163418e8f8d5c0ff8fae74a24faeab287ac38e`; artifact
  `forge-v1-sha256:d1faecb1411e3a46b30ee952eb0d5164a1690b5f361471eadb9cec5bdc0ad21d`
- Closure candidate: none
- Accepted authority: current user Forge v1 plan; `decisions.md`, `spec.md`,
  `technical-design.md`, `plan.md`, `verification.md`, `FORGE-001`, `FORGE-002`,
  root and Forge `AGENTS.md`
- Activated lenses: correctness, accepted intent, path safety, process privacy,
  repository standards, and simplicity
- Evidence packet: complete Forge package, both diffs, direct Build results, 43
  deterministic tests, black-box CLI probes, manifest reconstruction, scoped
  links, and semantic eval inspection
- Verdict: `FIX`
- Complete-candidate Verify: `FAIL`

## Findings

### [P1] `append` can mutate a file outside every Forge run

- ID: `W002-F001`
- Authority: `technical-design.md` lines 110-118 require mutation paths beneath
  the declared loop root; `verification.md` lines 53-60 require path-safe file
  mutation; FORGE-002 requires safely managed file mechanics.
- Reachability: any caller can pass an arbitrary regular file to the accepted
  `forge append` command. `__main__.py:86-94` supplies no root, and
  `records.py:112-121` therefore resolves the target without containment.
- Direct evidence: a temporary `ordinary.md` outside any initialized run was
  passed to `forge append`. The command returned `0`, reported the external path,
  and added `## outside-run` to the file.
- Material impact: a helper presented as safe Forge record mutation can alter an
  unrelated file anywhere the invoking process can write.
- Correction boundary: preserve the accepted CLI surface while proving the append
  target belongs to one initialized Forge run before opening it. Add a black-box
  rejection for an ordinary external file.

### [P1] loop validation accepts completion without a Wave Review

- ID: `W002-F002`
- Authority: FORGE-D7, `spec.md` lines 48-67, and `protocol.md` lines 80-92 require
  one independent Review pass before an Issue enters `verify`; Final Verify runs
  only after every Wave passes. `technical-design.md` lines 76-88 assigns loop
  consistency and candidate identity to mechanical validation.
- Reachability: a run can contain an Issue in `verify`, a matching `closed` Wave,
  and a matching Final Verify report whose `Wave Reviews` field is `none`.
  `_validate_wave` at `validation.py:256-266` validates Reviews only when one
  happens to exist and never requires a direct passing Review for a closed Wave.
- Direct evidence: `forge check loop` returned `0` for that exact temporary tree;
  its checked paths contained no Review report.
- Material impact: Forge can report a structurally coherent candidate ready for
  Verify or Ship after skipping the core independent Wave gate.
- Correction boundary: make loop validation require the direct passing Review or
  resolved closure fact, bound to the same candidate, whenever a Wave is closed;
  ensure Final Verify references the actual passed Wave Reviews. This checks
  direct facts and does not ask mechanics to judge professional sufficiency.

### [P1] fallback diagnostics can persist the pointer input

- ID: `W002-F003`
- Authority: `technical-design.md` lines 34-36 and 110-118, `runtime.md` lines
  39-48, `verification.md` lines 53-60, and FORGE-002 require pointer input through
  stdin without persistence.
- Reachability: a caller-supplied agent command can echo stdin. The wrapper at
  `agents.py:376-386` writes all child stdout and stderr to transient files with
  no boundary preventing the pointer bytes from entering them.
- Direct evidence: an agent command that printed `sys.stdin.read()` exited `0`;
  `${TMPDIR}/forge-agents-<uid>/echoer/stdout.log` contained the exact sentinel
  `SECRET-POINTER-CONTEXT`.
- Material impact: generated assignment or prompt content is retained despite the
  explicit no-persistence contract.
- Correction boundary: keep the provider-neutral lifecycle while ensuring
  Forge-controlled transient records cannot retain pointer bytes. Prove it with
  a child that echoes stdin, not only one that discards it.

## Acceptance and proof map

| Accepted capability | Result | Current proof |
| --- | --- | --- |
| Forge naming, six phases, role ownership, native-first fallback | PASS | Complete package inspection, dispatch scan, nine semantic eval cases, scoped links |
| Exact CLI surface and arbitrary-cwd entry | PASS | CLI tests plus absolute `bin/forge --help` from `/private/tmp` |
| Concurrent append and dependency-ready Issues | PASS | 43-test suite covers locking, duplicate headings, missing IDs, cycles, and ready state |
| Path-safe file mutation | FAIL | `W002-F001` |
| Wave/Issue/candidate consistency | FAIL | `W002-F002` |
| Generic start, status, wait, and stop | PARTIAL | Lifecycle tests pass; no-persist boundary fails in `W002-F003` |
| Candidate identity | PASS | Reconstructed 62-entry manifest equals the pinned artifact identity |
| Complete-candidate proof | FAIL | Three material accepted guarantees remain open |

## Targeted closure

| Finding | Result | Evidence |
| --- | --- | --- |
| `W002-F001` | OPEN | No repair candidate yet |
| `W002-F002` | OPEN | No repair candidate yet |
| `W002-F003` | OPEN | No repair candidate yet |

## Evidence record

Exact passing commands:

```text
python3 -m unittest discover -s apps/forge/tests -p 'test_*.py' -v
python3 -m compileall -q apps/forge/forge apps/forge/tests
python3 docs/scripts/check-links.py apps/forge
git diff --check 7e540c1cf..7b163418e8f8d5c0ff8fae74a24faeab287ac38e -- AGENTS.md apps/forge
cd /private/tmp && /Users/marcelowiermann/Code/bright/flash/.worktrees/agent-loop-sdlc-vnext/apps/forge/bin/forge --help
```

- Deterministic suite: PASS, 43 tests.
- Compile, scoped links, diff hygiene, and arbitrary-cwd CLI: PASS.
- Candidate manifest: PASS. Sorted rows use
  `<644|755> <repository-relative path> <file SHA-256>` plus a final newline for
  root `AGENTS.md` and 61 non-generated Forge files outside the active Build
  record. The result is the pinned artifact identity.
- Focused black-box probes: append outside a run returned `0`; a closed Wave with
  no Review passed `check loop`; an echoing fallback retained the pointer in
  `stdout.log`.
- Semantic eval inspection: PASS for the nine accepted regression cases. None
  supplies authority to weaken the three direct Forge v1 guarantees above.

## Coverage

- Inspected: the complete candidate, root dispatch, roles, router and references,
  templates, semantic evals, all Python mechanics, CLI integration, tests, direct
  Build records, accepted intent, candidate identity, and current working-tree
  state.
- Not covered: provider-specific behavior, live native-host delegation quality,
  browser or visual behavior, PR, merge, deployment, and publication. These are
  inactive or explicit non-goals for this candidate.

## Targeted closure - repaired candidate

BLUF: PASS. The single repair batch resolves all three original findings on the
exact repaired candidate, and no accepted capability remains without current
proof.

- Repair commit: `3bc3c5c19b4508e6efd70063a86958153cd6df07`
- Closure candidate:
  `forge-v1-sha256:b74fb43356cdded4dc324de5b72779bbd67815628c36be0cff416a5bdc701b36`
- Final Wave Review verdict: `PASS`
- Complete-candidate Verify: `PASS`
- Remaining blockers: none

| Finding | Result | Closure evidence |
| --- | --- | --- |
| `W002-F001` | RESOLVED | `records.py` now discovers and structurally validates the enclosing initialized run, then applies `contained_path` before opening the record. The original external-file black-box probe now exits `1` and leaves the file unchanged. |
| `W002-F002` | RESOLVED | `validation.py` now requires a direct passing `review.md` for each closed Wave, binds its effective candidate to the Wave, and requires Final Verify to cite exactly the selected passed Wave Reviews. The original no-Review tree now exits `1`; matching initial and targeted-closure candidates pass. |
| `W002-F003` | RESOLVED | `agents.py` no longer creates or reports child stdout or stderr logs. The focused child echoes pointer bytes to both streams; the lifecycle completes and no Forge-controlled transient file contains the sentinel. |

### Closure evidence

```text
python3 -m unittest apps.forge.tests.test_cli.ForgeCliTests.test_append_rejects_a_file_outside_an_initialized_run apps.forge.tests.test_cli.ForgeCliTests.test_check_loop_rejects_closed_wave_without_review apps.forge.tests.test_agents.AgentProcessTests.test_pointer_is_not_persisted_by_forge -v
python3 -m unittest discover -s apps/forge/tests -p 'test_*.py' -v
python3 -m compileall -q apps/forge/forge apps/forge/tests
python3 docs/scripts/check-links.py apps/forge
git diff --check 7b163418e8f8d5c0ff8fae74a24faeab287ac38e..3bc3c5c19b4508e6efd70063a86958153cd6df07 -- apps/forge
cd /private/tmp && /Users/marcelowiermann/Code/bright/flash/.worktrees/agent-loop-sdlc-vnext/apps/forge/bin/forge --help
```

- Focused closure: PASS, 3 original reproductions.
- Complete deterministic proof: PASS, 49 tests.
- Compile, scoped links, repair diff hygiene, and arbitrary-cwd CLI: PASS.
- Reconstructed 62-entry manifest: PASS, exact match to the closure candidate.
- Repair blast radius: `records.py`, `validation.py`, `agents.py`, their direct
  tests, and direct repair records. No accepted artifact, CLI signature, runtime
  selection rule, or semantic workflow decision changed.
