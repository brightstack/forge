const root = new URL("./", import.meta.url);
const assets = {
  "/": "index.html",
  "/index.html": "index.html",
  "/app.js": "app.js",
  "/styles.css": "styles.css",
};

Bun.serve({
  port: 3005,
  fetch(request) {
    const name = assets[new URL(request.url).pathname];
    if (!name) return new Response("Not found", { status: 404 });
    return new Response(Bun.file(new URL(name, root)));
  },
});

console.log("Todo app ready at http://localhost:3005");
