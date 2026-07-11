/**
 * Password hashing via the Web Crypto API (PBKDF2 + SHA-256). This is a local
 * profile guard, not real server-side security — anyone with access to the
 * device's IndexedDB can read the records. It only keeps passwords from being
 * stored in plain text and separates one parent's word lists from another's.
 */
const PBKDF2_ITERATIONS = 100_000;
const encoder = new TextEncoder();

const toHex = (buffer: ArrayBuffer | Uint8Array): string =>
	[...(buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer))]
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");

const fromHex = (hex: string): Uint8Array =>
	new Uint8Array(
		(hex.match(/.{1,2}/g) ?? []).map((byte) => Number.parseInt(byte, 16)),
	);

const deriveHash = async (
	password: string,
	salt: Uint8Array,
): Promise<string> => {
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);
	const bits = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			// Copy into a fresh ArrayBuffer-backed view to satisfy BufferSource.
			salt: new Uint8Array(salt),
			iterations: PBKDF2_ITERATIONS,
			hash: "SHA-256",
		},
		key,
		256,
	);
	return toHex(bits);
};

export const hashPassword = async (
	password: string,
): Promise<{ salt: string; hash: string }> => {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const hash = await deriveHash(password, salt);
	return { salt: toHex(salt), hash };
};

export const verifyPassword = async (
	password: string,
	saltHex: string,
	expectedHash: string,
): Promise<boolean> => {
	const hash = await deriveHash(password, fromHex(saltHex));
	return hash === expectedHash;
};
