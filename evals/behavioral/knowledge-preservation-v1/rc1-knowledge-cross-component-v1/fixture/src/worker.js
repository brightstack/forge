export function runDigest(job, store, outbox) {
  if (outbox.some(delivery => delivery.jobId === job.id)) return
  const workspaces = store.workspaces.filter(workspace => workspace.orgId === job.orgId)
  outbox.push({ jobId: job.id, orgId: job.orgId, titles: workspaces.map(workspace => workspace.title) })
}
