
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return Response.json({
        status: "Faman Yamat Player is running"
      });
    }

    if (request.method === "POST" && url.pathname === "/webhook") {
      const secret = request.headers.get(
        "X-Telegram-Bot-Api-Secret-Token"
      );

      if (!env.WEBHOOK_SECRET || secret !== env.WEBHOOK_SECRET) {
        return new Response("Forbidden", { status: 403 });
      }

      const update = await request.json();
      const post = update.channel_post;

      if (post) {
        const audio = post.audio || post.document;

        if (audio) {
          console.log({
            file_id: audio.file_id,
            title: audio.title || "",
            performer: audio.performer || "",
            file_name: audio.file_name || ""
          });
        }
      }

      return Response.json({ ok: true });
    }

    return new Response("Not found", { status: 404 });
  }
};
