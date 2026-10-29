# Repair and stopping

Repair the complete affected outcome within [accepted authority](authority.md),
using [impact-based severity](severity.md) and [sound simplicity](pragmatism.md).

Before dispatching repair, the accountable owner checks the supported defect and
the proposed correction separately in the existing report or Build log. Only
authorized defect correction enters automatic repair; proposals stay optional and
rejected material feedback gets a concise reason. Inspect the current owner and
available correction proportionately, without an exhaustive alternatives search.
An elaborate reviewer recommendation is not proof that it is necessary. The owner
can reject that mechanism, retain the defect, and choose a sound in-scope fix
without another permission gate. If the necessary correction exceeds authority,
hold the affected boundary and return the consequential decision; severity stays
visible and unaffected work can continue. Do not turn each finding into an Issue.

Give each finding a stable local ID, such as `R1`, and retain it across candidate
revisions. Never reassign an ID to a different defect. Preserve delegated reports'
original IDs and claims; map each source report and ID to its integrated ID,
including duplicates. Qualify source IDs by report when they collide.

At each reassessment, append a disposition for every prior finding in the existing
Review, Code Review, or Build record, bound to that round and exact candidate:
`open` for an unresolved defect, `resolved` with current-candidate proof,
`rejected` with the evidence or reason for rejecting the claim, or `optional` with
the reason it remains advisory. Retain earlier entries even when nothing remains
open; reopen the same ID if later evidence shows the defect persists or recurs.
Keep severity and remedy assessment separate from status. Rejecting a proposed
mechanism does not reject or resolve the underlying defect, and closure of the
listed findings does not establish a complete-candidate verdict.

Return the whole accepted packet to its accountable Builder. Group symptoms by
shared cause, repair the coherent outcome, and reassess affected Review and
Verify against the changed candidate. P2 never prolongs work.

After three substantive Review/Verify-to-repair cycles for the packet, or
three substantive repairs in one cycle, stop editing and record a rethink: failed
invariant, common cause, why repairs failed, simpler approach, preserved scope,
and discriminating proof. Have a separate Engineer challenge it. If no supported
approach emerges, or the same failure recurs after that challenge, return BLOCKED
with evidence and the required input. Do not reset the count by renaming work or
relaxing accepted intent.

In delivery, repair first restores passing Build/Review, then reassesses
[Simplify](../../forge-simplify/SKILL.md) proportionately before affected QA.
Changes from Simplify receive affected proof and independent delta Review bound
to the resulting complete candidate; an evidenced no-op retains prior Review.
Reuse unaffected proof with its candidate-bound reason instead of forcing a
complete restart. A direct operation's failure does not authorize broader repair
or a delivery lifecycle outside its requested boundary.
