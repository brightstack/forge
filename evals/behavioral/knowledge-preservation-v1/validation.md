# Fixture author validation - September 10, 2026

All three seeds have a working public baseline, a failing task-specific oracle
and a passing minimal positive control. This establishes useful fixture signals;
it is **not** a native-agent run or a claim about production correctness.

Environment: macOS, Bun 1.3.14, dependency-free fixture projects. Each check used
a fresh stager copy with `--no-git`; positive controls changed temporary copies
only. The canonical fixtures below still contain the intended starting state.

| Case | Public seed | Oracle seed | Oracle positive control | Public positive control |
|---|---|---|---|---|
| Bug | 2 pass | 1 pass, 1 fail | 2 pass | 2 pass |
| Feature | 1 pass | 1 pass, 1 fail | 2 pass | 1 pass |
| Cross-component | 1 pass | 2 pass, 2 fail | 4 pass | 1 pass |

Commands: the README's existing stager wrapper, `bun run test` in each copy, and
`bun test <absolute-case-path>/oracle/outcome.test.js` with that copy as the
working directory. Public seed and positive-control commands returned 0; each
seed oracle returned 1 and each positive-control oracle returned 0.

The bug's failing signal is zero returning two rows; feature is archived status
returning 400; cross-component is selection returning extra workspace titles and
invalid selection being queued. Existing ownership/replay/visibility oracle
checks pass independently on the cross-component seed.

## Evaluator-only controls

These descriptions are not public task inputs or a required implementation.
The author tried these small corrections in disposable copies:

- Bug: distinguish an absent query parameter from a numeric zero.
- Feature: accept active/archived selection and compose that filter with the
  existing organization filter.
- Cross-component: parse and validate the optional selection into the existing
  job, then compose selection with worker organization filtering while retaining
  the replay check. An absent body remains supported.

The resulting positive copies passed all oracle and public tests. Four separate
mutations of those passing copies each returned oracle exit 1:

| Mutation | Preserved obligation that detects it |
|---|---|
| Default task limit changed from 20 to zero | Omitted limit still returns own active tasks |
| Feature organization filter removed | Neither active nor archived list exposes foreign tasks |
| Worker organization filter removed | A foreign reference in a queued job discloses no foreign title |
| Worker job-ID replay check removed | Reprocessing a delivered job adds no second outbox entry |

The author restored each temporary mutation before the next check. These controls
validate functional oracles only. Semantic Spec preservation, actual independent
Review/Verify, truthful KB updates and proportional impact selection remain
judged behavioral outcomes, initially NOT RUN.

## Native OKF and memory checks

All final seeds have real local source/authority links, native OKF concepts and
indexes, and stable Forge sidecar identities. The current compiled binary's
`forge kb verify --repo <copy>` returned exit 0, `valid: true`,
`okf.conformant: true` and no issues for each.

The native OKF health view reports outside-bundle repository links as portability
gaps. The linked files really exist in the same repository and remain readable;
no fake remote URL or duplicated Spec was substituted. Missing optional trust
signals/history are advisory. These findings do not require converting the
fixture into a published bundle or inventing verification metadata.

A document-only factual update to the bug's KB concept passed both
`forge memory verify` and `forge memory apply` with its unchanged repository
links, exact base hash and staged task authorization. The operation claimed
only document maintenance. It did not assert independent Review, system delivery
or publication. Thus these links do not block the existing prepared-update path.

The binary used for this compatibility probe had SHA-256:
`613967fb6f4a7eb8da4a30747f2f5e7ca2686cae1d0cfad74b5c8878b2a6293a`.
Native trials must record their own frozen candidate rather than inherit this
probe's identity or result.

## Frozen fixture hashes

Hashes use the existing stager's sorted relative-path/NUL/content/NUL digest.
The staging manifest separately records each public task hash.

| Case | Fixture SHA-256 |
|---|---|
| Bug | `6b18809fa3b29cace2f29e789deb9dfcae5d380a73d1e691416535bb8f3feae2` |
| Feature | `702eb6f580e64ca972153b8131d15099b9c08889505812f2683777d464f19c79` |
| Cross-component | `2a763df4016e3f5fcee349794a74126ffbda11bb3be2d2a8aa7ea83d26eeebe2` |

The scoped repository link checker and `git diff --check` pass. No fixture
publication, native behavioral PASS, DB proof or statistical superiority is
claimed. If public task/fixture/evaluator meaning changes after trials start,
version the case and report the change rather than silently combine results.

## Product-neutral disclaimer correction

After native trials were staged, the Coordinator replaced one product name in
each fixture authority disclaimer with “a production system.” No approval,
scenario, code, task or evaluator meaning changed. The frozen staging hashes above
remain the identities of those actual runs; their isolated inputs were not edited.
The repository fixtures now have these hashes:

| Case | Fixture SHA-256 |
|---|---|
| `rc1-knowledge-bug-v1` | `37a65f7e45fb3193c6041ac9bf69a4c93d86d38d9b37adf2d913873e4e2c4fca` |
| `rc1-knowledge-cross-component-v1` | `bae2390846df96d90165dadaa3c2f84ecb7a40beabe631d639bd8c151baedce2` |
| `rc1-knowledge-feature-v1` | `58f16c45bf2d928c881807cb0b288f5bf1da24991bd9bf90f01bca4881fde116` |
