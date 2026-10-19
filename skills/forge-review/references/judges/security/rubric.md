# Security rubric

Inspect plausible current threats at changed trust boundaries, retaining the
shared security floor while avoiding invented threat models.

## Check

Identify the actor, controlled input, privilege, protected resource, and real
boundary crossed. Trace authentication/authorization and tenant scope, sensitive
outputs, query/command construction, input-derived paths/URLs, deserialization,
secrets/tokens, sandbox permissions, and delegated autonomous actions as applicable.
Inspect parameterization, escaping, canonicalization, validation, framework guards,
and downstream consumers before alleging a bypass. Check the common legitimate
path still works and failure does not leak or corrupt protected data.

## Evidence and limits

Supply an observed reproduction or concrete source-to-sink trace with current
attacker control and consequence. Use safe non-destructive proof. An unusual but
reachable attack can be critical; rarity does not dismiss a real trust boundary.
Equivalent-privilege assumptions, absent attack surfaces, generic dependency fears,
and prompt-injection claims with no autonomous security consequence are not enough.
Grade actual exposure/impact, identify existing mitigations and proof limits, and
keep remedy within authority. A needed material contract/schema/scope change is a
human decision, not security permission to implement it.

## Common contract

Read [authority](../../../../forge-shared/references/authority.md),
[finding admission](../../../../forge-shared/references/severity.md),
[actual target harness sources](../../../../forge-shared/references/target-harness.md),
[returns](../../../../forge-shared/references/returns.md), and the assigned exact
candidate/base, authority packet, target harness, and allowed tools. Remain
read-only. Judge current obligations and present risks; no finding quota,
new requirements, or automatic repair authority. Severity follows actual impact;
remedy scope is assessed separately.

Use the dimension section in [review.md](../../../assets/review.md), unless a
selected leaf supplies its own report. Return selected rubric, inspected scope,
checks/evidence, actual results, findings with trigger/consequence/remedy boundary,
gaps, and PASS, REVISE, RETHINK, READY_FOR_USER, or BLOCKED with its basis. A
required unperformed check is incomplete. The Reviewer inspects the actual report
and relevant new log evidence before disposition.
