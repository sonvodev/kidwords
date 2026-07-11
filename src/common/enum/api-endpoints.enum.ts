/**
 * Reserved for the real backend. The service layer currently reads/writes
 * localStorage; when the API is ready, swap the localStorage calls in
 * `services/vocabulary/vocabulary.service.ts` for `ServiceBase` requests
 * against these endpoints.
 */
enum ApiEndPoints {
	GetVocabularySets = "/vocabulary-sets",
	GetVocabularySetById = "/vocabulary-sets/{id}",
	CreateVocabularySet = "/vocabulary-sets",
	UpdateVocabularySet = "/vocabulary-sets/{id}",
	DeleteVocabularySet = "/vocabulary-sets/{id}",
}

export default ApiEndPoints;
