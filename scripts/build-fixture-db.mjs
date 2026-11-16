#!/usr/bin/env node
// Builds a small fixture copy of tryka.db for CI (unit + e2e tests).
//
// All `events` rows are kept (so race listings and division lists are intact),
// but results/splits are copied only for the events in FIXTURE_EVENT_IDS.
// Whole events are copied with their original ids, because rankings,
// percentiles and KDE plots are computed per event and gender, and the tests
// reference specific result ids.
//
// Usage: TRYKA_DB_PATH=/path/to/tryka.db npm run fixture:db
import Database from "better-sqlite3";
import { existsSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = process.env.TRYKA_DB_PATH ?? path.resolve(root, "../tryka-scraper/tryka.db");
const OUT = path.join(root, "fixtures/tryka-fixture.db");

// Event ids whose results are copied. Keep in sync with tests that depend on data.
const FIXTURE_EVENT_IDS = [
  1, // Autumn 1 OPEN 500 — result 15079 (queries.test)
  2, // Autumn 1 OPEN 800 — Breen / Ciarán / O'Shea / Luttrell names
  3, // Autumn 1 DOUBLES 500 — Series 1 10-year age groups ("30 - 39")
  341, // Lisbon 6 OPEN 800 — Breeda Ohora (sole athlete in age group)
  23, // Spring 3 DOUBLES 800 — results 30080, 30808 (367 competitors)
  359, // Series 2 Race 1 DOUBLES 500 — current 5-year age groups ("30 - 34")
  // Pro Doubles under both spellings (hall-of-fame alias pooling, record 21032)
  5, 18, 26, 151, 288, 339, 350,
  // TRYKA PRO
  6, 19,
  // TRYKA RELAY (implausibly-fast filtering)
  11, 16, 24, 158, 332, 344, 361,
  // TRYKA JNR 8-9 (no minimum time for juniors)
  28, 159, 333, 362,
  // TRYKA CLAN FITNESS (null age groups)
  17,
];

if (!existsSync(SRC)) {
  console.error(`Source DB not found: ${SRC}`);
  process.exit(1);
}
rmSync(OUT, { force: true });

const out = new Database(OUT);
const src = new Database(SRC, { readonly: true });

for (const { sql } of src
  .prepare(
    "SELECT sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY type = 'index'",
  )
  .all()) {
  out.exec(sql);
}
src.close();

out.exec(`ATTACH DATABASE '${SRC.replaceAll("'", "''")}' AS src`);
const ids = FIXTURE_EVENT_IDS.join(",");
out.transaction(() => {
  out.exec(`
    INSERT INTO main.events SELECT * FROM src.events;
    INSERT INTO main.results SELECT * FROM src.results WHERE event_id IN (${ids});
    INSERT INTO main.raw_splits SELECT * FROM src.raw_splits
      WHERE result_id IN (SELECT id FROM main.results);
    INSERT INTO main.refined_splits SELECT * FROM src.refined_splits
      WHERE result_id IN (SELECT id FROM main.results);
  `);
})();
out.exec("DETACH DATABASE src");
const { n } = out.prepare("SELECT COUNT(*) AS n FROM results").get();
out.exec("VACUUM");
out.close();

writeFileSync(`${OUT}.gz`, gzipSync(readFileSync(OUT), { level: 9 }));
const mb = (p) => (statSync(p).size / 1024 / 1024).toFixed(1);
console.log(`Wrote ${OUT} (${n} results, ${mb(OUT)}MB; gzipped ${mb(`${OUT}.gz`)}MB)`);
