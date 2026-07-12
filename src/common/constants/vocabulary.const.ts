/** Default values for the "Nạp từ vựng" form. */
export const VOCABULARY_FORM_DEFAULTS = {
	quantity: 10,
	/** Seconds between two words on the Learn screen. */
	gapTime: 1,
	/** Loop the whole list this many times before auto-stopping. */
	loopCount: 2,
	autoRead: true,
	autoPlay: true,
} as const;

export const VOCABULARY_QUANTITY_MIN = 1;
export const VOCABULARY_QUANTITY_MAX = 50;

export const VOCABULARY_GAP_TIME_MIN = 0.2;
export const VOCABULARY_GAP_TIME_MAX = 30;
export const VOCABULARY_GAP_TIME_STEP = 0.1;

export const VOCABULARY_LOOP_MIN = 1;
export const VOCABULARY_LOOP_MAX = 20;
