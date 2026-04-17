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

// Reuse a single connection across hot reloads in dev.
export const db: Database.Database = global.__trykaDb ?? open();
if (process.env.NODE_ENV !== "production") {
  global.__trykaDb = db;
}
