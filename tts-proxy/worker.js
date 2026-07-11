/**
 * Cloudflare Worker — FPT.AI Text-to-Speech proxy for KidWords.
 *
 * Keeps the FPT api_key secret and adds CORS so the static site can fetch
 * Vietnamese speech. Given ?text=...&voice=leminh it calls FPT.AI, waits for the
 * generated audio, and streams the mp3 back.
 *
 * Set these in the Cloudflare dashboard (Worker → Settings → Variables):
 *   - FPT_API_KEY     (secret)  your key from https://console.fpt.ai
 *   - ALLOWED_ORIGIN  (plain)   e.g. https://sonvodev.github.io  (or * to allow all)
 */
export default {
	async fetch(request, env) {
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

		// 1) Ask FPT.AI to synthesize — returns a URL where the mp3 will appear.
		const ttsRes = await fetch("https://api.fpt.ai/hmi/tts/v5", {
			method: "POST",
			headers: {
				api_key: env.FPT_API_KEY,
				voice,
				speed,
				format: "mp3",
			},
			body: text,
		});

		const data = await ttsRes.json();
		if (data.error !== 0 || !data.async) {
			return new Response(JSON.stringify(data), {
				status: 502,
				headers: { ...cors, "Content-Type": "application/json" },
			});
		}

		// 2) Poll the async URL until the audio is ready (usually 1–3s).
		for (let attempt = 0; attempt < 15; attempt++) {
			const audioRes = await fetch(data.async);
			const contentType = audioRes.headers.get("content-type") || "";
			if (audioRes.ok && contentType.includes("audio")) {
				return new Response(audioRes.body, {
					headers: {
						...cors,
						"Content-Type": "audio/mpeg",
						"Cache-Control": "public, max-age=31536000, immutable",
					},
				});
			}
			await new Promise((resolve) => setTimeout(resolve, 700));
		}

		return new Response("TTS timeout", { status: 504, headers: cors });
	},
};
