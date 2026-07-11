/// <reference types="@rsbuild/core/types" />

declare namespace NodeJS {
	interface ProcessEnv {
		REACT_APP_ENVIRONMENT: string;
		REACT_APP_PORT: string;
		REACT_APP_API_BASE_URL: string;
		REACT_APP_API_TIMEOUT: string;
		/** Base path for hosting under a subpath (e.g. GitHub Pages "/repo/"). */
		REACT_APP_BASE_PATH: string;
		/** Cloudflare Worker proxy URL for FPT.AI TTS. Empty → browser voice. */
		REACT_APP_TTS_PROXY_URL: string;
	}
}
