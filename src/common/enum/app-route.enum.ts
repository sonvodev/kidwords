export const AppRoute = {
	Learn: "/learn",
	Vocabulary: "/vocabulary",
} as const;

export type AppRoute = (typeof AppRoute)[keyof typeof AppRoute];
