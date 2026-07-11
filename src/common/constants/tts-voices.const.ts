export interface TtsVoice {
	/** Language/voice id sent to the proxy. */
	id: string;
	label: string;
}

/**
 * Voice(s) available through the proxy. Google Translate offers a single
 * Northern Vietnamese voice, so there is one entry and the picker stays hidden.
 */
export const TTS_VOICES: TtsVoice[] = [{ id: "vi", label: "Giọng Bắc" }];

export const DEFAULT_TTS_VOICE = "vi";

const VOICE_IDS = new Set(TTS_VOICES.map((voice) => voice.id));

/** Guard against a stale/unknown saved voice id. */
export const isKnownVoice = (id: string): boolean => VOICE_IDS.has(id);
