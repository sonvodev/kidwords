import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/contexts/SidebarProvider";
import { Outlet } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import type React from "react";

const MainLayout: React.FC = () => {
	const { open } = useSidebar();

	return (
		<div className="flex min-h-screen flex-col bg-white text-slate-900">
			<header className="sticky top-0 z-20 flex items-center gap-3 bg-white/80 px-4 py-3 backdrop-blur">
				<button
					type="button"
					onClick={open}
					className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100"
					aria-label="Mở menu"
				>
					<Menu className="h-6 w-6" />
				</button>
			</header>

			<Sidebar />

			<main className="flex flex-1 flex-col">
				<Outlet />
			</main>
		</div>
	);
};

export default MainLayout;
