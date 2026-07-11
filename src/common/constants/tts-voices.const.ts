export interface TtsVoice {
	/** FPT.AI voice id sent to the API. */
	id: string;
	label: string;
}

/** FPT.AI voices, grouped by gender + region. `leminh` is male Northern. */
export const TTS_VOICES: TtsVoice[] = [
	{ id: "leminh", label: "Nam – giọng Bắc" },
	{ id: "banmai", label: "Nữ – giọng Bắc" },
	{ id: "thuminh", label: "Nữ – giọng Bắc (2)" },
	{ id: "giahuy", label: "Nam – giọng Trung" },
	{ id: "myan", label: "Nữ – giọng Trung" },
	{ id: "lannhi", label: "Nữ – giọng Nam" },
	{ id: "linhsan", label: "Nữ – giọng Nam (2)" },
];

export const DEFAULT_TTS_VOICE = "leminh";
