/**
 * Cloudflare Worker — Vietnamese Text-to-Speech proxy for KidWords.
 *
 * Uses Google Translate's TTS voice (Northern Vietnamese) — free, no account and
 * no API key. Given ?text=... it returns an mp3. Results are cached at the edge.
 * Best for short text (single words); the source caps ~200 characters per call.
 *
 * Optional variable (Worker → Settings → Variables):
 *   - ALLOWED_ORIGIN  e.g. https://sonvodev.github.io  (or * to allow all)
 */
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
		const lang = url.searchParams.get("lang") || "vi";
		if (!text) {
			return new Response("Missing 'text'", { status: 400, headers: cors });
		}

		// Serve identical requests straight from the edge cache.
		const cache = caches.default;
		const cacheKey = new Request(url.toString(), { method: "GET" });
		const hit = await cache.match(cacheKey);
		if (hit) return hit;

		const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(text.slice(0, 200))}`;
		const upstream = await fetch(ttsUrl, {
			headers: { "User-Agent": "Mozilla/5.0" },
		});

		if (!upstream.ok) {
			return new Response(JSON.stringify({ status: upstream.status }), {
				status: 502,
				headers: { ...cors, "Content-Type": "application/json" },
			});
		}

		const response = new Response(upstream.body, {
			headers: {
				...cors,
				"Content-Type": "audio/mpeg",
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
		ctx.waitUntil(cache.put(cacheKey, response.clone()));
		return response;
	},
};
