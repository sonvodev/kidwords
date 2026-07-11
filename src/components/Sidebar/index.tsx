import { MENU_ITEMS } from "@/common/enum";
import { useSidebar } from "@/contexts/SidebarProvider";
import { Link, useMatchRoute } from "@tanstack/react-router";
import cn from "classnames";
import { X } from "lucide-react";
import type React from "react";

const Sidebar: React.FC = () => {
	const { isOpen, close } = useSidebar();
	const matchRoute = useMatchRoute();

	return (
		<>
			{/* Backdrop */}
			<button
				type="button"
				tabIndex={-1}
				aria-label="Đóng menu"
				className={cn(
					"fixed inset-0 z-30 bg-slate-900/40 transition-opacity duration-300",
					isOpen ? "opacity-100" : "pointer-events-none opacity-0",
				)}
				onClick={close}
			/>

			{/* Drawer */}
			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-40 flex w-72 max-w-[80vw] flex-col bg-white shadow-xl transition-transform duration-300",
					isOpen ? "translate-x-0" : "-translate-x-full",
				)}
				aria-hidden={!isOpen}
			>
				<div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
					<span className="text-lg font-bold text-indigo-600">KidWords</span>
					<button
						type="button"
						onClick={close}
						className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
						aria-label="Đóng menu"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<nav className="flex flex-col gap-1 p-3">
					{MENU_ITEMS.map(({ label, route, icon: Icon }) => {
						const isActive = !!matchRoute({ to: route, fuzzy: true });
						return (
							<Link
								key={route}
								to={route}
								onClick={close}
								className={cn(
									"flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
									isActive
										? "bg-indigo-50 text-indigo-600"
										: "text-slate-600 hover:bg-slate-50",
								)}
							>
								<Icon className="h-5 w-5" />
								{label}
							</Link>
						);
					})}
				</nav>
			</aside>
		</>
	);
};

export default Sidebar;
