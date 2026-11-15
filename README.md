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
npm run typecheck     # tsc --noEmit
npm run build && npm run test:e2e   # Playwright e2e against a production build
```

### Fixture database (CI)

CI doesn't have the full `tryka.db`. It uses `fixtures/tryka-fixture.db.gz`, a subset of real events with the original ids (see `FIXTURE_EVENT_IDS` in `scripts/build-fixture-db.mjs`). To run locally against the fixture:

```bash
gunzip -kf fixtures/tryka-fixture.db.gz
TRYKA_DB_PATH=$PWD/fixtures/tryka-fixture.db npm test
```

Run `npm run fixture:db` to regenerate it after the schema changes or when a test needs data that isn't in the fixture.

## Contributing

`main` is protected: open a PR, and the `CI` check (typecheck, vitest, build, Playwright e2e) must pass before merge. Deploys run automatically once CI passes on `main`.
