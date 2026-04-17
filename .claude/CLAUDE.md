# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

`tryka-stats` is a Next.js webapp that lets athletes search and analyse their results from Tryka obstacle-course races. It reads the SQLite database produced by the sibling [`tryka-scraper`](../tryka-scraper) project.

## Architecture

- **`app/page.tsx`** — home page; server component that reads `searchParams.q`, runs the search query, renders `SearchBar` + `ResultsTable`
- **`app/results/[id]/page.tsx`** — detail page; loads result header, refined splits, and raw splits
- **`app/components/SearchBar.tsx`** — client component; controlled `<input>` inside a GET form (`/?q=...`)
- **`app/components/ResultsTable.tsx`** — server component; renders the search hits table
- **`lib/db.ts`** — singleton read-only `better-sqlite3` connection; path from `TRYKA_DB_PATH` env var (defaults to `../tryka-scraper/tryka.db`)
- **`lib/queries.ts`** — prepared statements: `searchAthletes`, `getResult`, `getRefinedSplits`, `getRawSplits`
- **`lib/format.ts`** — pure helpers: `parseMembers` (JSON array), `displayMembers`, `displayGender`

## Database

The app opens `tryka.db` **read-only** — it never writes. The schema is owned by `tryka-scraper` (see `../tryka-scraper/schema.sql`). Key tables:

- `events` — race name, division
- `results` — per-athlete/team row; `members` is a JSON array of name strings
- `refined_splits` — per-segment time and place
- `raw_splits` — per-checkpoint time of day, elapsed, diff

## Running

```bash
npm install
npm run dev          # start dev server (http://localhost:3000)
npm test             # run unit tests (vitest)
npm run test:watch   # tests in watch mode
```

## Testing

Tests live in `__tests__/` and use Vitest. Two test files:

- `format.test.ts` — unit tests for the pure formatting helpers
- `queries.test.ts` — integration tests that query the real `tryka.db`

Tests require `tryka.db` to be accessible at the default path (or via `TRYKA_DB_PATH`).

## Tech Stack

- Next.js 14 (App Router, server components)
- TypeScript
- Tailwind CSS
- better-sqlite3 (read-only)
- Vitest
