import LearnPage from "@/pages/Learn";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/learn")({
	component: LearnPage,
});
