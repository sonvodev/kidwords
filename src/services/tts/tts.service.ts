import { getDb } from "@/utils/plugins/db";
import { speak as speakBrowser } from "@/utils/utils";

const PROXY_URL = process.env.REACT_APP_TTS_PROXY_URL || "";

/** Minimum gap between FPT requests — the free tier is rate-limited. */
const MIN_REQUEST_GAP_MS = 1500;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Reads words aloud. When the FPT.AI proxy is configured it fetches natural
 * Vietnamese speech (cached in IndexedDB so each word is fetched once), and
 * falls back to the browser's Web Speech API otherwise or on any error.
 *
 * All network calls are funneled through a single spaced-out queue so we never
 * burst the FPT free-tier rate limit; identical in-flight requests are shared.
 */
class TtsService {
	private audio: HTMLAudioElement | null = null;
	private objectUrl: string | null = null;
	private readonly inflight = new Map<string, Promise<Blob>>();
	private queue: Promise<unknown> = Promise.resolve();
	private lastRequestAt = 0;

	/** True when a proxy URL is configured, so remote voices are available. */
	isRemoteEnabled(): boolean {
		return !!PROXY_URL;
	}

	private cacheKey(voice: string, text: string): string {
		return `${voice}::${text}`;
	}

	/** Run `task` after the previous one, spaced by at least MIN_REQUEST_GAP_MS. */
	private enqueue<T>(task: () => Promise<T>): Promise<T> {
		const run = this.queue.then(async () => {
			const wait = MIN_REQUEST_GAP_MS - (Date.now() - this.lastRequestAt);
			if (wait > 0) await sleep(wait);
			try {
				return await task();
			} finally {
				this.lastRequestAt = Date.now();
			}
		});
		this.queue = run.then(
			() => undefined,
			() => undefined,
		);
		return run as Promise<T>;
	}

	private async fetchClip(voice: string, text: string): Promise<Blob> {
		const url = `${PROXY_URL}?voice=${encodeURIComponent(voice)}&text=${encodeURIComponent(text)}`;
		const response = await fetch(url);
		if (!response.ok) throw new Error("TTS_FETCH_FAILED");
		return response.blob();
	}

	private async getClip(voice: string, text: string): Promise<Blob> {
		const db = await getDb();
		const key = this.cacheKey(voice, text);

		const cached = await db.get("ttsCache", key);
		if (cached) return cached.blob;

		const existing = this.inflight.get(key);
		if (existing !== undefined) return existing;

		const promise = this.enqueue(() => this.fetchClip(voice, text)).then(
			async (blob) => {
				await db.put("ttsCache", {
					key,
					blob,
					createdAt: new Date().toISOString(),
				});
				return blob;
			},
		);
		this.inflight.set(key, promise);
		try {
			return await promise;
		} finally {
			this.inflight.delete(key);
		}
	}

	private stop(): void {
		if (this.audio) {
			this.audio.pause();
			this.audio = null;
		}
		if (this.objectUrl) {
			URL.revokeObjectURL(this.objectUrl);
			this.objectUrl = null;
		}
		if (typeof window !== "undefined" && "speechSynthesis" in window) {
			window.speechSynthesis.cancel();
		}
	}

	async speak(text: string, voice: string): Promise<void> {
		this.stop();
		if (!text) return;

		if (!PROXY_URL) {
			speakBrowser(text);
			return;
		}

		try {
			const blob = await this.getClip(voice, text);
			const objectUrl = URL.createObjectURL(blob);
			const audio = new Audio(objectUrl);
			this.audio = audio;
			this.objectUrl = objectUrl;
			await audio.play();
		} catch {
			// Network / quota / autoplay issue → keep the app usable.
			speakBrowser(text);
		}
	}

	/** Warm the cache for a set of words, one gentle request at a time. */
	async prefetch(texts: string[], voice: string): Promise<void> {
		if (!PROXY_URL) return;
		for (const text of texts) {
			if (!text) continue;
			try {
				await this.getClip(voice, text);
			} catch {
				// Ignore — speak() will retry / fall back on demand.
			}
		}
	}
}

const ttsService = new TtsService();
export default ttsService;
