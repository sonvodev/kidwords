export interface TtsVoice {
	/** Microsoft Edge (read-aloud) voice id sent to the proxy. */
	id: string;
	label: string;
}

/**
 * Vietnamese voices from Microsoft Edge's online TTS (free, via the Worker
 * proxy). Both are Northern/standard Vietnamese; `NamMinh` is male.
 */
export const TTS_VOICES: TtsVoice[] = [
	{ id: "vi-VN-NamMinhNeural", label: "Nam – giọng Bắc" },
	{ id: "vi-VN-HoaiMyNeural", label: "Nữ – giọng Bắc" },
];

export const DEFAULT_TTS_VOICE = "vi-VN-NamMinhNeural";

const VOICE_IDS = new Set(TTS_VOICES.map((voice) => voice.id));

/** Guard against a stale/unknown saved voice id. */
export const isKnownVoice = (id: string): boolean => VOICE_IDS.has(id);
