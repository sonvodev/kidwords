# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.2.0]: https://github.com/sonvodev/kidwords/releases/tag/v1.2.0
[1.1.0]: https://github.com/sonvodev/kidwords/releases/tag/v1.1.0
[1.0.0]: https://github.com/sonvodev/kidwords/releases/tag/v1.0.0
