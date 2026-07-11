/**
 * Cloudflare Worker — Google Cloud Text-to-Speech proxy for KidWords.
 *
 * Keeps the Google API key secret and adds CORS. Given ?text=...&voice=... it
 * returns an mp3. Results are cached at the edge. Vietnamese voices are Northern;
 * `vi-VN-Wavenet-D` / `-B` are male.
 *
 * Set in the Cloudflare dashboard (Worker → Settings → Variables):
 *   - GOOGLE_API_KEY  (secret)  a Text-to-Speech API key from Google Cloud
 *   - ALLOWED_ORIGIN  (plain)   e.g. https://sonvodev.github.io  (or * to allow all)
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
		const voice = url.searchParams.get("voice") || "vi-VN-Wavenet-D";
		if (!text) {
			return new Response("Missing 'text'", { status: 400, headers: cors });
		}

		const cache = caches.default;
		const cacheKey = new Request(url.toString(), { method: "GET" });
		const hit = await cache.match(cacheKey);
		if (hit) return hit;

		const upstream = await fetch(
			`https://texttospeech.googleapis.com/v1/text:synthesize?key=${env.GOOGLE_API_KEY}`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					input: { text },
					voice: { languageCode: "vi-VN", name: voice },
					audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 },
				}),
			},
		);

		const data = await upstream.json().catch(() => null);
		if (!upstream.ok || !data?.audioContent) {
			return new Response(JSON.stringify(data ?? { error: "TTS failed" }), {
				status: 502,
				headers: { ...cors, "Content-Type": "application/json" },
			});
		}

		// Google returns base64-encoded mp3.
		const binary = atob(data.audioContent);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

		const response = new Response(bytes, {
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
