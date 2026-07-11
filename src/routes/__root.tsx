import App from "@/App";
import NotFoundPage from "@/pages/404Page";
import { createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: App,
	notFoundComponent: NotFoundPage,
});
