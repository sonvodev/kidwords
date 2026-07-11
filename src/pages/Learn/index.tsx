import { Suspense, lazy } from "react";
import { LearnSkeleton } from "./Skeleton/learn-skeleton";

const LearnContent = lazy(() => import("./learn-content"));

const LearnPage: React.FC = () => {
	return (
		<Suspense fallback={<LearnSkeleton />}>
			<LearnContent />
		</Suspense>
	);
};

export default LearnPage;
