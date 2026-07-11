import {
	VOCABULARY_GAP_TIME_MAX,
	VOCABULARY_GAP_TIME_MIN,
	VOCABULARY_QUANTITY_MAX,
	VOCABULARY_QUANTITY_MIN,
} from "@/common/constants/vocabulary.const";
import { getKidWords } from "@/common/constants/word-bank.const";
import Loading from "@/components/Loading";
import type { SaveVocabularySetRequest } from "@/models/vocabulary.model";
import { zodResolver } from "@hookform/resolvers/zod";
import cn from "classnames";
import { Plus, Trash2, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	quantity: z.coerce
		.number()
		.int()
		.min(VOCABULARY_QUANTITY_MIN)
		.max(VOCABULARY_QUANTITY_MAX),
	gapTime: z.coerce
		.number()
		.min(VOCABULARY_GAP_TIME_MIN)
		.max(VOCABULARY_GAP_TIME_MAX),
	autoRead: z.boolean(),
	autoPlay: z.boolean(),
	words: z
		.array(z.object({ term: z.string().trim().min(1, "Nhập từ") }))
		.min(1, "Nhập ít nhất 1 từ"),
});

export type VocabularyFormValues = z.infer<typeof schema>;

interface VocabularySetFormProps {
	mode: "create" | "edit";
	initialValues: VocabularyFormValues;
	isSubmitting: boolean;
	onSubmit: (payload: SaveVocabularySetRequest) => void;
	onClose: () => void;
}

const toWordFields = (terms: string[]) => terms.map((term) => ({ term }));

const Switch: React.FC<{
	checked: boolean;
	onChange: (value: boolean) => void;
	label: string;
}> = ({ checked, onChange, label }) => (
	<button
		type="button"
		onClick={() => onChange(!checked)}
		className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
	>
		<span className="text-sm font-medium text-slate-700">{label}</span>
		<span
			className={cn(
				"relative h-6 w-11 rounded-full transition-colors",
				checked ? "bg-indigo-500" : "bg-slate-300",
			)}
		>
			<span
				className={cn(
					"absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
					checked && "translate-x-5",
				)}
			/>
		</span>
	</button>
);

const VocabularySetForm: React.FC<VocabularySetFormProps> = ({
	mode,
	initialValues,
	isSubmitting,
	onSubmit,
	onClose,
}) => {
	const {
		register,
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm<VocabularyFormValues>({
		resolver: zodResolver(schema),
		defaultValues: initialValues,
	});

	const { fields, append, remove, replace } = useFieldArray({
		control,
		name: "words",
	});

	// Auto-fill the word inputs from the kid word bank whenever the quantity
	// changes — but keep the initial values on first render so edit mode and the
	// first open aren't clobbered.
	const quantity = watch("quantity");
	const didMount = useRef(false);
	useEffect(() => {
		if (!didMount.current) {
			didMount.current = true;
			return;
		}
		const count = Number(quantity);
		if (!Number.isFinite(count) || count < 1) return;
		replace(toWordFields(getKidWords(count)));
	}, [quantity, replace]);

	const submit = handleSubmit((values) => {
		onSubmit({
			words: values.words.map((word) => word.term.trim()).filter(Boolean),
			gapTime: values.gapTime,
			autoRead: values.autoRead,
			autoPlay: values.autoPlay,
		});
	});

	const submitLabel = mode === "edit" ? "Lưu thay đổi" : "Nạp từ vựng";
	const wordsError = errors.words?.root?.message ?? errors.words?.message;

	return (
		<div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4">
			<div className="animate-fadeIn flex max-h-[92vh] w-full max-w-2xl flex-col overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl">
				<div className="mb-5 flex items-center justify-between">
					<h2 className="text-lg font-bold text-slate-800">
						{mode === "edit" ? "Sửa từ vựng" : "Nạp từ vựng"}
					</h2>
					<button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-50"
						aria-label="Đóng"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<form onSubmit={submit} className="flex flex-col gap-5">
					<div className="grid gap-5 md:grid-cols-2">
						{/* Cột cài đặt */}
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-1.5">
								<label
									htmlFor="quantity"
									className="text-sm font-medium text-slate-700"
								>
									Số lượng từ vựng
								</label>
								<input
									id="quantity"
									type="number"
									min={VOCABULARY_QUANTITY_MIN}
									max={VOCABULARY_QUANTITY_MAX}
									{...register("quantity")}
									className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
								/>
								{errors.quantity && (
									<span className="text-xs text-red-500">
										Nhập số từ {VOCABULARY_QUANTITY_MIN}–
										{VOCABULARY_QUANTITY_MAX}
									</span>
								)}
							</div>

							<div className="flex flex-col gap-1.5">
								<label
									htmlFor="gapTime"
									className="text-sm font-medium text-slate-700"
								>
									Thời gian chuyển từ (giây)
								</label>
								<input
									id="gapTime"
									type="number"
									step="0.5"
									min={VOCABULARY_GAP_TIME_MIN}
									max={VOCABULARY_GAP_TIME_MAX}
									{...register("gapTime")}
									className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
								/>
								{errors.gapTime && (
									<span className="text-xs text-red-500">
										Nhập từ {VOCABULARY_GAP_TIME_MIN}–{VOCABULARY_GAP_TIME_MAX}{" "}
										giây
									</span>
								)}
							</div>

							<Controller
								control={control}
								name="autoRead"
								render={({ field }) => (
									<Switch
										label="Tự động đọc"
										checked={field.value}
										onChange={field.onChange}
									/>
								)}
							/>

							<Controller
								control={control}
								name="autoPlay"
								render={({ field }) => (
									<Switch
										label="Tự động play"
										checked={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
						</div>

						{/* Cột danh sách từ */}
						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-slate-700">
									Danh sách từ ({fields.length})
								</span>
								<button
									type="button"
									onClick={() => append({ term: "" })}
									className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-indigo-500 transition-colors hover:bg-indigo-50"
								>
									<Plus className="h-3.5 w-3.5" />
									Thêm từ
								</button>
							</div>

							<div className="flex max-h-72 flex-col gap-2 overflow-y-auto rounded-xl border border-slate-200 p-2">
								{fields.map((field, index) => (
									<div key={field.id} className="flex flex-col gap-1">
										<div className="flex items-center gap-2">
											<span className="w-6 shrink-0 text-right text-xs text-slate-400">
												{index + 1}
											</span>
											<input
												type="text"
												placeholder="Nhập từ..."
												{...register(`words.${index}.term`)}
												className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
											/>
											<button
												type="button"
												onClick={() => remove(index)}
												className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
												aria-label={`Xóa từ ${index + 1}`}
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
										{errors.words?.[index]?.term && (
											<span className="pl-8 text-xs text-red-500">
												{errors.words[index]?.term?.message}
											</span>
										)}
									</div>
								))}
							</div>

							<span className="text-xs text-slate-400">
								Tự điền theo số lượng — bạn có thể sửa, thêm hoặc xóa từng từ.
							</span>
							{wordsError && (
								<span className="text-xs text-red-500">{wordsError}</span>
							)}
						</div>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isSubmitting ? "Đang lưu..." : submitLabel}
					</button>
				</form>
			</div>

			{isSubmitting && (
				<Loading
					overlay
					message={mode === "edit" ? "Đang lưu..." : "Đang nạp từ vựng..."}
				/>
			)}
		</div>
	);
};

export default VocabularySetForm;
