import type { AuthRequest, PublicUser, User } from "@/models/user.model";
import { ServiceBase } from "@/services/_base.service";
import { hashPassword, verifyPassword } from "@/utils/crypto";
import { getDb } from "@/utils/plugins/db";
import { generateId } from "@/utils/utils";

/** Thrown with a stable `message` so the UI can map to a friendly string. */
export const AuthError = {
	UsernameTaken: "USERNAME_TAKEN",
	InvalidCredentials: "INVALID_CREDENTIALS",
} as const;

const toPublicUser = (user: User): PublicUser => ({
	id: user.id,
	username: user.username,
	createdAt: user.createdAt,
});

/**
 * Local-only account service backed by IndexedDB. Mirrors the async shape the
 * real API will have, so swapping to `super.postAsync` later stays localised.
 */
export class AuthService extends ServiceBase {
	async register({ username, password }: AuthRequest): Promise<PublicUser> {
		const db = await getDb();
		const trimmed = username.trim();
		const usernameLower = trimmed.toLowerCase();

		const existing = await db.getFromIndex(
			"users",
			"by-username",
			usernameLower,
		);
		if (existing) throw new Error(AuthError.UsernameTaken);

		const { salt, hash } = await hashPassword(password);
		const user: User = {
			id: generateId(),
			username: trimmed,
			usernameLower,
			passwordHash: hash,
			salt,
			createdAt: new Date().toISOString(),
		};
		await db.put("users", user);
		return toPublicUser(user);
	}

	async login({ username, password }: AuthRequest): Promise<PublicUser> {
		const db = await getDb();
		const user = await db.getFromIndex(
			"users",
			"by-username",
			username.trim().toLowerCase(),
		);
		if (!user) throw new Error(AuthError.InvalidCredentials);

		const ok = await verifyPassword(password, user.salt, user.passwordHash);
		if (!ok) throw new Error(AuthError.InvalidCredentials);

		return toPublicUser(user);
	}

	async getById(id: string): Promise<PublicUser | null> {
		const db = await getDb();
		const user = await db.get("users", id);
		return user ? toPublicUser(user) : null;
	}
}

const authService = new AuthService();
export default authService;
