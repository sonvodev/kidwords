import { Inbox } from "lucide-react";
import type React from "react";

interface NoDataViewProps {
	title?: string;
	description?: string;
	action?: React.ReactNode;
}

const NoDataView: React.FC<NoDataViewProps> = ({
	title = "Chưa có dữ liệu",
	description,
	action,
}) => {
	return (
		<div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 py-16 text-center">
			<div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
				<Inbox className="h-7 w-7 text-slate-400" />
			</div>
			<p className="text-base font-semibold text-slate-700">{title}</p>
			{description && (
				<p className="max-w-sm text-sm text-slate-500">{description}</p>
			)}
			{action}
		</div>
	);
};

export default NoDataView;
