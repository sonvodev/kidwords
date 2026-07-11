import VocabularyPage from "@/pages/Vocabulary";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/vocabulary")({
	component: VocabularyPage,
});
