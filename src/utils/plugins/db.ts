import type { User } from "@/models/user.model";
import type { VocabularySet } from "@/models/vocabulary.model";
import { type DBSchema, type IDBPDatabase, openDB } from "idb";

/** Cached TTS audio clip, keyed by `${voice}::${text}`. */
export interface TtsCacheRecord {
	key: string;
	blob: Blob;
	createdAt: string;
}

/**
 * IndexedDB — the browser database backing the app until a real API exists.
 * Stores: `users` (local accounts), `vocabularySets` (scoped per user), and
 * `ttsCache` (generated speech audio, so each word is fetched at most once).
 */
interface KidWordsDB extends DBSchema {
	users: {
		key: string;
		value: User;
		indexes: { "by-username": string };
	};
	vocabularySets: {
		key: string;
		value: VocabularySet;
		indexes: { "by-user": string };
	};
	ttsCache: {
		key: string;
		value: TtsCacheRecord;
	};
}

const DB_NAME = "kidwords";
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<KidWordsDB>> | null = null;

export const getDb = (): Promise<IDBPDatabase<KidWordsDB>> => {
	if (!dbPromise) {
		dbPromise = openDB<KidWordsDB>(DB_NAME, DB_VERSION, {
			upgrade(db, oldVersion) {
				if (oldVersion < 1) {
					const users = db.createObjectStore("users", { keyPath: "id" });
					users.createIndex("by-username", "usernameLower", { unique: true });

					const sets = db.createObjectStore("vocabularySets", {
						keyPath: "id",
					});
					sets.createIndex("by-user", "userId");
				}
				if (oldVersion < 2) {
					db.createObjectStore("ttsCache", { keyPath: "key" });
				}
			},
		});
	}
	return dbPromise;
};
