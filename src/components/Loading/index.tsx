import cn from "classnames";
import { Loader2 } from "lucide-react";
import type React from "react";

interface LoadingProps {
	/** When true, renders a full-screen overlay that blocks interaction. */
	overlay?: boolean;
	message?: string;
	className?: string;
}

/**
 * Spinner. As an `overlay` it covers the viewport and swallows pointer events,
 * guarding against repeated button taps while an action is in flight.
 */
const Loading: React.FC<LoadingProps> = ({ overlay, message, className }) => {
	const spinner = (
		<div className="flex flex-col items-center gap-3 text-slate-600">
			<Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
			{message && <span className="text-sm font-medium">{message}</span>}
		</div>
	);

	if (!overlay) {
		return (
			<div className={cn("flex justify-center py-8", className)}>{spinner}</div>
		);
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm"
			role="alert"
			aria-busy="true"
		>
			{spinner}
		</div>
	);
};

export default Loading;
