# FPT.AI TTS proxy (Cloudflare Worker)

A tiny proxy that gives KidWords a natural Vietnamese voice (male / Northern,
etc.) while keeping the FPT.AI key secret and solving CORS. Free on both
[FPT.AI](https://console.fpt.ai) (100k chars/month) and
[Cloudflare Workers](https://workers.cloudflare.com) (100k requests/day).

The app works without this (it falls back to the browser voice) — set it up only
when you want the nicer FPT voices.

## Step 1 — Get an FPT.AI key

1. Sign up at https://console.fpt.ai and open **Text to Speech**.
2. Copy your **API key**.

## Step 2 — Deploy the Worker

**Easiest (dashboard):**

1. https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Worker**.
2. Give it a name (e.g. `kidwords-tts`), **Deploy**, then **Edit code**.
3. Replace the contents with [`worker.js`](./worker.js) and **Deploy**.
4. **Settings → Variables**:
   - `FPT_API_KEY` — your FPT key. Click **Encrypt** (secret).
   - `ALLOWED_ORIGIN` — `https://sonvodev.github.io` (locks the proxy to your site;
     use `*` while testing).
5. Copy the Worker URL, e.g. `https://kidwords-tts.<you>.workers.dev`.

Quick test in a browser:
`https://kidwords-tts.<you>.workers.dev/?voice=leminh&text=xin%20chào`
→ should play/download an mp3.

## Step 3 — Point the app at the Worker

The app reads the proxy URL from the build-time variable
`REACT_APP_TTS_PROXY_URL`, wired to a GitHub **repository variable**:

1. GitHub repo → **Settings → Secrets and variables → Actions → Variables**.
2. **New repository variable**: name `TTS_PROXY_URL`, value the Worker URL.
3. **Actions** tab → re-run **Deploy to GitHub Pages** (or push any change).

After it deploys, the Learn screen shows a **voice picker** (Nam – giọng Bắc, …)
and reads words with the FPT voice. Each word is cached in the browser, so it is
fetched at most once per voice.

## Voices

`leminh` (Nam – Bắc), `banmai` / `thuminh` (Nữ – Bắc), `giahuy` (Nam – Trung),
`myan` (Nữ – Trung), `lannhi` / `linhsan` (Nữ – Nam). Full list:
https://docs.fpt.ai/docs/en/speech/api/text-to-speech.html
