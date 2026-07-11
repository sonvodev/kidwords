import { VOCABULARY_FORM_DEFAULTS } from "@/common/constants/vocabulary.const";
import { getKidWords } from "@/common/constants/word-bank.const";
import {
	useCreateVocabularySet,
	useDeleteVocabularySet,
	useGetVocabularySets,
	useUpdateVocabularySet,
} from "@/hooks/queries/useVocabulary";
import type {
	SaveVocabularySetRequest,
	VocabularySet,
} from "@/models/vocabulary.model";
import type { VocabularyFormValues } from "@/pages/Vocabulary/Sections/vocabulary-set-form";
import { formatDate, toDayKey } from "@/utils/utils";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export interface VocabularyDayGroup {
	dayKey: string;
	label: string;
	sets: VocabularySet[];
}

interface FormConfig {
	mode: "create" | "edit";
	editId: string | null;
	initialValues: VocabularyFormValues;
}

const buildCreateValues = (): VocabularyFormValues => ({
	quantity: VOCABULARY_FORM_DEFAULTS.quantity,
	gapTime: VOCABULARY_FORM_DEFAULTS.gapTime,
	autoRead: VOCABULARY_FORM_DEFAULTS.autoRead,
	autoPlay: VOCABULARY_FORM_DEFAULTS.autoPlay,
	words: getKidWords(VOCABULARY_FORM_DEFAULTS.quantity).map((term) => ({
		term,
	})),
});

const buildEditValues = (set: VocabularySet): VocabularyFormValues => ({
	quantity: set.quantity,
	gapTime: set.gapTime,
	autoRead: set.autoRead,
	autoPlay: set.autoPlay,
	words: set.words.map((word) => ({ term: word.term })),
});

export const useVocabulary = () => {
	const [search, setSearch] = useState("");
	const [formConfig, setFormConfig] = useState<FormConfig | null>(null);

	const { data: sets, isLoading } = useGetVocabularySets();
	const { mutateAsync: createSet, isPending: isCreating } =
		useCreateVocabularySet();
	const { mutateAsync: updateSet, isPending: isUpdating } =
		useUpdateVocabularySet();
	const { mutateAsync: deleteSet, isPending: isDeleting } =
		useDeleteVocabularySet();

	const filteredGroups = useMemo<VocabularyDayGroup[]>(() => {
		if (!sets) return [];
		const keyword = search.trim().toLowerCase();

		const matched = keyword
			? sets.filter(
					(set) =>
						formatDate(set.createdAt).toLowerCase().includes(keyword) ||
						set.words.some((word) => word.term.toLowerCase().includes(keyword)),
				)
			: sets;

		const groups = new Map<string, VocabularyDayGroup>();
		for (const set of matched) {
			const dayKey = toDayKey(set.createdAt);
			const group = groups.get(dayKey);
			if (group) {
				group.sets.push(set);
			} else {
				groups.set(dayKey, {
					dayKey,
					label: formatDate(set.createdAt),
					sets: [set],
				});
			}
		}
		return [...groups.values()];
	}, [sets, search]);

	const openCreate = () =>
		setFormConfig({
			mode: "create",
			editId: null,
			initialValues: buildCreateValues(),
		});

	const openEdit = (set: VocabularySet) =>
		setFormConfig({
			mode: "edit",
			editId: set.id,
			initialValues: buildEditValues(set),
		});

	const closeForm = () => setFormConfig(null);

	const handleSubmit = async (payload: SaveVocabularySetRequest) => {
		try {
			if (formConfig?.mode === "edit" && formConfig.editId) {
				await updateSet({ id: formConfig.editId, payload });
				toast.success("Đã cập nhật danh sách từ vựng");
			} else {
				await createSet(payload);
				toast.success(`Đã nạp ${payload.words.length} từ vựng mới`);
			}
			closeForm();
		} catch {
			toast.error("Lưu thất bại, vui lòng thử lại");
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteSet(id);
			toast.success("Đã xóa danh sách từ vựng");
		} catch {
			toast.error("Xóa thất bại, vui lòng thử lại");
		}
	};

	return {
		search,
		setSearch,
		formConfig,
		openCreate,
		openEdit,
		closeForm,
		isLoading,
		isSubmitting: isCreating || isUpdating,
		isDeleting,
		filteredGroups,
		hasData: (sets?.length ?? 0) > 0,
		handleSubmit,
		handleDelete,
	};
};
