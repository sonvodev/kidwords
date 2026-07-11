import { getDb } from "@/utils/plugins/db";
import { speak as speakBrowser } from "@/utils/utils";

const PROXY_URL = process.env.REACT_APP_TTS_PROXY_URL || "";

/**
 * Reads words aloud. When the FPT.AI proxy is configured it fetches natural
 * Vietnamese speech (cached in IndexedDB so each word is fetched once), and
 * falls back to the browser's Web Speech API otherwise or on any error.
 */
class TtsService {
	private audio: HTMLAudioElement | null = null;
	private objectUrl: string | null = null;

	/** True when a proxy URL is configured, so remote voices are available. */
	isRemoteEnabled(): boolean {
		return !!PROXY_URL;
	}

	private cacheKey(voice: string, text: string): string {
		return `${voice}::${text}`;
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

		const blob = await this.fetchClip(voice, text);
		await db.put("ttsCache", {
			key,
			blob,
			createdAt: new Date().toISOString(),
		});
		return blob;
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

	/** Warm the cache for a set of words so playback is instant. */
	async prefetch(texts: string[], voice: string): Promise<void> {
		if (!PROXY_URL) return;
		const db = await getDb();
		await Promise.all(
			texts.map(async (text) => {
				if (!text) return;
				const key = this.cacheKey(voice, text);
				if (await db.get("ttsCache", key)) return;
				try {
					const blob = await this.fetchClip(voice, text);
					await db.put("ttsCache", {
						key,
						blob,
						createdAt: new Date().toISOString(),
					});
				} catch {
					// Ignore — speak() will retry / fall back on demand.
				}
			}),
		);
	}
}

const ttsService = new TtsService();
export default ttsService;
