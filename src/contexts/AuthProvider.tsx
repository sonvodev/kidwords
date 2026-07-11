import type { AuthRequest, PublicUser } from "@/models/user.model";
import authService from "@/services/auth/auth.service";
import {
	clearSession,
	getSessionUserId,
	setSessionUserId,
} from "@/utils/authUtils";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import type React from "react";

interface AuthContextValue {
	user: PublicUser | null;
	isAuthenticated: boolean;
	/** True until the persisted session has been resolved on first load. */
	isInitializing: boolean;
	login: (payload: AuthRequest) => Promise<PublicUser>;
	register: (payload: AuthRequest) => Promise<PublicUser>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<PublicUser | null>(null);
	const [isInitializing, setIsInitializing] = useState(true);

	// Restore the session from the persisted user id on first load.
	useEffect(() => {
		const sessionId = getSessionUserId();
		if (!sessionId) {
			setIsInitializing(false);
			return;
		}
		authService
			.getById(sessionId)
			.then((restored) => {
				if (restored) setUser(restored);
				else clearSession();
			})
			.finally(() => setIsInitializing(false));
	}, []);

	const login = useCallback(async (payload: AuthRequest) => {
		const loggedIn = await authService.login(payload);
		setSessionUserId(loggedIn.id);
		setUser(loggedIn);
		return loggedIn;
	}, []);

	const register = useCallback(async (payload: AuthRequest) => {
		const created = await authService.register(payload);
		setSessionUserId(created.id);
		setUser(created);
		return created;
	}, []);

	const logout = useCallback(() => {
		clearSession();
		setUser(null);
	}, []);

	const value = useMemo(
		() => ({
			user,
			isAuthenticated: !!user,
			isInitializing,
			login,
			register,
			logout,
		}),
		[user, isInitializing, login, register, logout],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
