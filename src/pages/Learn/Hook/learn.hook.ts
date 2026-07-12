import {
	DEFAULT_TTS_VOICE,
	TTS_VOICES,
	isKnownVoice,
} from "@/common/constants/tts-voices.const";
import LocalStorageKey from "@/common/enum/local-storage-key.enum";
import { useAuth } from "@/contexts/AuthProvider";
import { useGetLatestVocabularySet } from "@/hooks/queries/useVocabulary";
import ttsService from "@/services/tts/tts.service";
import { useCallback, useEffect, useState } from "react";

/** Seconds counted down (3 → 2 → 1) before auto-play starts. */
const COUNTDOWN_START = 3;

const readSavedVoice = (): string => {
	const saved = localStorage.getItem(LocalStorageKey.TtsVoice);
	return saved && isKnownVoice(saved) ? saved : DEFAULT_TTS_VOICE;
};

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
	const [voice, setVoiceState] = useState(readSavedVoice);

	const setVoice = useCallback((next: string) => {
		setVoiceState(next);
		localStorage.setItem(LocalStorageKey.TtsVoice, next);
	}, []);

	// Reset playback whenever a new set becomes the latest one. Start the 3-2-1
	// countdown first when auto-play is enabled.
	useEffect(() => {
		setCurrentIndex(0);
		setCurrentLoop(1);
		setIsPlaying(false);
		setCountdown(autoPlay ? COUNTDOWN_START : null);
	}, [latestSet?.id, autoPlay]);

	// Warm the TTS cache for the whole set so playback is instant.
	useEffect(() => {
		if (total === 0) return;
		ttsService.prefetch(
			words.map((word) => word.term),
			voice,
		);
	}, [latestSet?.id, voice, total]);

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

	// Read the current word aloud only while actually playing (never during the
	// countdown or on the initial passive load). When the countdown clears it
	// sets `isPlaying`, which fires this and reads the very first word.
	useEffect(() => {
		if (!autoRead || total === 0 || countdown !== null || !isPlaying) return;
		ttsService.speak(words[currentIndex]?.term ?? "", voice);
	}, [currentIndex, autoRead, total, countdown, voice, isPlaying]);

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
		ttsService.speak(words[currentIndex]?.term ?? "", voice);
	}, [words, currentIndex, total, voice]);

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
		voice,
		setVoice,
		canChooseVoice: ttsService.isRemoteEnabled() && TTS_VOICES.length > 1,
		togglePlay,
		goNext,
		goPrev,
		readCurrent,
	};
};
