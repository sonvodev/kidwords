import type LocalStorageKey from "@/common/enum/local-storage-key.enum";

/** Read and JSON-parse a value from localStorage, or `fallback` when absent/corrupt. */
export const getStorageItem = <T>(key: LocalStorageKey, fallback: T): T => {
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
};

/** JSON-serialize and persist a value to localStorage. */
export const setStorageItem = <T>(key: LocalStorageKey, value: T): void => {
	localStorage.setItem(key, JSON.stringify(value));
};

export const removeStorageItem = (key: LocalStorageKey): void => {
	localStorage.removeItem(key);
};
