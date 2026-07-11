import Skeleton from "@/components/Skeleton";
import type React from "react";

export const VocabularySkeleton: React.FC = () => {
	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6">
			<Skeleton className="h-8 w-40" />
			<div className="flex gap-3">
				<Skeleton className="h-11 flex-1" />
				<Skeleton className="h-11 w-32" />
			</div>
			<div className="flex flex-col gap-4">
				{[0, 1, 2].map((row) => (
					<Skeleton key={row} className="h-28 w-full rounded-2xl" />
				))}
			</div>
		</div>
	);
};
