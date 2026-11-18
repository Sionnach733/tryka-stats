// Passwordless email (magic link) authentication backed by lib/appDb.ts.
// Only SHA-256 hashes of tokens are stored, so a leaked app.db can't be used
// to sign in.
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getAppDb, now } from "./appDb";

export const SESSION_COOKIE = "tryka_session";
export const LOGIN_TOKEN_TTL_MS = 15 * 60 * 1000;
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type User = { id: number; email: string; primaryAthleteKey: string | null };

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
const newToken = () => randomBytes(32).toString("base64url");

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Create a single-use login token for `email`; returns the raw token. */
export function createLoginToken(email: string): string {
  const token = newToken();
  getAppDb()
    .prepare("INSERT INTO login_tokens (token_hash, email, expires_at) VALUES (?, ?, ?)")
    .run(sha256(token), normalizeEmail(email), now() + LOGIN_TOKEN_TTL_MS);
  return token;
}

/**
 * Consume a login token: marks it used, upserts the user and creates a
 * session. Returns the raw session token, or null if the token is invalid,
 * expired or already used.
 */
export function consumeLoginToken(token: string): { sessionToken: string; userId: number } | null {
  const db = getAppDb();
  const hash = sha256(token);
  return db.transaction(() => {
    const ts = now();
    const row = db
      .prepare<[string], { email: string; expires_at: number; used_at: number | null }>(
        "SELECT email, expires_at, used_at FROM login_tokens WHERE token_hash = ?",
      )
      .get(hash);
    if (!row || row.used_at !== null || row.expires_at < ts) return null;
    db.prepare("UPDATE login_tokens SET used_at = ? WHERE token_hash = ?").run(ts, hash);

    db.prepare("INSERT OR IGNORE INTO users (email, created_at) VALUES (?, ?)").run(row.email, ts);
    const user = db
      .prepare<[string], { id: number }>("SELECT id FROM users WHERE email = ?")
      .get(row.email)!;

    const sessionToken = newToken();
    db.prepare(
      "INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
    ).run(sha256(sessionToken), user.id, ts + SESSION_TTL_MS, ts);

    // Housekeeping: drop expired tokens and sessions.
    db.prepare("DELETE FROM login_tokens WHERE expires_at < ?").run(ts);
    db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(ts);

    return { sessionToken, userId: user.id };
  })();
}

export function getUserBySessionToken(token: string | undefined): User | null {
  if (!token) return null;
  const row = getAppDb()
    .prepare<[string, number], { id: number; email: string; primary_athlete_key: string | null }>(
      `SELECT u.id, u.email, u.primary_athlete_key
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .get(sha256(token), now());
  return row ? { id: row.id, email: row.email, primaryAthleteKey: row.primary_athlete_key } : null;
}

export function deleteSession(token: string | undefined): void {
  if (!token) return;
  getAppDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(token));
}

/** The signed-in user for the current request (server components, actions, routes). */
export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  return getUserBySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Only allow same-origin relative redirect targets. */
export function safeNext(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return "/";
  }
  return next;
}

export function appUrl(): string {
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}
