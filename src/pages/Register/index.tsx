import { AppRoute } from "@/common/enum";
import AuthShell from "@/components/AuthShell";
import { useRegister } from "@/pages/Register/Hook/register.hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import type React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
	.object({
		username: z.string().trim().min(3, "Tài khoản tối thiểu 3 ký tự"),
		password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Mật khẩu nhập lại không khớp",
		path: ["confirmPassword"],
	});

type FormValues = z.infer<typeof schema>;

const RegisterPage: React.FC = () => {
	const { submit, isSubmitting } = useRegister();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({ resolver: zodResolver(schema) });

	return (
		<AuthShell
			title="Đăng ký"
			subtitle="Tạo tài khoản để lưu lộ trình từ vựng riêng cho bé."
			footer={
				<>
					Đã có tài khoản?{" "}
					<Link
						to={AppRoute.Login}
						className="font-semibold text-indigo-600 hover:underline"
					>
						Đăng nhập
					</Link>
				</>
			}
		>
			<form
				onSubmit={handleSubmit((values) =>
					submit({ username: values.username, password: values.password }),
				)}
				className="flex flex-col gap-4"
			>
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
						autoComplete="new-password"
						{...register("password")}
						className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
					/>
					{errors.password && (
						<span className="text-xs text-red-500">
							{errors.password.message}
						</span>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="confirmPassword"
						className="text-sm font-medium text-slate-700"
					>
						Nhập lại mật khẩu
					</label>
					<input
						id="confirmPassword"
						type="password"
						autoComplete="new-password"
						{...register("confirmPassword")}
						className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
					/>
					{errors.confirmPassword && (
						<span className="text-xs text-red-500">
							{errors.confirmPassword.message}
						</span>
					)}
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
					{isSubmitting ? "Đang tạo..." : "Đăng ký"}
				</button>
			</form>
		</AuthShell>
	);
};

export default RegisterPage;
