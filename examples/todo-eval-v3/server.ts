const files = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/styles.css", "styles.css"],
  ["/src/app.js", "src/app.js"],
  ["/src/todo-list.js", "src/todo-list.js"],
]);

const server = Bun.serve({
  port: Number(Bun.env.PORT ?? 4173),
  fetch(request) {
    const file = files.get(new URL(request.url).pathname);

    if (!file) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(Bun.file(`${import.meta.dir}/${file}`));
  },
});

console.log(`Simple Todo is running at ${server.url}`);
