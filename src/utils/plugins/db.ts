import type { User } from "@/models/user.model";
import type { VocabularySet } from "@/models/vocabulary.model";
import { type DBSchema, type IDBPDatabase, openDB } from "idb";

/**
 * IndexedDB — the browser database backing the app until a real API exists.
 * Two stores: `users` (local accounts) and `vocabularySets` (scoped per user).
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
}

const DB_NAME = "kidwords";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<KidWordsDB>> | null = null;

export const getDb = (): Promise<IDBPDatabase<KidWordsDB>> => {
	if (!dbPromise) {
		dbPromise = openDB<KidWordsDB>(DB_NAME, DB_VERSION, {
			upgrade(db) {
				const users = db.createObjectStore("users", { keyPath: "id" });
				users.createIndex("by-username", "usernameLower", { unique: true });

				const sets = db.createObjectStore("vocabularySets", { keyPath: "id" });
				sets.createIndex("by-user", "userId");
			},
		});
	}
	return dbPromise;
};
