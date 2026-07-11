import { AppRoute } from "@/common/enum";
import { useAuth } from "@/contexts/AuthProvider";
import { AuthError } from "@/services/auth/auth.service";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export interface LoginFormValues {
	username: string;
	password: string;
}

export const useLogin = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const submit = async (values: LoginFormValues) => {
		setIsSubmitting(true);
		try {
			await login(values);
			navigate({ to: AppRoute.Learn });
		} catch (error) {
			const isInvalid =
				error instanceof Error &&
				error.message === AuthError.InvalidCredentials;
			toast.error(
				isInvalid
					? "Sai tài khoản hoặc mật khẩu"
					: "Đăng nhập thất bại, vui lòng thử lại",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return { submit, isSubmitting };
};
