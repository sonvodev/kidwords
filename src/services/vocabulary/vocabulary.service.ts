import { LocalStorageKey } from "@/common/enum";
import type {
	SaveVocabularySetRequest,
	VocabularySet,
	VocabularyWord,
} from "@/models/vocabulary.model";
import { ServiceBase } from "@/services/_base.service";
import { getStorageItem, setStorageItem } from "@/utils/storageUtils";
import { generateId } from "@/utils/utils";

/** Mimic network latency so loading skeletons/spinners are exercised. */
const LATENCY_MS = 450;
const delay = <T>(value: T): Promise<T> =>
	new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));

const toWords = (terms: string[]): VocabularyWord[] =>
	terms.map((term) => ({ id: generateId(), term }));

/**
 * Vocabulary persistence. Backed by localStorage until the API is ready — every
 * public method is async and returns the same shapes the endpoints in
 * `ApiEndPoints` will, so the swap to `super.getAsync/postAsync` is localised.
 */
export class VocabularyService extends ServiceBase {
	private read(): VocabularySet[] {
		return getStorageItem<VocabularySet[]>(LocalStorageKey.VocabularySets, []);
	}

	private write(sets: VocabularySet[]): void {
		setStorageItem(LocalStorageKey.VocabularySets, sets);
	}

	/** Newest first. */
	async getSets(): Promise<VocabularySet[]> {
		const sets = [...this.read()].sort((a, b) =>
			b.createdAt.localeCompare(a.createdAt),
		);
		return delay(sets);
	}

	async getSetById(id: string): Promise<VocabularySet | null> {
		const found = this.read().find((set) => set.id === id) ?? null;
		return delay(found);
	}

	async getLatestSet(): Promise<VocabularySet | null> {
		const [latest] = await this.getSets();
		return latest ?? null;
	}

	async createSet(payload: SaveVocabularySetRequest): Promise<VocabularySet> {
		const words = toWords(payload.words);
		const newSet: VocabularySet = {
			id: generateId(),
			createdAt: new Date().toISOString(),
			quantity: words.length,
			gapTime: payload.gapTime,
			autoRead: payload.autoRead,
			autoPlay: payload.autoPlay,
			words,
		};

		this.write([newSet, ...this.read()]);
		return delay(newSet);
	}

	async updateSet(
		id: string,
		payload: SaveVocabularySetRequest,
	): Promise<VocabularySet | null> {
		const sets = this.read();
		const target = sets.find((set) => set.id === id);
		if (!target) return delay(null);

		const updated: VocabularySet = {
			...target,
			quantity: payload.words.length,
			gapTime: payload.gapTime,
			autoRead: payload.autoRead,
			autoPlay: payload.autoPlay,
			words: toWords(payload.words),
		};

		this.write(sets.map((set) => (set.id === id ? updated : set)));
		return delay(updated);
	}

	async deleteSet(id: string): Promise<void> {
		this.write(this.read().filter((set) => set.id !== id));
		return delay(undefined);
	}
}

const vocabularyService = new VocabularyService();
export default vocabularyService;
