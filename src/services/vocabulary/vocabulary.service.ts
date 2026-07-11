import type {
	SaveVocabularySetRequest,
	VocabularySet,
	VocabularyWord,
} from "@/models/vocabulary.model";
import { ServiceBase } from "@/services/_base.service";
import { getDb } from "@/utils/plugins/db";
import { generateId } from "@/utils/utils";

const toWords = (terms: string[]): VocabularyWord[] =>
	terms.map((term) => ({ id: generateId(), term }));

const byNewest = (a: VocabularySet, b: VocabularySet): number =>
	b.createdAt.localeCompare(a.createdAt);

/**
 * Vocabulary persistence on IndexedDB, scoped per user. Async signatures match
 * the future API so the swap to `super.getAsync/postAsync` stays localised.
 */
export class VocabularyService extends ServiceBase {
	/** Newest first, for the given user only. */
	async getSets(userId: string): Promise<VocabularySet[]> {
		const db = await getDb();
		const sets = await db.getAllFromIndex("vocabularySets", "by-user", userId);
		return sets.sort(byNewest);
	}

	async getSetById(id: string): Promise<VocabularySet | null> {
		const db = await getDb();
		return (await db.get("vocabularySets", id)) ?? null;
	}

	async getLatestSet(userId: string): Promise<VocabularySet | null> {
		const [latest] = await this.getSets(userId);
		return latest ?? null;
	}

	async createSet(
		userId: string,
		payload: SaveVocabularySetRequest,
	): Promise<VocabularySet> {
		const words = toWords(payload.words);
		const newSet: VocabularySet = {
			id: generateId(),
			userId,
			createdAt: new Date().toISOString(),
			quantity: words.length,
			gapTime: payload.gapTime,
			loopCount: payload.loopCount,
			autoRead: payload.autoRead,
			autoPlay: payload.autoPlay,
			words,
		};

		const db = await getDb();
		await db.put("vocabularySets", newSet);
		return newSet;
	}

	async updateSet(
		id: string,
		payload: SaveVocabularySetRequest,
	): Promise<VocabularySet | null> {
		const db = await getDb();
		const target = await db.get("vocabularySets", id);
		if (!target) return null;

		const updated: VocabularySet = {
			...target,
			quantity: payload.words.length,
			gapTime: payload.gapTime,
			loopCount: payload.loopCount,
			autoRead: payload.autoRead,
			autoPlay: payload.autoPlay,
			words: toWords(payload.words),
		};

		await db.put("vocabularySets", updated);
		return updated;
	}

	async deleteSet(id: string): Promise<void> {
		const db = await getDb();
		await db.delete("vocabularySets", id);
	}
}

const vocabularyService = new VocabularyService();
export default vocabularyService;
