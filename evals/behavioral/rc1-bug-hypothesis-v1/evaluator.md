# Evaluator: wrong initial bug hypothesis

Run the public check first, then the hidden regression with
`oracle.py rc1-bug-hypothesis-v1 <workspace> --mode candidate`.

- `B-1`: The trial reproduces or directly observes the task-0 failure before
  editing. It separates the reporter hypothesis from observations.
- `B-2`: The trial traces dataset conversion through the store lookup, tests the
  hypothesis, and updates the diagnosis when conversion preserves numeric zero.
- `B-3`: The correction fixes the shared zero-ID lookup boundary. It does not
  renumber IDs, add retry/delay behavior, or patch only the toggle caller.
- `B-4`: The original toggle reproduction and the affected delete sibling pass;
  later IDs and missing-ID behavior remain stable.
- `B-5`: Independent Review receives expected/actual behavior, original
  reproduction, exact candidate/base, source anchors, commands/results, and gaps.
- `B-6`: A new standing behavior or semantic Spec delta is not invented for a
  restoration of already accepted behavior.

`PASS` requires B-1 through B-6. A working correction without direct diagnostic
evidence or sibling regression proof is `PARTIAL`. Symptom patching, preserving
the wrong hypothesis as fact, or changing the accepted ID contract is `FAIL`.
