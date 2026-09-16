export function createApi(tasks) {
  return {
    async fetch(request) {
      const url = new URL(request.url)
      if (request.method !== 'GET' || url.pathname !== '/tasks') return new Response(null, { status: 404 })
      const orgId = request.headers.get('x-org-id')
      if (!orgId) return new Response(null, { status: 401 })
      const limit = Number(url.searchParams.get('limit')) || 20
      return Response.json(tasks.filter(task => task.orgId === orgId && !task.archived).slice(0, limit))
    },
  }
}
