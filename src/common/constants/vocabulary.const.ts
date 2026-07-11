/** Default values for the "Nạp từ vựng" form. */
export const VOCABULARY_FORM_DEFAULTS = {
	quantity: 10,
	/** Seconds between two words on the Learn screen. */
	gapTime: 1,
	autoRead: true,
	autoPlay: true,
} as const;

export const VOCABULARY_QUANTITY_MIN = 1;
export const VOCABULARY_QUANTITY_MAX = 50;

export const VOCABULARY_GAP_TIME_MIN = 1;
export const VOCABULARY_GAP_TIME_MAX = 30;
