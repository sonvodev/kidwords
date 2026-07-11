import { AppRoute } from "@/common/enum";
import AuthShell from "@/components/AuthShell";
import { useLogin } from "@/pages/Login/Hook/login.hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import type React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	username: z.string().trim().min(1, "Nhập tài khoản"),
	password: z.string().min(1, "Nhập mật khẩu"),
});

type FormValues = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
	const { submit, isSubmitting } = useLogin();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({ resolver: zodResolver(schema) });

	return (
		<AuthShell
			title="Đăng nhập"
			subtitle="Từ vựng của bạn được lưu riêng theo tài khoản."
			footer={
				<>
					Chưa có tài khoản?{" "}
					<Link
						to={AppRoute.Register}
						className="font-semibold text-indigo-600 hover:underline"
					>
						Đăng ký
					</Link>
				</>
			}
		>
			<form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="username"
						className="text-sm font-medium text-slate-700"
					>
						Tài khoản
					</label>
					<input
						id="username"
						autoComplete="username"
						{...register("username")}
						className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
					/>
					{errors.username && (
						<span className="text-xs text-red-500">
							{errors.username.message}
						</span>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="password"
						className="text-sm font-medium text-slate-700"
					>
						Mật khẩu
					</label>
					<input
						id="password"
						type="password"
						autoComplete="current-password"
						{...register("password")}
						className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
					/>
					{errors.password && (
						<span className="text-xs text-red-500">
							{errors.password.message}
						</span>
					)}
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
					{isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
				</button>
			</form>
		</AuthShell>
	);
};

export default LoginPage;
