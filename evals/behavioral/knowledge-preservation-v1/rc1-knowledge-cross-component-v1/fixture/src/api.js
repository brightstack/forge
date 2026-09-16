export function createApi(store) {
  return {
    async fetch(request) {
      const url = new URL(request.url)
      const orgId = request.headers.get('x-org-id')
      if (!orgId) return new Response(null, { status: 401 })
      if (request.method === 'POST' && url.pathname === '/digests') {
        const job = { id: `job-${store.jobs.length + 1}`, orgId }
        store.jobs.push(job)
        return Response.json({ jobId: job.id }, { status: 202 })
      }
      if (request.method === 'GET' && url.pathname.startsWith('/jobs/')) {
        const job = store.jobs.find(job => job.id === url.pathname.slice(6) && job.orgId === orgId)
        return job ? Response.json(job) : new Response(null, { status: 404 })
      }
      return new Response(null, { status: 404 })
    },
  }
}
