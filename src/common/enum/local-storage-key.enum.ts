enum LocalStorageKey {
	/** Currently signed-in user id (session pointer; the data lives in IndexedDB). */
	SessionUserId = "kidwords_session_user_id",
	/** Word font-size multiplier chosen via the Learn screen slider. */
	LearnFontScale = "kidwords_learn_font_scale",
}

export default LocalStorageKey;
