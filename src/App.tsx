import { SidebarProvider } from "@/contexts/SidebarProvider";
import { Outlet } from "@tanstack/react-router";
import React from "react";
import { Toaster } from "sonner";

const App: React.FC = React.memo(() => {
	return (
		<SidebarProvider>
			<Outlet />
			<Toaster position="top-center" richColors />
		</SidebarProvider>
	);
});

export default App;
