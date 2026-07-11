# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2026-07-11

### Changed
- **TTS provider switched to Google Cloud Text-to-Speech** for natural voices
  with a **male** option. Voices: `vi-VN-Wavenet-D`/`-A` and `vi-VN-Standard-D`/`-A`
  (Northern), default male WaveNet. The voice picker returns; the Worker holds the
  Google API key and edge-caches clips. Still falls back to the browser voice when
  the proxy is unset or errors.

## [1.4.1] - 2026-07-11

### Changed
- **TTS provider switched to Google Translate voice** (Northern Vietnamese, free,
  no account/key) after the Edge read-aloud endpoint returned 404. Single voice,
  so the voice picker is hidden; playback still caches per clip and falls back to
  the browser voice when the proxy is unset or errors.

## [1.4.0] - 2026-07-11

### Changed
- **TTS provider switched to Microsoft Edge read-aloud** (free, no account/API
  key) after FPT.AI's free tier became unusable. Voices are now
  `vi-VN-NamMinhNeural` (male) and `vi-VN-HoaiMyNeural` (female), both Northern.
  The Worker speaks via the Edge websocket endpoint and edge-caches clips; the
  app validates any stale saved voice id and still falls back to the browser
  voice when the proxy is unset or errors.

## [1.3.1] - 2026-07-11

### Fixed
- **FPT free-tier rate limiting**: the app now funnels TTS requests through a
  single spaced-out queue (no more parallel prefetch bursts) and shares identical
  in-flight requests. The Worker retries FPT's rate limit with backoff and caches
  clips at the Cloudflare edge.

## [1.3.0] - 2026-07-11

### Added
- **Natural Vietnamese voice (FPT.AI)**: optional integration via a Cloudflare
  Worker proxy (`tts-proxy/`). When configured (repo variable `TTS_PROXY_URL`),
  the Learn screen reads words with FPT voices and shows a **voice picker**
  (male/female · Bắc/Trung/Nam, default `leminh` = male Northern). Audio is cached
  in IndexedDB (fetched once per voice) and prefetched per set. Falls back to the
  browser Web Speech API when the proxy is not configured or on error.

## [1.2.0] - 2026-07-11

### Added
- **Font-size slider** on the Learn screen: a vertical slider pinned to the right
  edge scales the word font up/down. The chosen size is saved (localStorage) and
  restored on the next visit.

## [1.1.0] - 2026-07-11

### Added
- **Local accounts**: register / login pages. Word lists are scoped per account
  so different teaching paths never mix. The header shows the signed-in user with
  a logout button, and app routes redirect to login when signed out.
- **Playback loop count** on the load form (default `2`): the Learn screen loops
  the whole list N times before auto-stopping, with a "Vòng x/N" indicator.

### Changed
- **Storage migrated from `localStorage` to IndexedDB** (via `idb`), with data
  scoped per user. Passwords are hashed with PBKDF2 (local-only guard, not
  server-side security; no cross-device sync).

## [1.0.0] - 2026-07-11

### Added
- Initial KidWords vocabulary app: React 19 + Rsbuild, TanStack Router
  (file-based) + TanStack Query, Tailwind CSS 4, Biome, strict TypeScript.
- **Learn** screen: shows one word centered in a large, non-bold font; a 3-2-1
  countdown before auto-play; reads each word aloud (Web Speech API); stops at the
  end of the list; controls (previous · play/pause · next · read again) pinned to
  the bottom of the page.
- **Load words** screen: history grouped by day, search box, and a two-column
  form (settings + per-word inputs). Choosing a quantity auto-fills the list from
  a 3-year-old word bank; each word can be edited, added, or removed by hand.
  History entries can be edited or deleted.
- Loading states: skeletons on navigation/data load; a blocking overlay while
  saving; buttons disabled while an action is in flight.
- **GitHub Pages deployment**: CI workflow that builds and deploys on every push
  to `main`, derives the base path from the repository name, and emits a
  `404.html` SPA fallback + `.nojekyll` marker.

[1.5.0]: https://github.com/sonvodev/kidwords/releases/tag/v1.5.0
[1.4.1]: https://github.com/sonvodev/kidwords/releases/tag/v1.4.1
[1.4.0]: https://github.com/sonvodev/kidwords/releases/tag/v1.4.0
[1.3.1]: https://github.com/sonvodev/kidwords/releases/tag/v1.3.1
[1.3.0]: https://github.com/sonvodev/kidwords/releases/tag/v1.3.0
[1.2.0]: https://github.com/sonvodev/kidwords/releases/tag/v1.2.0
[1.1.0]: https://github.com/sonvodev/kidwords/releases/tag/v1.1.0
[1.0.0]: https://github.com/sonvodev/kidwords/releases/tag/v1.0.0
