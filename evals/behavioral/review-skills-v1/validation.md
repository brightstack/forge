# Deterministic validation

Run from `apps/forge` on macOS with Bun 1.3.14 and Python 3:

```bash
python3 evals/behavioral/review-skills-v1/validate.py
```

The validator stages fresh baseline/candidate and baseline/control repositories.
All eight variants pass their public tests. Candidate signals are:

| Case | Stable baseline commit | Candidate diff SHA-256 | Public | Standards | Hidden oracle |
| --- | --- | --- | --- | --- | --- |
| `review-public-input-v1` | `f2617abd0a8d2263a4876570ff23c1727a5a4135` | `2731375cd0a3fbaee0ca6dc28be46972bc2efe34f967b848e628f0a07cdac542` | PASS | PASS | expected FAIL |
| `review-standard-boundary-v1` | `db9e24f3e0863d0e2d0d865c5ce296490e48562d` | `097cf350088b44c651ae7cfbed3db8c8082f5baf50363f2532a6badb58efe8c1` | PASS | expected FAIL | expected FAIL |
| `review-spec-preservation-v1` | `06e4440de9b4a211023fd595138f60dd87ca9206` | `9e33385f0dfd606b031fe95a07548c29d2afda27ca74fa23b1db1c9470721d26` | PASS | PASS | expected FAIL |
| `review-clean-equivalent-v1` | `0499e4f0dbc41f70d7f8ce6c75c330623a1f7a7a` | `5ae01e6776f22f8ffb59b9c98e7ab06d00c3baac033ccbd4576a8e425ad2140c` | PASS | PASS | PASS |

All repaired controls pass public, standards, and hidden checks. Their diff
SHA-256 values are, in table order:

- `01da9ddd739faa3029840e5c54e9e69824b9dd53c43ec9682cf3385665dd2868`
- `4368424671219a516b37041b38df2634a9301431cbbdd69186f9f69309e81d3b`
- `7341944c15e2eb64192085f7a4c5003348d0dd533c1a39e0146faaa260d8a55e`
- `5ae01e6776f22f8ffb59b9c98e7ab06d00c3baac033ccbd4576a8e425ad2140c`

The validator also staged all seven routing packets and proved that `.eval/`
contained only `task.md` and `fixture.json`, with no evaluator or oracle copied.
The stager rejects runtime packages containing symlinks or evaluator/oracle
material. Routing and native reviewer behavior remain `NOT RUN`.

Any change to a public task, baseline, candidate, control, evaluator meaning, or
oracle after trials start requires a new case version. Do not update expected
behavior in response to reviewer results.
