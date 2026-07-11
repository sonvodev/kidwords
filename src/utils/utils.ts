/** Generate a reasonably-unique id without pulling in a uuid dependency. */
export const generateId = (): string => {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return crypto.randomUUID();
	}
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

/** Pick `count` random distinct items from `source` (or all of them if fewer). */
export const sampleArray = <T>(source: T[], count: number): T[] => {
	const pool = [...source];
	const size = Math.min(count, pool.length);
	for (let i = pool.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}
	return pool.slice(0, size);
};

/** e.g. "Thứ 6, 11/07/2026" */
export const formatDate = (iso: string): string =>
	new Date(iso).toLocaleDateString("vi-VN", {
		weekday: "long",
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

/** e.g. "16:20" */
export const formatTime = (iso: string): string =>
	new Date(iso).toLocaleTimeString("vi-VN", {
		hour: "2-digit",
		minute: "2-digit",
	});

/** Day key (YYYY-MM-DD) used to group history entries. */
export const toDayKey = (iso: string): string => iso.slice(0, 10);

/** Read a word aloud via the Web Speech API. No-op when unsupported. */
export const speak = (text: string, lang = "vi-VN"): void => {
	if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
	window.speechSynthesis.cancel();
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = lang;
	utterance.rate = 0.9;
	window.speechSynthesis.speak(utterance);
};
