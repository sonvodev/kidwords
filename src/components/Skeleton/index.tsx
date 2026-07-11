import cn from "classnames";
import type React from "react";

interface SkeletonProps {
	className?: string;
}

/** Base shimmer block used to compose page-level skeletons. */
const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
	return (
		<div
			className={cn("animate-pulse rounded-md bg-slate-200", className)}
			aria-hidden="true"
		/>
	);
};

export default Skeleton;
