import { AppRoute } from "@/common/enum";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthProvider";
import { useSidebar } from "@/contexts/SidebarProvider";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu } from "lucide-react";
import type React from "react";

const MainLayout: React.FC = () => {
	const { open } = useSidebar();
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate({ to: AppRoute.Login });
	};

	return (
		<div className="flex min-h-screen flex-col bg-white text-slate-900">
			<header className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-white/80 px-4 py-3 backdrop-blur">
				<button
					type="button"
					onClick={open}
					className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100"
					aria-label="Mở menu"
				>
					<Menu className="h-6 w-6" />
				</button>

				{user && (
					<div className="flex items-center gap-2">
						<span className="max-w-[8rem] truncate text-sm font-medium text-slate-600">
							{user.username}
						</span>
						<button
							type="button"
							onClick={handleLogout}
							className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-red-500"
							aria-label="Đăng xuất"
						>
							<LogOut className="h-4 w-4" />
						</button>
					</div>
				)}
			</header>

			<Sidebar />

			<main className="flex flex-1 flex-col">
				<Outlet />
			</main>
		</div>
	);
};

export default MainLayout;
