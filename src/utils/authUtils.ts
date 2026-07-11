import LocalStorageKey from "@/common/enum/local-storage-key.enum";

/** The signed-in user id is a small session pointer kept in localStorage. */
export const getSessionUserId = (): string | null =>
	localStorage.getItem(LocalStorageKey.SessionUserId);

export const setSessionUserId = (id: string): void =>
	localStorage.setItem(LocalStorageKey.SessionUserId, id);

export const clearSession = (): void =>
	localStorage.removeItem(LocalStorageKey.SessionUserId);
