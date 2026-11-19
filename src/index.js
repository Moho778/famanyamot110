
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return Response.json({
        status: "Faman Yamat Player is running"
      });
    }

    if (request.method === "POST" && url.pathname === "/setup") {
      const auth = request.headers.get("Authorization");

      if (auth !== `Bearer ${env.WEBHOOK_SECRET}`) {
        return new Response("Forbidden", { status: 403 });
      }

      if (!env.BOT_TOKEN || !env.WEBHOOK_SECRET) {
        return Response.json({ error: "Missing secrets" }, { status: 500 });
      }

      if (!/^[A-Za-z0-9_-]{1,256}$/.test(env.WEBHOOK_SECRET)) {
        return Response.json({
          error: "WEBHOOK_SECRET must use only letters, numbers, _ or -"
        }, { status: 400 });
      }

      const result = await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/setWebhook`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: "https://famanyamot110.mamalishab.workers.dev/webhook",
            secret_token: env.WEBHOOK_SECRET,
            allowed_updates: ["channel_post"]
          })
        }
      );

      return Response.json(await result.json());
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

