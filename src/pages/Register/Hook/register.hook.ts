import { AppRoute } from "@/common/enum";
import { useAuth } from "@/contexts/AuthProvider";
import { AuthError } from "@/services/auth/auth.service";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const useRegister = () => {
	const { register: registerAccount } = useAuth();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const submit = async (values: { username: string; password: string }) => {
		setIsSubmitting(true);
		try {
			await registerAccount(values);
			toast.success("Tạo tài khoản thành công");
			navigate({ to: AppRoute.Learn });
		} catch (error) {
			const taken =
				error instanceof Error && error.message === AuthError.UsernameTaken;
			toast.error(
				taken
					? "Tài khoản đã tồn tại, hãy chọn tên khác"
					: "Đăng ký thất bại, vui lòng thử lại",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return { submit, isSubmitting };
};
