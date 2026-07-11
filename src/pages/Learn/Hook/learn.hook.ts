import { useAuth } from "@/contexts/AuthProvider";
import { useGetLatestVocabularySet } from "@/hooks/queries/useVocabulary";
import { speak } from "@/utils/utils";
import { useCallback, useEffect, useState } from "react";

/** Seconds counted down (3 → 2 → 1) before auto-play starts. */
const COUNTDOWN_START = 3;

export const useLearn = () => {
	const { user, isInitializing } = useAuth();
	const { data: latestSet, isLoading: isQueryLoading } =
		useGetLatestVocabularySet();

	const words = latestSet?.words ?? [];
	const total = words.length;
	const autoRead = latestSet?.autoRead ?? false;
	const autoPlay = latestSet?.autoPlay ?? false;
	const gapTime = latestSet?.gapTime ?? 1;
	const loopCount = latestSet?.loopCount ?? 1;

	const [currentIndex, setCurrentIndex] = useState(0);
	const [currentLoop, setCurrentLoop] = useState(1);
	const [isPlaying, setIsPlaying] = useState(false);
	const [countdown, setCountdown] = useState<number | null>(null);

	// Reset playback whenever a new set becomes the latest one. Start the 3-2-1
	// countdown first when auto-play is enabled.
	useEffect(() => {
		setCurrentIndex(0);
		setCurrentLoop(1);
		setIsPlaying(false);
		setCountdown(autoPlay ? COUNTDOWN_START : null);
	}, [latestSet?.id, autoPlay]);

	// Tick the countdown, then kick off auto-play when it reaches zero.
	useEffect(() => {
		if (countdown === null) return;
		if (countdown <= 0) {
			setCountdown(null);
			setIsPlaying(true);
			return;
		}
		const timer = setTimeout(
			() => setCountdown((value) => (value === null ? null : value - 1)),
			1000,
		);
		return () => clearTimeout(timer);
	}, [countdown]);

	// Auto-advance after `gapTime`. At the end of the list, loop back until
	// `loopCount` loops have played, then stop on the last word.
	useEffect(() => {
		if (!isPlaying || total === 0) return;
		const isLastWord = currentIndex >= total - 1;
		const timer = setTimeout(() => {
			if (!isLastWord) {
				setCurrentIndex(currentIndex + 1);
				return;
			}
			if (currentLoop >= loopCount) {
				setIsPlaying(false);
				return;
			}
			setCurrentLoop(currentLoop + 1);
			setCurrentIndex(0);
		}, gapTime * 1000);
		return () => clearTimeout(timer);
	}, [isPlaying, currentIndex, currentLoop, gapTime, total, loopCount]);

	// Read the current word aloud when auto-read is enabled (never during the
	// countdown). Firing on `countdown` clearing also reads the very first word.
	useEffect(() => {
		if (!autoRead || total === 0 || countdown !== null) return;
		speak(words[currentIndex]?.term ?? "");
	}, [currentIndex, autoRead, total, countdown]);

	const isFinished = currentIndex >= total - 1 && currentLoop >= loopCount;

	const togglePlay = useCallback(() => {
		setCountdown(null);
		// Restart from the beginning when replaying after all loops finished.
		if (!isPlaying && isFinished) {
			setCurrentIndex(0);
			setCurrentLoop(1);
		}
		setIsPlaying((prev) => !prev);
	}, [isPlaying, isFinished]);

	const goNext = useCallback(() => {
		if (total === 0) return;
		setCountdown(null);
		setCurrentIndex((index) => (index + 1) % total);
	}, [total]);

	const goPrev = useCallback(() => {
		if (total === 0) return;
		setCountdown(null);
		setCurrentIndex((index) => (index - 1 + total) % total);
	}, [total]);

	const readCurrent = useCallback(() => {
		if (total === 0) return;
		speak(words[currentIndex]?.term ?? "");
	}, [words, currentIndex, total]);

	return {
		isLoading: isInitializing || !user || isQueryLoading,
		hasData: total > 0,
		currentWord: words[currentIndex] ?? null,
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
	};
};
