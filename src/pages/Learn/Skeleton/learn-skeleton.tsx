import Skeleton from "@/components/Skeleton";
import type React from "react";

export const LearnSkeleton: React.FC = () => {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
			<Skeleton className="h-4 w-24" />
			<Skeleton className="h-20 w-64" />
			<Skeleton className="h-5 w-40" />
			<div className="flex gap-4">
				<Skeleton className="h-12 w-12 rounded-full" />
				<Skeleton className="h-12 w-12 rounded-full" />
				<Skeleton className="h-12 w-12 rounded-full" />
			</div>
		</div>
	);
};
