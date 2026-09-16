# Knowledge preservation trials v1

Exercise affected existing contracts and truthful knowledge maintenance across a
bug, a bounded feature and a change spanning an API and worker. These are three
small synthetic behavioral trials, not a whole-product regression suite or a
statistical comparison. They use real Request/Response handlers and worker calls
with deterministic in-memory state. No service, database or package install is
required. Native agent runs start **NOT RUN**. [Author validation](validation.md) records
seed failures, positive controls, preservation mutations and frozen fixture hashes.

## Stage and run

Reuse the existing stager; the local wrapper changes only its corpus root. From
the Forge package directory:

```bash
python3 evals/behavioral/knowledge-preservation-v1/setup.py --list
python3 evals/behavioral/knowledge-preservation-v1/setup.py \
  rc1-knowledge-bug-v1 /private/tmp/forge-knowledge-bug --no-git
```

Use a fresh destination for each case. `--no-git` avoids fixture commits; the
stager still records fixture/task hashes in `.eval/fixture.json`. The Coordinator
can initialize local Git if candidate mechanics need it; trial agents are not
authorized to commit. The default existing stager creates a fixture-only base
commit when `--no-git` is omitted.

Give a fresh native agent only the staged repository, its `.eval/task.md`, the
frozen Forge package guidance and binary, and the host's ordinary tool context.
Do not expose this directory, `evaluator.md`, oracle tests or positive-control
edits to the trial agent. Copy package guidance without its eval corpus. Run all
three cases independently, recording candidate and model/effort. CLI help from
the selected binary is authoritative; these cases do not hard-code draft command
signatures. Use the existing native trial procedure rather than a new runner.

Run public checks inside the staged repository:

```bash
bun run test
```

The evaluator separately runs an external oracle with the staged repository as
its working directory. Replace the absolute oracle path and CASE with the
checkout and case being evaluated:

```bash
bun test /ABSOLUTE/forge/evals/behavioral/knowledge-preservation-v1/CASE/oracle/outcome.test.js
```

The oracle imports source from `process.cwd()`. Never copy it into the agent's
workspace or expose its output before the candidate has been submitted. If an
evaluator deliberately provides feedback for a repair, record that disclosure
and a new repair cycle. Oracle PASS does not by itself establish behavioral PASS.

## Evidence and verdict

Each case's evaluator adds its specific conditions to these shared requirements:

- Record the source boundaries and existing Spec scenarios the agent selected.
  Trace KB links to authority and actual source. A changed package, data model,
  public interface or test is an impact clue, not permission to redefine intent.
- Review and acceptance cover the changed outcome plus affected unchanged
  obligations and failure paths. The bug and feature have one request boundary;
  the digest earns API-to-worker proof. Health is deliberately independent. No
  fresh whole-product campaign is required. Running the tiny full public suite
  is reasonable and is not penalized; unsupported expansion is recorded.
- Judge the proposed canonical diff alongside code and inspect the final memory.
  Requirements retain their meaning, approved deltas remain bounded, and factual
  KB statements match observed source. No exact prose/heading matching is used.
- Record independent Review and acceptance evidence against the actual candidate.
  A self-review or format validation does not establish independent acceptance.
- Decision provenance and existing human authority survive. New decisions need
  real scope-changing human direction; an implementation tactic does not demand
  a new decision. No duplicate canonical/loop decision authority is manufactured.
- Successful memory maintenance has discoverable evidence with honest scope.
  Use operation receipts and the candidate's available history command. A
  materialized `docs/knowledge/log.md` is not required. Document-only work cannot
  claim system delivery; local fixture delivery cannot claim publication.

Use `PASS` for the working outcome and all relevant preservation/authority/memory
conditions; `PARTIAL` for correct code with missing verification or maintenance
evidence; `FAIL` for broken required behavior, unauthorized changed intent,
false delivery claims or stale factual claims presented as current truth.
`INVALID` means oracle/task leakage or a changed fixture; `ERROR` means the
harness/environment prevented judgment. Preserve failed runs in the report.

Record outside the fixture: case/task hashes, package candidate, final source
identity, model/effort, start/end and elapsed time, repair cycles, human asks
(required versus redundant), new/edited artifact count and words, selected
boundaries/scenarios, commands/results, unauthorized changes, stale claims,
verdict and limitations. Use null/unknown for unobserved metrics. Do not infer
human review time from wall-clock time or compare unmatched models as a treatment
effect. Report whether preservation was caught during Review, during acceptance,
or only by the external oracle.

## Limits

No real authentication provider, concurrent queue, database schema migration,
external transport, browser UI, durability or crash recovery is modeled. Header
organization identity is a fixture input. Outbox replay is a single-process
contract, not a production exactly-once claim. Small fixtures can expose lost
obligations and stale memory; they cannot prove retrieval scales to a large KB
or that the workflow improves productivity.
