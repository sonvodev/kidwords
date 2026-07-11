export const AppRoute = {
	Login: "/login",
	Register: "/register",
	Learn: "/learn",
	Vocabulary: "/vocabulary",
} as const;

export type AppRoute = (typeof AppRoute)[keyof typeof AppRoute];
