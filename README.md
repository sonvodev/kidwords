# KidWords

A simple vocabulary-learning web app for young children. A parent **loads** a
list of words for the day, and the **learn** screen plays through them one by
one in a large font, reading each word aloud.

🔗 **Live demo:** https://sonvodev.github.io/kidwords/

Each parent signs up for a **local account**, and their word lists are stored
privately per account in the browser's **IndexedDB** — so different teaching
paths never mix. When a backend is ready, only the service layer changes — see
[Switching to an API](#switching-to-an-api).

> **Note on auth:** accounts are local to the browser (credentials are hashed
> with PBKDF2 and kept in IndexedDB). This separates profiles on a device; it is
> not real server-side security and does not sync across devices. A real backend
> is the path to that.

## Stack

Follows the conventions used across the other micro-frontend projects:

- **React 19** + **Rsbuild**
- **TanStack Router** (file-based routing) + **TanStack Query** (server state)
- **Tailwind CSS 4**
- **react-hook-form** + **zod** (form & validation)
- **sonner** (toasts), **lucide-react** (icons), **classnames**
- **Biome** (lint + format), **TypeScript** (strict)

## Commands

```bash
pnpm install
pnpm dev          # dev server (port 5000, or REACT_APP_PORT)
pnpm build        # production build
pnpm preview      # preview the production build
pnpm check        # biome lint & format
pnpm typecheck    # tsc --noEmit
```

## Project structure

```
src/
  common/
    constants/        # kid word bank, form defaults
    enum/             # AppRoute, QueryKey, LocalStorageKey, ApiEndPoints, MENU_ITEMS
  components/         # Sidebar, Loading, Skeleton, NoDataView, AuthShell
  contexts/           # AuthProvider, SidebarProvider (createContext + Provider + useXxx)
  hooks/queries/      # TanStack Query hooks
  layouts/MainLayout/ # header (menu + account) + <Outlet/>
  models/             # *.model.ts (user, vocabulary)
  pages/
    Login/ Register/  # local account auth
    Learn/            # "Học từ vựng"  — index (lazy) + content + Hook + Skeleton
    Vocabulary/       # "Nạp từ vựng"  — + Sections (form, history list)
    404Page/
  routes/             # file-based routes -> routeTree.gen.ts (do NOT edit by hand)
  services/           # ServiceBase + auth/vocabulary *.service.ts (singletons)
  utils/              # crypto, authUtils, authLoaders, plugins/{db,axios}
```

Key conventions (shared with the other projects): import via the `@/…` aliases;
use enums instead of literals for routes / query keys / storage keys; every
service extends `ServiceBase` and exports a default singleton; every page follows
the pattern `index.tsx (lazy + Suspense + Skeleton) → *-content.tsx → Hook/*.hook.ts`.

## Features

- **Accounts**: register / login (local, per-browser). Word lists are scoped to
  the signed-in account; the header shows the current user with a logout button.
  App routes are guarded and redirect to login when signed out.
- **Menu** (top-left icon) → `Học từ vựng` (Learn) and `Nạp từ vựng` (Load words).
- **Learn**: shows a single word centered in a large, non-bold font (no meaning
  shown). On entering the screen it counts down **3 → 2 → 1**, then auto-plays.
  Playback stops at the last word (pressing play again restarts from the top).
  Each word is read aloud via the Web Speech API. Controls (previous · play/pause
  · next · read again) are pinned to the bottom of the page so they don't distract
  from the word.
- **Load words**: history grouped by day, a search box, and a form to add a set.
  Each history entry can be **edited** (change the count / word list) or deleted.
  - The form is split into two columns: **settings** (quantity — default 10; gap
    time — default 1s; **loops — default 2**; auto-read; auto-play) and the
    **word list**, where each word has its own input. Changing the quantity
    auto-fills the list from a 3-year-old word bank, and every word can be edited,
    added, or removed by hand.
- **Learn playback** loops the whole list `loopCount` times (default 2) before
  auto-stopping; a "Vòng x/N" indicator shows the current loop.
- **Voice**: reads words aloud with the browser's Web Speech API by default.
  Optionally enable natural Vietnamese voices (Microsoft Edge read-aloud —
  `vi-VN-NamMinhNeural` male / `vi-VN-HoaiMyNeural` female, Northern) with a voice
  picker — see [`tts-proxy/`](tts-proxy/README.md). Free, no account/API key.
  Audio is cached per voice in IndexedDB and at the Worker edge.
- **Loading states**: skeletons while a page/data loads; a blocking overlay while
  saving; buttons disable while an action is in flight.

## Deployment

Hosted on **GitHub Pages** (free for public repositories).

- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds and deploys
  on every push to `main`. It derives the Pages base path from the repository name
  (`REACT_APP_BASE_PATH=/<repo>/`), so renaming the repo keeps working.
- [rsbuild.config.ts](rsbuild.config.ts) and [src/bootstrap.tsx](src/bootstrap.tsx)
  honor `REACT_APP_BASE_PATH` so the app runs under a subpath (`/kidwords/`).
- A `404.html` copy of `index.html` plus a `.nojekyll` marker are emitted during
  the deploy so client-side routes survive a hard refresh.

To deploy your own copy: push to a **public** repo, then set
**Settings → Pages → Source → GitHub Actions**.

## Switching to an API

Both `services/auth/auth.service.ts` and `services/vocabulary/vocabulary.service.ts`
already extend `ServiceBase` and return the same shapes the API will. When a
backend is available:

1. Set `REACT_APP_API_BASE_URL` in `.env`.
2. Add any auth interceptors to `utils/plugins/axios.ts` if needed.
3. Replace the IndexedDB reads/writes (`utils/plugins/db.ts`) with
   `super.getAsync/postAsync/deleteAsync` calls against `ApiEndPoints`. The query
   hooks, contexts, and UI stay unchanged.
