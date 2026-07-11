import RegisterPage from "@/pages/Register";
import { publicOnlyLoader } from "@/utils/authLoaders";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
	component: RegisterPage,
	beforeLoad: publicOnlyLoader,
});
