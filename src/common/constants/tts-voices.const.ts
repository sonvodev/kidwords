export interface TtsVoice {
	/** Google Cloud TTS voice name sent to the proxy. */
	id: string;
	label: string;
}

/**
 * Google Cloud Vietnamese voices (Northern/standard). WaveNet sounds more
 * natural; `-D` / `-B` are male, `-A` / `-C` are female.
 */
export const TTS_VOICES: TtsVoice[] = [
	{ id: "vi-VN-Wavenet-D", label: "Nam – giọng Bắc" },
	{ id: "vi-VN-Wavenet-A", label: "Nữ – giọng Bắc" },
	{ id: "vi-VN-Standard-D", label: "Nam – giọng Bắc (nhẹ)" },
	{ id: "vi-VN-Standard-A", label: "Nữ – giọng Bắc (nhẹ)" },
];

export const DEFAULT_TTS_VOICE = "vi-VN-Wavenet-D";

const VOICE_IDS = new Set(TTS_VOICES.map((voice) => voice.id));

/** Guard against a stale/unknown saved voice id. */
export const isKnownVoice = (id: string): boolean => VOICE_IDS.has(id);
