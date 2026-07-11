import { AppRoute } from "@/common/enum";
import { getSessionUserId } from "@/utils/authUtils";
import { redirect } from "@tanstack/react-router";

/** Guard app routes — bounce to the login page when there is no session. */
export const protectedLoader = (): void => {
	if (!getSessionUserId()) {
		throw redirect({ to: AppRoute.Login });
	}
};

/** Keep signed-in users away from the auth pages. */
export const publicOnlyLoader = (): void => {
	if (getSessionUserId()) {
		throw redirect({ to: AppRoute.Learn });
	}
};
