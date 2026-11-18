// Writable application database (users, sessions, claims).
//
// Kept separate from tryka.db, which is owned by tryka-scraper and opened
// read-only. result ids stored here refer to tryka.db `results.id`.
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

declare global {
  // eslint-disable-next-line no-var
  var __trykaAppDb: Database.Database | undefined;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  primary_athlete_key TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS login_tokens (
  token_hash TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS athlete_claims (
  athlete_key TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_athlete_claims_user ON athlete_claims(user_id);

CREATE TABLE IF NOT EXISTS result_claims (
  result_id INTEGER NOT NULL,
  member_index INTEGER NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('auto', 'manual')),
  created_at INTEGER NOT NULL,
  PRIMARY KEY (result_id, member_index)
);
CREATE INDEX IF NOT EXISTS idx_result_claims_user ON result_claims(user_id);

CREATE TABLE IF NOT EXISTS result_exclusions (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  result_id INTEGER NOT NULL,
  member_index INTEGER NOT NULL,
  PRIMARY KEY (user_id, result_id, member_index)
);
`;

export function appDbPath(): string {
  return process.env.APP_DB_PATH ?? path.resolve(process.cwd(), "data/app.db");
}

export function openAppDb(file: string): Database.Database {
  if (file !== ":memory:") mkdirSync(path.dirname(file), { recursive: true });
  const conn = new Database(file);
  conn.pragma("journal_mode = WAL");
  conn.pragma("foreign_keys = ON");
  conn.pragma("busy_timeout = 5000");
  conn.exec(SCHEMA);
  return conn;
}

/** Lazy singleton, cached on `global` for dev hot reload. */
export function getAppDb(): Database.Database {
  if (global.__trykaAppDb) return global.__trykaAppDb;
  const conn = openAppDb(appDbPath());
  global.__trykaAppDb = conn;
  return conn;
}

/** Test helper: swap in a fresh database (e.g. ":memory:"). */
export function setAppDbForTests(conn: Database.Database | undefined): void {
  global.__trykaAppDb = conn;
}

export const now = () => Date.now();
