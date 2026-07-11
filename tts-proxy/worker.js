/**
 * Cloudflare Worker — Microsoft Edge (read-aloud) Text-to-Speech proxy.
 *
 * Free, no account and no API key: it uses the same online voices as the Edge
 * browser's "Read aloud". Given ?text=...&voice=vi-VN-NamMinhNeural it returns an
 * mp3. Results are cached at the edge.
 *
 * Optional variable (Worker → Settings → Variables):
 *   - ALLOWED_ORIGIN  e.g. https://sonvodev.github.io  (or * to allow all)
 *
 * Voices: vi-VN-NamMinhNeural (Nam), vi-VN-HoaiMyNeural (Nữ).
 */
const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const WSS_BASE =
	"https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1";
const GEC_VERSION = "1-130.0.2849.68";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const escapeXml = (text) =>
	text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");

/** Security token Edge requires: SHA-256 of (winFileTime rounded to 5min + token). */
async function generateSecMsGec() {
	let ticks = BigInt(Math.floor(Date.now() / 1000) + 11644473600) * 10000000n;
	ticks -= ticks % 3000000000n; // round down to a 5-minute boundary
	const input = ticks.toString() + TRUSTED_CLIENT_TOKEN;
	const digest = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(input),
	);
	return [...new Uint8Array(digest)]
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("")
		.toUpperCase();
}

async function synthesize(text, voice, rate) {
	const gec = await generateSecMsGec();
	const url = `${WSS_BASE}?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&Sec-MS-GEC=${gec}&Sec-MS-GEC-Version=${GEC_VERSION}`;

	const resp = await fetch(url, {
		headers: {
			Upgrade: "websocket",
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
			Origin: "chrome-extension://jdiccldimpahndcamegapbcbpankekhf",
		},
	});
	const ws = resp.webSocket;
	if (!ws) throw new Error("WS_CONNECT_FAILED");
	ws.accept();

	const chunks = [];
	const finished = new Promise((resolve, reject) => {
		ws.addEventListener("message", (event) => {
			if (typeof event.data === "string") {
				if (event.data.includes("Path:turn.end")) resolve();
				return;
			}
			const bytes = new Uint8Array(event.data);
			const headerLen = (bytes[0] << 8) | bytes[1];
			chunks.push(bytes.slice(2 + headerLen));
		});
		ws.addEventListener("close", () => resolve());
		ws.addEventListener("error", () => reject(new Error("WS_ERROR")));
	});

	const now = new Date().toString();
	ws.send(
		`X-Timestamp:${now}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
			`{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`,
	);

	const ssml =
		`<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='vi-VN'>` +
		`<voice name='${voice}'><prosody rate='${rate}' pitch='+0Hz'>${escapeXml(text)}</prosody></voice></speak>`;
	ws.send(
		`X-RequestId:${crypto.randomUUID().replaceAll("-", "")}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${now}Z\r\nPath:ssml\r\n\r\n${ssml}`,
	);

	await Promise.race([
		finished,
		sleep(15000).then(() => {
			throw new Error("WS_TIMEOUT");
		}),
	]);
	try {
		ws.close();
	} catch {}

	const total = chunks.reduce((sum, c) => sum + c.length, 0);
	if (total === 0) throw new Error("NO_AUDIO");
	const audio = new Uint8Array(total);
	let offset = 0;
	for (const c of chunks) {
		audio.set(c, offset);
		offset += c.length;
	}
	return audio;
}

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
		const voice = url.searchParams.get("voice") || "vi-VN-NamMinhNeural";
		const rate = url.searchParams.get("rate") || "-10%";
		if (!text) {
			return new Response("Missing 'text'", { status: 400, headers: cors });
		}

		const cache = caches.default;
		const cacheKey = new Request(url.toString(), { method: "GET" });
		const hit = await cache.match(cacheKey);
		if (hit) return hit;

		try {
			const audio = await synthesize(text, voice, rate);
			const response = new Response(audio, {
				headers: {
					...cors,
					"Content-Type": "audio/mpeg",
					"Cache-Control": "public, max-age=31536000, immutable",
				},
			});
			ctx.waitUntil(cache.put(cacheKey, response.clone()));
			return response;
		} catch (error) {
			return new Response(JSON.stringify({ error: String(error?.message) }), {
				status: 502,
				headers: { ...cors, "Content-Type": "application/json" },
			});
		}
	},
};
