import { AppRoute } from "@/common/enum";
import LocalStorageKey from "@/common/enum/local-storage-key.enum";
import NoDataView from "@/components/NoDataView";
import { useLearn } from "@/pages/Learn/Hook/learn.hook";
import { LearnSkeleton } from "@/pages/Learn/Skeleton/learn-skeleton";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Pause, Play, Volume2 } from "lucide-react";
import type React from "react";
import { useState } from "react";

const FONT_SCALE_MIN = 0.4;
const FONT_SCALE_MAX = 2;
const FONT_SCALE_STEP = 0.05;

const readInitialFontScale = (): number => {
	const saved = Number(localStorage.getItem(LocalStorageKey.LearnFontScale));
	return Number.isFinite(saved) && saved > 0 ? saved : 1;
};

const LearnContent: React.FC = () => {
	const {
		isLoading,
		hasData,
		currentWord,
		currentIndex,
		total,
		currentLoop,
		loopCount,
		isPlaying,
		countdown,
		togglePlay,
		goNext,
		goPrev,
		readCurrent,
	} = useLearn();

	const [fontScale, setFontScale] = useState(readInitialFontScale);

	const handleFontScale = (value: number) => {
		setFontScale(value);
		localStorage.setItem(LocalStorageKey.LearnFontScale, String(value));
	};

	if (isLoading) return <LearnSkeleton />;

	if (!hasData || !currentWord) {
		return (
			<div className="flex flex-1 items-center justify-center px-4">
				<NoDataView
					title="Chưa có từ vựng để học"
					description="Hãy vào mục “Nạp từ vựng” để nạp danh sách từ cho hôm nay."
					action={
						<Link
							to={AppRoute.Vocabulary}
							className="mt-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-600"
						>
							Nạp từ vựng
						</Link>
					}
				/>
			</div>
		);
	}

	const isCountingDown = countdown !== null && countdown > 0;

	return (
		<div className="flex flex-1 flex-col">
			{/* Vertical font-size slider pinned to the right edge */}
			<div className="fixed top-1/2 right-1 z-10 flex -translate-y-1/2 flex-col items-center gap-2">
				<span className="text-lg font-bold text-slate-400">A</span>
				<input
					type="range"
					min={FONT_SCALE_MIN}
					max={FONT_SCALE_MAX}
					step={FONT_SCALE_STEP}
					value={fontScale}
					onChange={(event) => handleFontScale(Number(event.target.value))}
					aria-label="Cỡ chữ từ vựng"
					className="h-44 w-1.5 cursor-pointer accent-indigo-500"
					style={{ writingMode: "vertical-lr", direction: "rtl" }}
				/>
				<span className="text-xs font-bold text-slate-400">a</span>
			</div>

			{/* Word / countdown — takes the full space so the eye stays centered */}
			<div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-8">
				{isCountingDown ? (
					<div
						key={countdown}
						className="animate-fadeIn flex flex-col items-center gap-3"
					>
						<span className="text-sm font-medium text-slate-400">
							Bắt đầu sau
						</span>
						<span className="font-bold leading-none text-indigo-500 text-[clamp(6rem,30vw,16rem)]">
							{countdown}
						</span>
					</div>
				) : (
					<>
						<span className="text-sm font-medium text-slate-400">
							{currentIndex + 1} / {total}
							{loopCount > 1 && ` · Vòng ${currentLoop}/${loopCount}`}
						</span>
						<div
							key={currentWord.id}
							className="animate-fadeIn flex w-full justify-center text-center"
						>
							<h1
								className="wrap-break-word font-normal leading-none tracking-tight text-slate-800"
								style={{
									fontSize: `calc(clamp(9rem, 46vw, 26rem) * ${fontScale})`,
								}}
							>
								{currentWord.term}
							</h1>
						</div>
					</>
				)}
			</div>

			{/* Controls pinned to the bottom, away from the word */}
			<div className="sticky bottom-0 flex flex-col items-center gap-2 border-t border-slate-100 bg-white/85 px-4 py-4 backdrop-blur">
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={goPrev}
						className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
						aria-label="Từ trước"
					>
						<ChevronLeft className="h-6 w-6" />
					</button>

					<button
						type="button"
						onClick={togglePlay}
						className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-white transition-colors hover:bg-indigo-600"
						aria-label={isPlaying ? "Tạm dừng" : "Phát"}
					>
						{isPlaying ? (
							<Pause className="h-6 w-6" />
						) : (
							<Play className="h-6 w-6" />
						)}
					</button>

					<button
						type="button"
						onClick={goNext}
						className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
						aria-label="Từ tiếp theo"
					>
						<ChevronRight className="h-6 w-6" />
					</button>
				</div>

				<button
					type="button"
					onClick={readCurrent}
					className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
				>
					<Volume2 className="h-4 w-4" />
					Đọc lại
				</button>
			</div>
		</div>
	);
};

export default LearnContent;
