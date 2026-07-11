import { AppRoute } from "@/common/enum";
import { Link } from "@tanstack/react-router";
import type React from "react";

const NotFoundPage: React.FC = () => {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
			<p className="text-6xl font-black text-indigo-500">404</p>
			<p className="text-lg font-semibold text-slate-700">
				Không tìm thấy trang
			</p>
			<Link
				to={AppRoute.Learn}
				className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-600"
			>
				Về trang học từ vựng
			</Link>
		</div>
	);
};

export default NotFoundPage;
