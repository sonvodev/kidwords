import { AppRoute } from "@/common/enum/app-route.enum";
import { BookOpenText, PlusCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface MenuItem {
	label: string;
	route: AppRoute;
	icon: LucideIcon;
}

export const MENU_ITEMS: MenuItem[] = [
	{ label: "Học từ vựng", route: AppRoute.Learn, icon: BookOpenText },
	{ label: "Nạp từ vựng", route: AppRoute.Vocabulary, icon: PlusCircle },
];
