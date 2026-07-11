import MainLayout from "@/layouts/MainLayout";
import { protectedLoader } from "@/utils/authLoaders";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
	component: MainLayout,
	beforeLoad: protectedLoader,
});
