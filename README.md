# tryka-stats

A Next.js webapp that lets athletes search and analyse their results from [Tryka](https://tryka.r.mikatiming.com/) races. It reads the SQLite database produced by [`tryka-scraper`](../tryka-scraper) and provides:

- **Athlete search** — search by name (partial or full). Matches solo athletes and team members in doubles/relay events.
- **Results overview** — lists every event an athlete participated in with race name, division, age group, gender, overall rank, and finish time.
- **Detailed splits** — drill into any result to see refined splits (per-station times and places) and raw splits (time of day, elapsed, diff).

## Tech stack

- **Next.js 14** (App Router, server components)
- **better-sqlite3** — read-only access to the scraper's SQLite database
- **Tailwind CSS** — styling
- **Vitest** — unit tests

## Setup

```bash
npm install
```

The app reads `tryka.db` from the sibling `tryka-scraper` directory by default. To use a different database file, copy `.env.local.example` to `.env.local` and set `TRYKA_DB_PATH`.

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and search by athlete name (e.g. `Bent` or `Sinead Bent`). Click a row to see the full split breakdown.

## Test

```bash
npm test              # single run
npm run test:watch    # watch mode
```
