# Vietnamese TTS proxy (Cloudflare Worker)

Gives KidWords natural Vietnamese voices (male / female, Northern) using
**Google Cloud Text-to-Speech**. The Worker keeps the Google API key secret and
adds CORS; audio is cached at the edge.

The app works without this (it falls back to the browser voice) — set it up only
when you want the nicer voices.

Free tier is generous: ~1M characters/month for WaveNet voices (Standard: ~4M).
A billing account (card) must be enabled on the project, but this usage stays
inside the free tier.

## Step 1 — Google Cloud API key

1. https://console.cloud.google.com → create/select a project.
2. **Enable billing** for the project (Billing → link a card). Required even for
   the free tier; it won't charge under the free limits.
3. **APIs & Services → Library** → enable **Cloud Text-to-Speech API**.
4. **APIs & Services → Credentials → Create credentials → API key** → copy it.
5. (Recommended) Edit the key → **API restrictions** → restrict to
   **Cloud Text-to-Speech API**.

## Step 2 — Deploy the Worker

1. https://dash.cloudflare.com → **Workers & Pages** → **Create** →
   **Start with Hello World!** → name it `kidwords-tts` → **Deploy**.
2. **Edit code** → delete everything → paste all of [`worker.js`](./worker.js) →
   **Deploy**.
3. **Settings → Variables**:
   - `GOOGLE_API_KEY` — your key. Click **Encrypt** (secret).
   - `ALLOWED_ORIGIN` — `https://sonvodev.github.io` (or `*` while testing).
4. Copy the Worker URL, e.g. `https://kidwords-tts.<you>.workers.dev`.

Quick test in a browser:
`https://kidwords-tts.<you>.workers.dev/?voice=vi-VN-Wavenet-D&text=xin%20chào`
→ should play/download an mp3 (male Northern voice).

## Step 3 — Point the app at the Worker

The app reads the proxy URL from the build-time variable
`REACT_APP_TTS_PROXY_URL`, wired to a GitHub **repository variable**:

1. GitHub repo → **Settings → Secrets and variables → Actions → Variables**.
2. Set/confirm **`TTS_PROXY_URL`** = the Worker URL.
3. **Actions** tab → re-run **Deploy to GitHub Pages** (or push any change).

The Learn screen then shows a **voice picker** and reads with the Google voice.
Each word is cached in the browser (IndexedDB) and at the Worker edge, so it's
fetched at most once per voice.

## Voices

- `vi-VN-Wavenet-D`, `vi-VN-Wavenet-B` — Nam (male)
- `vi-VN-Wavenet-A`, `vi-VN-Wavenet-C` — Nữ (female)
- `vi-VN-Standard-*` — lighter (non-WaveNet) equivalents

Full list: https://cloud.google.com/text-to-speech/docs/voices
