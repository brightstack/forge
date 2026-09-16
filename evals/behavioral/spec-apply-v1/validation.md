# Fixture author validation

Behavioral status: **NOT RUN**.

On 2026-09-10, author checks confirmed that both public seeds pass, each hidden
runtime oracle fails at seed for the intended missing behavior, minimal positive
controls pass public and hidden checks, the stager copies no evaluator/oracle
files, and the feature manifest pins current, proposed, baseline, change, context,
and human-authorization inputs.

Required package checks:

```bash
python3 evals/behavioral/spec-apply-v1/setup.py --list
python3 evals/behavioral/spec-apply-v1/setup.py \
  rc1-spec-apply-feature-v1 /private/tmp/forge-spec-apply-feature-author --no-git
python3 evals/behavioral/spec-apply-v1/setup.py \
  rc1-spec-apply-restorative-v1 /private/tmp/forge-spec-apply-restorative-author --no-git
bun run test
```

The corrected compiled interface had no executable Spec command. `forge docs
validate` passed both seeds. Feature `forge memory verify`, apply, and matching
replay passed; `kb ask` returned a matching `application: spec`, document-only,
working-copy reference with authority and implementation not inferred. Public
checks passed 2/2 for feature and 3/3 for restorative. Seed oracles each retained
one intended runtime failure; positive controls passed 3/3 and 2/2 respectively.

| Case | Fixture SHA-256 | Public task SHA-256 |
| --- | --- | --- |
| Feature | `ad9ec31e8b253f4dd37fcf092a2256a07aedd08ad7d02cbd97277f7bbf088c76` | `e48fb78b02c2512ddd5ac4b6139fabe051dfe7a468c6b58d4fbfb55e06185f4c` |
| Restorative | `2ef565cba4776bcd8b4b4c4dd134c832078f3314928461aa87a5e483a745d2b2` | `4a405684b1e2de942221fdb8870d1ca83ea4e0340120009cbcd8e926ac67e3ce` |

The author-check binary SHA-256 was
`757205e9f551754527c256c4b823a3294c7481787e3c8b1c2158697236fe0f2d`.
The final package must rebuild after template integration and record its own hash.
Native feature, restorative, closure-negative, and retained closure-replay runs:
**NOT RUN**.

## Authority-preserving feature v2

Added `rc1-spec-apply-feature-v2` after v1 native Review exposed that v1 modeled
only reminder state while RM-03/RM-04 required observable delivery. Frozen v1
files and run records remain unchanged.

The v2 seed adds an existing `deliverDueReminder` runtime consumer that returns a
delivery and writes it to an outbox at a synthetic due boundary. No scheduler or
network is modeled. Author validation on 2026-09-10 established:

- case-local staging and resume reveal pass with only `.eval/task.md`,
  `.eval/fixture.json`, and later `.eval/resume.md` in the public packet;
- public seed checks pass 3/3, including active due-delivery emission;
- document validation and the pinned `SPEC-REMINDER-PAUSE-02` memory verify/apply
  pass with document-only `application: spec` provenance;
- the seed oracle fails the missing pause implementation while its invalid-update
  and receipt checks pass;
- a disposable state-only correction still fails on actual delivery emission;
  and
- a disposable full correction passes the hidden oracle 3/3 and public checks 3/3.

Frozen v2 fixture SHA-256:
`d11841dfa1f2fdcc46f86762bb2855ba9863dc0231bdd7bfe2f634939193ee4e`.
Public task SHA-256:
`363941605a2a751e1fb55486d5141b7ab863488567e8d1de77fb4de05c19e031`.
Native v2 agent execution remains **NOT RUN**.
