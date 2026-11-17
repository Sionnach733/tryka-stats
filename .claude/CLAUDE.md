# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`tryka-stats` is a Next.js webapp that lets athletes search and analyse their results from Tryka races. It reads the SQLite database produced by the sibling [`tryka-scraper`](../tryka-scraper) project. Athletes can log in (email magic link) and claim their results into a profile; that user data lives in a separate writable `app.db`.

## Commands

```bash
npm install
npm run dev                    # start dev server (http://localhost:3000)
npm test                       # run all tests (vitest)
npm run test:watch             # tests in watch mode
npx vitest __tests__/format.test.ts  # run a single test file
npm run typecheck              # tsc --noEmit
npm run build && npm run test:e2e   # Playwright e2e (e2e/*.spec.ts) against `next start`
npm run fixture:db             # regenerate fixtures/tryka-fixture.db(.gz) from the full DB
```

Tests require `tryka.db` to be accessible at the default path (`../tryka-scraper/tryka.db`) or via `TRYKA_DB_PATH`.

## CI & workflow

- `main` is protected by a ruleset: no direct pushes. Every change goes through a PR, and the `ci` check must pass. **Always branch and open a PR; never push to main.**
- `.github/workflows/ci.yml` runs typecheck, vitest, `next build` and Playwright against `fixtures/tryka-fixture.db.gz`, a committed subset of real events with original ids. `deploy.yml` runs only after CI succeeds on `main`.
- If a new test depends on specific data (result ids, names, divisions), add the event id to `FIXTURE_EVENT_IDS` in `scripts/build-fixture-db.mjs`, run `npm run fixture:db` and commit the new `.gz`. Regenerate it after schema changes too.

## Architecture

### Pages (server components)

- **`app/page.tsx`** — home page; reads `searchParams.q`, runs athlete search, renders `SearchBar` + `AthleteResultsTable` (one row per athlete)
- **`app/athletes/[slug]/page.tsx`** — public athlete profile (all results, best times); owner sees a Manage section (untick results, add misspelled ones, release names). Mutations are server actions in `app/athletes/actions.ts`
- **`app/login/page.tsx`** — email magic-link sign-in form
- **`app/results/[id]/page.tsx`** — detail page (~380 lines); fetches result data, computes KDE distributions, percentiles, and summary tiles server-side; renders three tabs (Workout Result, Splits, Stations)
- **`app/api/search/route.ts`** — GET athlete search (grouped hits) for `SearchBar`
- **`app/api/results-search/route.ts`** — GET per-result search (Compare, manual result claiming)
- **`app/api/auth/{request,verify,logout}`**, **`app/api/me`** — magic-link auth; `/api/me` lets client components (`AuthNav`) show login state without making cached pages dynamic

### Client components (`app/components/`)

- **`SearchBar.tsx`** — debounced input (250ms) with abort controller; calls `/api/search`; updates URL via `router.replace()`
- **`AthleteResultsTable.tsx`** — athlete search hits table; preserves search query in profile links
- **`AuthNav.tsx`**, **`ClaimButton.tsx`**, **`ManageResults.tsx`**, **`AddResultSearch.tsx`** — login state and claiming UI
- **`ResultTabs.tsx`** — tab switcher synced to URL search params
- **`StationCard.tsx`** — station data tile with interactive SVG KDE plot (hover/touch tooltips)
- **`StationsGrid.tsx`** — responsive grid layout for station cards

### Data layer (`lib/`)

- **`db.ts`** — singleton read-only `better-sqlite3` connection; registers custom `normalize_search()` SQL function for diacritical-insensitive, apostrophe-normalised matching; global caching for dev hot reload
- **`queries.ts`** — prepared statements: `searchResults`, `getResult`, `getResultsByIds`, `getRefinedSplits`, `getRawSplits`, `getStationFieldTimes`, …
- **`athletes.ts`** — athlete identity: groups result-members by `athleteKey(name)` (normalised, country suffix like `(IRL)` stripped) into an in-memory index rebuilt when `PRAGMA data_version` changes; `searchAthletes`
- **`appDb.ts`** — writable `app.db` (`APP_DB_PATH`, default `./data/app.db`): users, login_tokens, sessions, athlete_claims, result_claims, result_exclusions
- **`claims.ts`** — claim rules: one owner per name group and per (result_id, member_index); owners untick (exclude) results, add others manually; `syncUser` auto-attaches new results
- **`auth.ts`** — magic-link tokens and sessions (only SHA-256 hashes stored), `getCurrentUser()`
- **`format.ts`** — pure helpers: `parseMembers`, `displayMembers`, `displayGender`, `displayPace`, `parseTime`, `formatMmSs`, `computeKde`

## Sibling Project: tryka-scraper

The database is produced by [`tryka-scraper`](../tryka-scraper), a Python scraper. When working on database-related changes (schema, indexes, queries), reference the scraper's files:

@../tryka-scraper/CLAUDE.md
@../tryka-scraper/schema.sql

## Database

The app opens `tryka.db` **read-only** — it never writes. User data (accounts, claims) goes in the separate `app.db` (see `lib/appDb.ts`); in production set `APP_DB_PATH` outside the repo and back it up. `result_id`s in `app.db` refer to `tryka.db` `results.id`. Schema owned by `tryka-scraper` (see `../tryka-scraper/schema.sql`). Key tables:

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

Unit/integration tests live in `__tests__/` and use Vitest. E2E smoke tests live in `e2e/` and use Playwright (`playwright.config.ts` starts `next start`). Vitest files include:

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
