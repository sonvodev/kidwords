import { QueryKey } from "@/common/enum";
import { useAuth } from "@/contexts/AuthProvider";
import type { SaveVocabularySetRequest } from "@/models/vocabulary.model";
import vocabularyService from "@/services/vocabulary/vocabulary.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const invalidateKeys = [
	QueryKey.GetVocabularySetsKey,
	QueryKey.GetLatestVocabularySetKey,
];

export const useGetVocabularySets = () => {
	const { user } = useAuth();
	return useQuery({
		queryKey: [QueryKey.GetVocabularySetsKey, user?.id],
		queryFn: () => vocabularyService.getSets(user!.id),
		enabled: !!user,
	});
};

export const useGetLatestVocabularySet = () => {
	const { user } = useAuth();
	return useQuery({
		queryKey: [QueryKey.GetLatestVocabularySetKey, user?.id],
		queryFn: () => vocabularyService.getLatestSet(user!.id),
		enabled: !!user,
	});
};

const useInvalidateVocabulary = () => {
	const queryClient = useQueryClient();
	return () => {
		for (const key of invalidateKeys) {
			queryClient.invalidateQueries({ queryKey: [key] });
		}
	};
};

export const useCreateVocabularySet = () => {
	const { user } = useAuth();
	const invalidate = useInvalidateVocabulary();
	return useMutation({
		mutationFn: (payload: SaveVocabularySetRequest) =>
			vocabularyService.createSet(user!.id, payload),
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
