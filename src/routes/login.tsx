import LoginPage from "@/pages/Login";
import { publicOnlyLoader } from "@/utils/authLoaders";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	component: LoginPage,
	beforeLoad: publicOnlyLoader,
});
