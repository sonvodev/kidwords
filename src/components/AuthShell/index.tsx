import type React from "react";

interface AuthShellProps {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
}

/** Centered card used by the login and register pages. */
const AuthShell: React.FC<AuthShellProps> = ({
	title,
	subtitle,
	children,
	footer,
}) => {
	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
			<div className="animate-fadeIn w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm">
				<div className="mb-6 text-center">
					<p className="text-2xl font-black text-indigo-600">KidWords</p>
					<h1 className="mt-3 text-lg font-bold text-slate-800">{title}</h1>
					{subtitle && (
						<p className="mt-1 text-sm text-slate-500">{subtitle}</p>
					)}
				</div>
				{children}
				{footer && (
					<div className="mt-5 text-center text-sm text-slate-500">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
};

export default AuthShell;
