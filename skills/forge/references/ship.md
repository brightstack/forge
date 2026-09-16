# Ship

Ship closes the authorized local outcome and performs only publication actions
the user actually authorized. It starts from the exact Review-passed and
Acceptance-passed candidate, comparison base, retained accepted baseline and
approved change, current canonical files, applicable Spec-apply receipts, and
explicit external-action authority.

Before closure, check once that:

- candidate/base still match Review and Acceptance;
- required scenarios, NFRs, preserved obligations, and visual acceptance passed
  or have explicit blocking gaps;
- selected authority, runtime inputs, canonical files, and applicable receipt
  hashes still match the reviewed candidate; and
- each requested PR, merge, deployment, release, document publication, or other
  external action is explicitly authorized.

The canonical target normally entered the working tree during approved Spec
application and joined the complete Build candidate. Do not routinely perform a
second substantive canonical apply or request another semantic post-apply verdict
at Ship. The existing Build Review judged code, tests, actual canonical Spec, and
earned KB bytes together; Acceptance exercised that same candidate. Structural
checks, receipt matching, or a clean tree do not replace either judgment.

Record one concise [ship.md](../assets/ship.md) closure with the accepted candidate,
current candidate, comparison base, Review and Acceptance references, applicable
Spec-apply receipts, publication actions, and limits. Normally accepted and final
candidate are identical. Publication facts belong in this closure; a deployment
timestamp does not require a canonical status edit or another review loop.

If an authorized merge or rebase changes only Git identity, retain the historical
verdicts under their original candidate, record the exact old-to-new relationship,
and judge which proof remains applicable. Never relabel an old verdict. If source,
runtime input, authority, canonical meaning, or accepted behavior changed, route
the affected work to its owning Build, Review, or Acceptance boundary before
closure.

For an existing operation ID, inspect its retained receipt and current result
hashes. Matching bytes are already applied; do not replay writes or invent another
operation ID. Diverged bytes, malformed provenance, a missing Review/Acceptance
reference, or a changed authority/runtime input stop the affected claim and name
the owner who must resolve it.

Execute only authorized repository or publication mechanics. A PR request does
not imply merge or deploy; a merge request does not imply production release.
Use `READY_FOR_USER` for an ungranted external action or unresolved human-owned
meaning. Mechanical freshness success does not prove semantic fidelity,
Acceptance, deployment, or publication.
