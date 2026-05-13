import Database from "better-sqlite3";

const DEFAULT_DB_PATH = "/Users/cuddy/mydev/tryka-scraper/tryka.db";

declare global {
  // eslint-disable-next-line no-var
  var __trykaDb: Database.Database | undefined;
}

function open(): Database.Database {
  const path = process.env.TRYKA_DB_PATH ?? DEFAULT_DB_PATH;
  return new Database(path, { readonly: true, fileMustExist: true });
}

function normalizeSearch(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[''`]/g, " ")         // replace apostrophes with space
    .replace(/\s+/g, " ");          // collapse whitespace
}

function initDb(): Database.Database {
  const conn = open();
  conn.function("normalize_search", normalizeSearch);
  return conn;
}

// Lazy singleton — the database is only opened on first call, not at import
// time. This prevents build-time errors during Next.js page data collection.
export function getDb(): Database.Database {
  if (global.__trykaDb) return global.__trykaDb;
  const conn = initDb();
  global.__trykaDb = conn;
  return conn;
}
