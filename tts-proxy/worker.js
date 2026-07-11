/**
 * Cloudflare Worker — FPT.AI Text-to-Speech proxy for KidWords.
 *
 * Keeps the FPT api_key secret and adds CORS so the static site can fetch
 * Vietnamese speech. Given ?text=...&voice=leminh it calls FPT.AI, waits for the
 * generated audio, and streams the mp3 back. Results are cached at the edge, and
 * FPT's free-tier rate limit is retried with a short backoff.
 *
 * Set these in the Cloudflare dashboard (Worker → Settings → Variables):
 *   - FPT_API_KEY     (secret)  your key from https://console.fpt.ai
 *   - ALLOWED_ORIGIN  (plain)   e.g. https://sonvodev.github.io  (or * to allow all)
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
	async fetch(request, env, ctx) {
		const cors = {
			"Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
			"Access-Control-Allow-Methods": "GET, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		};

		if (request.method === "OPTIONS") {
			return new Response(null, { headers: cors });
		}

		const url = new URL(request.url);
		const text = url.searchParams.get("text");
		const voice = url.searchParams.get("voice") || "leminh";
		const speed = url.searchParams.get("speed") || "0";

		if (!text) {
			return new Response("Missing 'text'", { status: 400, headers: cors });
		}

		// Serve identical requests straight from the edge cache — no FPT call.
		const cache = caches.default;
		const cacheKey = new Request(url.toString(), { method: "GET" });
		const hit = await cache.match(cacheKey);
		if (hit) return hit;

		// 1) Ask FPT.AI to synthesize, retrying the free-tier rate limit.
		let data = null;
		for (let attempt = 0; attempt < 4; attempt++) {
			const ttsRes = await fetch("https://api.fpt.ai/hmi/tts/v5", {
				method: "POST",
				headers: { api_key: env.FPT_API_KEY, voice, speed, format: "mp3" },
				body: text,
			});
			data = await ttsRes.json().catch(() => null);

			if (data?.error === 0 && data?.async) break;

			const message = (data?.message || "").toLowerCase();
			if (message.includes("rate limit")) {
				await sleep(1000 * (attempt + 1));
				continue;
			}
			break; // other error → don't retry
		}

		if (data?.error !== 0 || !data?.async) {
			return new Response(JSON.stringify(data ?? { message: "TTS failed" }), {
				status: 502,
				headers: { ...cors, "Content-Type": "application/json" },
			});
		}

		// 2) Poll the async URL until the audio is ready (usually 1–3s).
		for (let attempt = 0; attempt < 15; attempt++) {
			const audioRes = await fetch(data.async);
			const contentType = audioRes.headers.get("content-type") || "";
			if (audioRes.ok && contentType.includes("audio")) {
				const response = new Response(audioRes.body, {
					headers: {
						...cors,
						"Content-Type": "audio/mpeg",
						"Cache-Control": "public, max-age=31536000, immutable",
					},
				});
				ctx.waitUntil(cache.put(cacheKey, response.clone()));
				return response;
			}
			await sleep(700);
		}

		return new Response("TTS timeout", { status: 504, headers: cors });
	},
};
