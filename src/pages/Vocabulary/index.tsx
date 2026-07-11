import { Suspense, lazy } from "react";
import { VocabularySkeleton } from "./Skeleton/vocabulary-skeleton";

const VocabularyContent = lazy(() => import("./vocabulary-content"));

const VocabularyPage: React.FC = () => {
	return (
		<Suspense fallback={<VocabularySkeleton />}>
			<VocabularyContent />
		</Suspense>
	);
};

export default VocabularyPage;
