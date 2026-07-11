import { AuthProvider } from "@/contexts/AuthProvider";
import { SidebarProvider } from "@/contexts/SidebarProvider";
import { Outlet } from "@tanstack/react-router";
import React from "react";
import { Toaster } from "sonner";

const App: React.FC = React.memo(() => {
	return (
		<AuthProvider>
			<SidebarProvider>
				<Outlet />
				<Toaster position="top-center" richColors />
			</SidebarProvider>
		</AuthProvider>
	);
});

export default App;
