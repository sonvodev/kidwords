import type { VocabularySet } from "@/models/vocabulary.model";
import type { VocabularyDayGroup } from "@/pages/Vocabulary/Hook/vocabulary.hook";
import { formatTime } from "@/utils/utils";
import { Clock, Pencil, Play, Trash2, Volume2 } from "lucide-react";
import type React from "react";

interface VocabularyHistoryListProps {
	groups: VocabularyDayGroup[];
	isDeleting: boolean;
	onEdit: (set: VocabularySet) => void;
	onDelete: (id: string) => void;
}

const VocabularyHistoryList: React.FC<VocabularyHistoryListProps> = ({
	groups,
	isDeleting,
	onEdit,
	onDelete,
}) => {
	return (
		<div className="flex flex-col gap-6">
			{groups.map((group) => (
				<section key={group.dayKey} className="flex flex-col gap-3">
					<h3 className="text-sm font-semibold capitalize text-slate-500">
						{group.label}
					</h3>

					{group.sets.map((set) => (
						<article
							key={set.id}
							className="rounded-2xl border border-slate-200 p-4 transition-shadow hover:shadow-sm"
						>
							<div className="flex items-start justify-between gap-3">
								<div className="flex flex-col gap-2">
									<span className="text-base font-semibold text-slate-800">
										{set.quantity} từ vựng
									</span>
									<div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
										<span className="inline-flex items-center gap-1">
											<Clock className="h-3.5 w-3.5" />
											{formatTime(set.createdAt)} · {set.gapTime}s/từ
										</span>
										{set.autoRead && (
											<span className="inline-flex items-center gap-1 text-indigo-500">
												<Volume2 className="h-3.5 w-3.5" />
												Tự động đọc
											</span>
										)}
										{set.autoPlay && (
											<span className="inline-flex items-center gap-1 text-indigo-500">
												<Play className="h-3.5 w-3.5" />
												Tự động play
											</span>
										)}
									</div>
									<div className="flex flex-wrap gap-1.5">
										{set.words.slice(0, 8).map((word) => (
											<span
												key={word.id}
												className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600"
											>
												{word.term}
											</span>
										))}
										{set.words.length > 8 && (
											<span className="rounded-lg px-2 py-1 text-xs text-slate-400">
												+{set.words.length - 8}
											</span>
										)}
									</div>
								</div>

								<div className="flex items-center">
									<button
										type="button"
										onClick={() => onEdit(set)}
										className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-500"
										aria-label="Sửa số lượng / danh sách từ vựng"
									>
										<Pencil className="h-4 w-4" />
									</button>
									<button
										type="button"
										onClick={() => onDelete(set.id)}
										disabled={isDeleting}
										className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
										aria-label="Xóa danh sách từ vựng"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							</div>
						</article>
					))}
				</section>
			))}
		</div>
	);
};

export default VocabularyHistoryList;
