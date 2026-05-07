# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`tryka-stats` is a Next.js webapp that lets athletes search and analyse their results from Tryka obstacle-course races. It reads the SQLite database produced by the sibling [`tryka-scraper`](../tryka-scraper) project.

## Commands

```bash
npm install
npm run dev                    # start dev server (http://localhost:3000)
npm test                       # run all tests (vitest)
npm run test:watch             # tests in watch mode
npx vitest __tests__/format.test.ts  # run a single test file
```

Tests require `tryka.db` to be accessible at the default path (`../tryka-scraper/tryka.db`) or via `TRYKA_DB_PATH`.

## Architecture

### Pages (server components)

- **`app/page.tsx`** — home page; reads `searchParams.q`, runs search, renders `SearchBar` + `ResultsTable`
- **`app/results/[id]/page.tsx`** — detail page (~380 lines); fetches result data, computes KDE distributions, percentiles, and summary tiles server-side; renders three tabs (Workout Result, Splits, Stations)
- **`app/api/search/route.ts`** — GET endpoint for client-side debounced search

### Client components (`app/components/`)

- **`SearchBar.tsx`** — debounced input (250ms) with abort controller; calls `/api/search`; updates URL via `router.replace()`
- **`ResultsTable.tsx`** — paginated search hits table; preserves search query in detail page links
- **`ResultTabs.tsx`** — tab switcher synced to URL search params
- **`StationCard.tsx`** — station data tile with interactive SVG KDE plot (hover/touch tooltips)
- **`StationsGrid.tsx`** — responsive grid layout for station cards

### Data layer (`lib/`)

- **`db.ts`** — singleton read-only `better-sqlite3` connection; registers custom `normalize_search()` SQL function for diacritical-insensitive, apostrophe-normalised matching; global caching for dev hot reload
- **`queries.ts`** — 5 prepared statements: `searchAthletes`, `getResult`, `getRefinedSplits`, `getRawSplits`, `getStationFieldTimes`
- **`format.ts`** — pure helpers: `parseMembers`, `displayMembers`, `displayGender`, `displayPace`, `parseTime`, `formatMmSs`, `computeKde`

## Database

The app opens `tryka.db` **read-only** — it never writes. Schema owned by `tryka-scraper` (see `../tryka-scraper/schema.sql`). Key tables:

- `events` — race name, division
- `results` — per-athlete/team row; `members` is a JSON array of name strings
- `refined_splits` — per-segment time and place
- `raw_splits` — per-checkpoint time of day, elapsed, diff

## Key Patterns

- **Search normalisation**: custom SQLite function strips diacritics (é→e) and replaces apostrophes with spaces (O'Shea→O Shea) for fuzzy matching
- **Gender-scoped rankings**: percentiles and rankings are always scoped to the athlete's gender within the same event
- **Outlier filtering**: `buildStationData()` on the detail page filters impossibly fast times before KDE computation
- **Hardcoded station list**: 8 workout stations (SkiErg, KB Farmers Carry, etc.) are defined in `app/results/[id]/page.tsx` (`WORKOUT_STATIONS`), `lib/queries.ts` (IN clause), and test assertions — keep in sync
- **Query persistence**: search query is preserved via URL params through the entire navigation flow (home → detail → back)

## Testing

Tests live in `__tests__/` and use Vitest. Six test files:

- `format.test.ts` — unit tests for pure formatting helpers
- `queries.test.ts` — integration tests against real `tryka.db`
- `station-histogram.test.ts` — KDE computation edge cases
- `result-tabs.test.tsx` — tab component behaviour (mocks next/navigation)
- `search-persistence.test.tsx` — query param preservation in links
- `stations-tab.test.tsx` — station card rendering, rank styling, KDE plots

## Tech Stack

- Next.js 16 (App Router, server components)
- React 19
- TypeScript (strict mode, `@/*` path alias)
- Tailwind CSS 3 (dark mode supported throughout)
- better-sqlite3 (read-only, configured as `serverExternalPackages`)
- Vitest + Testing Library (jsdom environment)
