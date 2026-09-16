# Select workspaces for a digest

Allow POST `/digests` to accept a JSON `workspaceIds` array of nonempty string
IDs. A supplied array selects those workspaces for this digest; an empty array
selects none, and omitting the field keeps the existing whole-organization
behavior. Invalid field shapes return 400. Return 202 and a job ID as today.
The worker must process the selection. Keep the existing API functions so current
callers continue to work. This request authorizes that bounded behavior change;
record the delta and relevant domain/API/process context, then reconcile affected
standing Spec and knowledge after acceptance. Inspect the KB for governing
contracts and the worker's accepted ownership decision.


Use the supplied Forge candidate to complete the change in this isolated fixture.
This request authorizes local Build, independent Review, acceptance Verify and
necessary document reconciliation, including factual KB corrections. The named
request defines the only approved behavioral change. Reuse this authorization;
ask only if a consequential decision is genuinely unresolved. Do not publish,
deploy externally or commit. Keep evidence of the resulting candidate, checks
and any limitations. The project needs no network service or dependency install.
