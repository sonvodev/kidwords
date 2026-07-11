import NoDataView from "@/components/NoDataView";
import { useVocabulary } from "@/pages/Vocabulary/Hook/vocabulary.hook";
import VocabularyHistoryList from "@/pages/Vocabulary/Sections/vocabulary-history-list";
import VocabularySetForm from "@/pages/Vocabulary/Sections/vocabulary-set-form";
import { VocabularySkeleton } from "@/pages/Vocabulary/Skeleton/vocabulary-skeleton";
import { Plus, Search } from "lucide-react";
import type React from "react";

const VocabularyContent: React.FC = () => {
	const {
		search,
		setSearch,
		formConfig,
		openCreate,
		openEdit,
		closeForm,
		isLoading,
		isSubmitting,
		isDeleting,
		filteredGroups,
		hasData,
		handleSubmit,
		handleDelete,
	} = useVocabulary();

	if (isLoading) return <VocabularySkeleton />;

	const renderHistory = () => {
		if (!hasData) {
			return (
				<NoDataView
					title="Chưa có từ vựng nào"
					description="Nhấn “Nạp từ vựng” để tạo danh sách từ vựng đầu tiên cho hôm nay."
				/>
			);
		}
		if (filteredGroups.length === 0) {
			return (
				<NoDataView
					title="Không tìm thấy kết quả"
					description="Thử từ khóa khác nhé."
				/>
			);
		}
		return (
			<VocabularyHistoryList
				groups={filteredGroups}
				isDeleting={isDeleting}
				onEdit={openEdit}
				onDelete={handleDelete}
			/>
		);
	};

	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-6">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-bold text-slate-800">Nạp từ vựng</h1>
				<button
					type="button"
					onClick={openCreate}
					className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-600"
				>
					<Plus className="h-4 w-4" />
					Nạp từ vựng
				</button>
			</div>

			<div className="relative">
				<Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
				<input
					type="text"
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					placeholder="Tìm theo ngày hoặc từ vựng..."
					className="w-full rounded-xl border border-slate-200 py-3 pr-4 pl-10 text-sm outline-none focus:border-indigo-400"
				/>
			</div>

			{renderHistory()}

			{formConfig && (
				<VocabularySetForm
					mode={formConfig.mode}
					initialValues={formConfig.initialValues}
					isSubmitting={isSubmitting}
					onSubmit={handleSubmit}
					onClose={closeForm}
				/>
			)}
		</div>
	);
};

export default VocabularyContent;
