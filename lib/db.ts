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

// Reuse a single connection across hot reloads in dev.
export const db: Database.Database = global.__trykaDb ?? initDb();
if (process.env.NODE_ENV !== "production") {
  global.__trykaDb = db;
}
