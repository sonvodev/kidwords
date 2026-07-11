# Vietnamese TTS proxy (Cloudflare Worker)

Gives KidWords a natural Vietnamese voice (male / Northern) using **Microsoft
Edge's online "read-aloud" voices** — **free, no account and no API key**. The
Worker just holds the connection and adds CORS; audio is cached at the edge.

The app works without this (it falls back to the browser voice) — set it up only
when you want the nicer voice.

## Deploy the Worker

1. https://dash.cloudflare.com → **Workers & Pages** → **Create** →
   **Start with Hello World!** → name it `kidwords-tts` → **Deploy**.
2. **Edit code** → delete everything → paste all of [`worker.js`](./worker.js) →
   **Deploy**.
3. **Settings → Variables**: add `ALLOWED_ORIGIN` = `https://sonvodev.github.io`
   (or `*` while testing). No API key is needed.
   - If you previously added `FPT_API_KEY`, you can delete it.
4. Copy the Worker URL, e.g. `https://kidwords-tts.<you>.workers.dev`.

Quick test in a browser:
`https://kidwords-tts.<you>.workers.dev/?voice=vi-VN-NamMinhNeural&text=xin%20chào`
→ should play/download an mp3 (male Northern voice).

## Point the app at the Worker

The app reads the proxy URL from the build-time variable
`REACT_APP_TTS_PROXY_URL`, wired to a GitHub **repository variable**:

1. GitHub repo → **Settings → Secrets and variables → Actions → Variables**.
2. **New repository variable**: name `TTS_PROXY_URL`, value the Worker URL.
3. **Actions** tab → re-run **Deploy to GitHub Pages** (or push any change).

After it deploys, the Learn screen shows a **voice picker** and reads words with
the Edge voice. Each word is cached in the browser (IndexedDB) and at the Worker
edge, so it is fetched at most once per voice.

## Voices

- `vi-VN-NamMinhNeural` — Nam (male), giọng Bắc
- `vi-VN-HoaiMyNeural` — Nữ (female), giọng Bắc

## Notes

This uses Microsoft's public Edge read-aloud endpoint (the same one the Edge
browser uses). It needs no key, but it is not an officially documented API, so it
could change. If it ever stops working the app automatically falls back to the
browser's built-in voice.
