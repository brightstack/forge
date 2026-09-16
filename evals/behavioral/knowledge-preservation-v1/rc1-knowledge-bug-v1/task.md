# Restore zero-size task listing

The client uses GET `/tasks?limit=0` with header `x-org-id: north` to request
no rows. It currently receives tasks. Restore the existing accepted contract.
The reproduction uses `createApi` with one active north task and calls its
`fetch(Request)` handler. Keep the existing public interface and correct any
knowledge made stale by the repair. This is a bug fix, with no approved new
behavior or permission to weaken existing scenarios.


Use the supplied Forge candidate to complete the change in this isolated fixture.
This request authorizes local Build, independent Review, acceptance Verify and
necessary document reconciliation, including factual KB corrections. The named
request defines the only approved behavioral change. Reuse this authorization;
ask only if a consequential decision is genuinely unresolved. Do not publish,
deploy externally or commit. Keep evidence of the resulting candidate, checks
and any limitations. The project needs no network service or dependency install.
