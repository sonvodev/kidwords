export interface VocabularyWord {
	id: string;
	term: string;
	meaning?: string;
}

/** One batch of words loaded on a given day via "Nạp từ vựng". */
export interface VocabularySet {
	id: string;
	/** Owner account — sets are scoped per user. */
	userId: string;
	/** ISO timestamp; the history is grouped by the date part of this value. */
	createdAt: string;
	quantity: number;
	/** Seconds between two words on the Learn screen. */
	gapTime: number;
	/** How many times to loop the whole list before auto-stopping. */
	loopCount: number;
	autoRead: boolean;
	autoPlay: boolean;
	words: VocabularyWord[];
}

/** Payload used by both create and update — `words` are the raw terms. */
export interface SaveVocabularySetRequest {
	words: string[];
	gapTime: number;
	loopCount: number;
	autoRead: boolean;
	autoPlay: boolean;
}
