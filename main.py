
import os
from fastapi import FastAPI, Request, Header, HTTPException

app = FastAPI()

WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET")

@app.get("/")
async def home():
    return {"status": "Faman Yamat Player is running"}

@app.post("/webhook")
async def webhook(
    request: Request,
    x_telegram_bot_api_secret_token: str = Header(None)
):
    if not WEBHOOK_SECRET or x_telegram_bot_api_secret_token != WEBHOOK_SECRET:
        raise HTTPException(status_code=403)

    data = await request.json()
    post = data.get("channel_post", {})
    audio = post.get("audio") or post.get("document")

    if audio:
        print({
            "file_id": audio.get("file_id"),
            "title": audio.get("title"),
            "performer": audio.get("performer"),
            "file_name": audio.get("file_name")
        })

    return {"ok": True}
