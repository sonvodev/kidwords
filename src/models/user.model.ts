/** Stored user record (local-only auth — see auth.service.ts). */
export interface User {
	id: string;
	/** Display name as entered. */
	username: string;
	/** Lower-cased username used for the unique lookup index. */
	usernameLower: string;
	passwordHash: string;
	salt: string;
	createdAt: string;
}

/** User shape exposed to the UI — never carries credentials. */
export interface PublicUser {
	id: string;
	username: string;
	createdAt: string;
}

export interface AuthRequest {
	username: string;
	password: string;
}
