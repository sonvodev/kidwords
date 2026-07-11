import { QueryKey } from "@/common/enum";
import type { SaveVocabularySetRequest } from "@/models/vocabulary.model";
import vocabularyService from "@/services/vocabulary/vocabulary.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const invalidateKeys = [
	QueryKey.GetVocabularySetsKey,
	QueryKey.GetLatestVocabularySetKey,
];

export const useGetVocabularySets = () =>
	useQuery({
		queryKey: [QueryKey.GetVocabularySetsKey],
		queryFn: () => vocabularyService.getSets(),
	});

export const useGetLatestVocabularySet = () =>
	useQuery({
		queryKey: [QueryKey.GetLatestVocabularySetKey],
		queryFn: () => vocabularyService.getLatestSet(),
	});

const useInvalidateVocabulary = () => {
	const queryClient = useQueryClient();
	return () => {
		for (const key of invalidateKeys) {
			queryClient.invalidateQueries({ queryKey: [key] });
		}
	};
};

export const useCreateVocabularySet = () => {
	const invalidate = useInvalidateVocabulary();
	return useMutation({
		mutationFn: (payload: SaveVocabularySetRequest) =>
			vocabularyService.createSet(payload),
		onSuccess: invalidate,
	});
};

export const useUpdateVocabularySet = () => {
	const invalidate = useInvalidateVocabulary();
	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: SaveVocabularySetRequest;
		}) => vocabularyService.updateSet(id, payload),
		onSuccess: invalidate,
	});
};

export const useDeleteVocabularySet = () => {
	const invalidate = useInvalidateVocabulary();
	return useMutation({
		mutationFn: (id: string) => vocabularyService.deleteSet(id),
		onSuccess: invalidate,
	});
};
