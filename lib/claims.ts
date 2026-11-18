// Claiming: links athletes (name groups from lib/athletes.ts) and individual
// result-members to user accounts. Each (result_id, member_index) can be
// claimed by at most one user.
import { getAppDb, now } from "./appDb";
import {
  athleteKey,
  getAthleteByKey,
  getResultMeta,
  type Athlete,
  type MemberEntry,
} from "./athletes";

export type ClaimSource = "auto" | "manual";

export type ProfileEntry = MemberEntry & { source: ClaimSource | null };

export type Profile = {
  athlete: Athlete;
  ownerId: number | null;
  /** Owner's primary key, if it differs from this athlete's key. */
  redirectKey: string | null;
  entries: ProfileEntry[];
};

export type ClaimResult = { ok: true } | { ok: false; error: string };

const fail = (error: string): ClaimResult => ({ ok: false, error });

const entryId = (e: MemberEntry) => `${e.resultId}:${e.memberIndex}`;

export function ownerOfKey(key: string): number | null {
  const row = getAppDb()
    .prepare<[string], { user_id: number }>(
      "SELECT user_id FROM athlete_claims WHERE athlete_key = ?",
    )
    .get(key);
  return row?.user_id ?? null;
}

export function claimedKeys(): Set<string> {
  const rows = getAppDb()
    .prepare<[], { athlete_key: string }>("SELECT athlete_key FROM athlete_claims")
    .all();
  return new Set(rows.map((r) => r.athlete_key));
}

export function userKeys(userId: number): string[] {
  return getAppDb()
    .prepare<[number], { athlete_key: string }>(
      "SELECT athlete_key FROM athlete_claims WHERE user_id = ? ORDER BY created_at",
    )
    .all(userId)
    .map((r) => r.athlete_key);
}

export function primaryKey(userId: number): string | null {
  const row = getAppDb()
    .prepare<[number], { primary_athlete_key: string | null }>(
      "SELECT primary_athlete_key FROM users WHERE id = ?",
    )
    .get(userId);
  return row?.primary_athlete_key ?? null;
}

function entryOwner(e: MemberEntry): { user_id: number; source: ClaimSource } | undefined {
  return getAppDb()
    .prepare<[number, number], { user_id: number; source: ClaimSource }>(
      "SELECT user_id, source FROM result_claims WHERE result_id = ? AND member_index = ?",
    )
    .get(e.resultId, e.memberIndex);
}

/** Key of the name group an entry belongs to, or null if the entry doesn't exist. */
function keyOfEntry(e: MemberEntry): string | null {
  const name = getResultMeta(e.resultId)?.members[e.memberIndex];
  return name ? athleteKey(name) : null;
}

function isInOwnGroup(userId: number, e: MemberEntry): boolean {
  const key = keyOfEntry(e);
  return key !== null && ownerOfKey(key) === userId;
}

/**
 * Attach every entry of the user's claimed name groups that nobody else has
 * claimed and that the user hasn't excluded. Idempotent; picks up results
 * from newly scraped races.
 */
export function syncUser(userId: number): void {
  const db = getAppDb();
  const insert = db.prepare(
    `INSERT OR IGNORE INTO result_claims (result_id, member_index, user_id, source, created_at)
     SELECT ?, ?, ?, 'auto', ?
     WHERE NOT EXISTS (
       SELECT 1 FROM result_exclusions
       WHERE user_id = ? AND result_id = ? AND member_index = ?
     )`,
  );
  const ts = now();
  db.transaction(() => {
    for (const key of userKeys(userId)) {
      const athlete = getAthleteByKey(key);
      if (!athlete) continue;
      for (const e of athlete.entries) {
        insert.run(e.resultId, e.memberIndex, userId, ts, userId, e.resultId, e.memberIndex);
      }
    }
  })();
}

export function claimAthlete(userId: number, key: string): ClaimResult {
  if (!getAthleteByKey(key)) return fail("Athlete not found.");
  const db = getAppDb();
  const owner = ownerOfKey(key);
  if (owner === userId) return { ok: true };
  if (owner !== null) return fail("This athlete has already been claimed.");
  db.transaction(() => {
    db.prepare(
      "INSERT INTO athlete_claims (athlete_key, user_id, created_at) VALUES (?, ?, ?)",
    ).run(key, userId, now());
    db.prepare(
      "UPDATE users SET primary_athlete_key = ? WHERE id = ? AND primary_athlete_key IS NULL",
    ).run(key, userId);
  })();
  syncUser(userId);
  return { ok: true };
}

/** Give up a name group: its auto claims and exclusions go with it. */
export function releaseAthlete(userId: number, key: string): ClaimResult {
  if (ownerOfKey(key) !== userId) return fail("You don't own this athlete.");
  const athlete = getAthleteByKey(key);
  const db = getAppDb();
  db.transaction(() => {
    db.prepare("DELETE FROM athlete_claims WHERE athlete_key = ?").run(key);
    for (const e of athlete?.entries ?? []) {
      db.prepare(
        "DELETE FROM result_claims WHERE result_id = ? AND member_index = ? AND user_id = ? AND source = 'auto'",
      ).run(e.resultId, e.memberIndex, userId);
      db.prepare(
        "DELETE FROM result_exclusions WHERE user_id = ? AND result_id = ? AND member_index = ?",
      ).run(userId, e.resultId, e.memberIndex);
    }
    const remaining = userKeys(userId);
    db.prepare("UPDATE users SET primary_athlete_key = ? WHERE id = ?").run(
      remaining[0] ?? null,
      userId,
    );
  })();
  return { ok: true };
}

/** Untick a result from the user's own name group ("that's not me"). */
export function excludeEntry(userId: number, e: MemberEntry): ClaimResult {
  if (!isInOwnGroup(userId, e)) return fail("That result isn't in your athlete group.");
  const db = getAppDb();
  db.transaction(() => {
    db.prepare(
      "DELETE FROM result_claims WHERE result_id = ? AND member_index = ? AND user_id = ?",
    ).run(e.resultId, e.memberIndex, userId);
    db.prepare(
      "INSERT OR IGNORE INTO result_exclusions (user_id, result_id, member_index) VALUES (?, ?, ?)",
    ).run(userId, e.resultId, e.memberIndex);
  })();
  return { ok: true };
}

/** Re-tick a previously excluded result from the user's own name group. */
export function includeEntry(userId: number, e: MemberEntry): ClaimResult {
  if (!isInOwnGroup(userId, e)) return fail("That result isn't in your athlete group.");
  const owner = entryOwner(e);
  if (owner && owner.user_id !== userId) {
    return fail("That result has been claimed by another athlete.");
  }
  const db = getAppDb();
  db.transaction(() => {
    db.prepare(
      "DELETE FROM result_exclusions WHERE user_id = ? AND result_id = ? AND member_index = ?",
    ).run(userId, e.resultId, e.memberIndex);
    db.prepare(
      `INSERT OR IGNORE INTO result_claims (result_id, member_index, user_id, source, created_at)
       VALUES (?, ?, ?, 'auto', ?)`,
    ).run(e.resultId, e.memberIndex, userId, now());
  })();
  return { ok: true };
}

/** Add a result filed under a different (e.g. misspelled) name. */
export function claimEntryManually(userId: number, e: MemberEntry): ClaimResult {
  if (keyOfEntry(e) === null) return fail("Result not found.");
  if (userKeys(userId).length === 0) {
    return fail("Claim your athlete profile before adding other results.");
  }
  const owner = entryOwner(e);
  if (owner) {
    return owner.user_id === userId
      ? { ok: true }
      : fail("That result has already been claimed by another athlete.");
  }
  const db = getAppDb();
  db.transaction(() => {
    db.prepare(
      "DELETE FROM result_exclusions WHERE user_id = ? AND result_id = ? AND member_index = ?",
    ).run(userId, e.resultId, e.memberIndex);
    db.prepare(
      `INSERT INTO result_claims (result_id, member_index, user_id, source, created_at)
       VALUES (?, ?, ?, 'manual', ?)`,
    ).run(e.resultId, e.memberIndex, userId, now());
  })();
  return { ok: true };
}

/** Remove a manually added result. */
export function unclaimManual(userId: number, e: MemberEntry): ClaimResult {
  const owner = entryOwner(e);
  if (!owner || owner.user_id !== userId || owner.source !== "manual") {
    return fail("That result isn't one you added.");
  }
  getAppDb()
    .prepare("DELETE FROM result_claims WHERE result_id = ? AND member_index = ?")
    .run(e.resultId, e.memberIndex);
  // A manually added entry from the user's own group would otherwise be
  // re-attached by the next sync.
  if (isInOwnGroup(userId, e)) excludeEntry(userId, e);
  return { ok: true };
}

function claimsOf(userId: number): ProfileEntry[] {
  return getAppDb()
    .prepare<[number], { result_id: number; member_index: number; source: ClaimSource }>(
      "SELECT result_id, member_index, source FROM result_claims WHERE user_id = ?",
    )
    .all(userId)
    .map((r) => ({ resultId: r.result_id, memberIndex: r.member_index, source: r.source }));
}

function claimedEntryIds(entries: MemberEntry[]): Set<string> {
  if (entries.length === 0) return new Set();
  const rows = getAppDb()
    .prepare<[string], { result_id: number; member_index: number }>(
      `SELECT result_id, member_index FROM result_claims
       WHERE result_id IN (SELECT value FROM json_each(?))`,
    )
    .all(JSON.stringify(Array.from(new Set(entries.map((e) => e.resultId)))));
  return new Set(rows.map((r) => `${r.result_id}:${r.member_index}`));
}

/**
 * Results shown on an athlete's public profile: the owner's claims if the
 * name group is claimed, otherwise every entry in the group not claimed by
 * someone else.
 */
export function getProfile(athlete: Athlete): Profile {
  const ownerId = ownerOfKey(athlete.key);
  if (ownerId !== null) {
    syncUser(ownerId);
    const primary = primaryKey(ownerId);
    return {
      athlete,
      ownerId,
      redirectKey: primary && primary !== athlete.key ? primary : null,
      entries: claimsOf(ownerId),
    };
  }
  const taken = claimedEntryIds(athlete.entries);
  return {
    athlete,
    ownerId: null,
    redirectKey: null,
    entries: athlete.entries
      .filter((e) => !taken.has(entryId(e)))
      .map((e) => ({ ...e, source: null })),
  };
}

/** Entries of the user's own groups they've unticked (for the manage UI). */
export function getExclusions(userId: number): MemberEntry[] {
  return getAppDb()
    .prepare<[number], { result_id: number; member_index: number }>(
      "SELECT result_id, member_index FROM result_exclusions WHERE user_id = ?",
    )
    .all(userId)
    .map((r) => ({ resultId: r.result_id, memberIndex: r.member_index }));
}

/**
 * Key of the profile a result-member should link to: the claimer's primary
 * athlete if claimed, otherwise the entry's own name group.
 */
export function profileKeyForEntry(e: MemberEntry): string | null {
  const owner = entryOwner(e);
  if (owner) {
    const primary = primaryKey(owner.user_id);
    if (primary) return primary;
  }
  return keyOfEntry(e);
}

export type GroupEntryStatus = "mine" | "excluded" | "taken";

/** Every entry in the user's claimed name groups with its claim status. */
export function getGroupEntries(userId: number): (MemberEntry & { status: GroupEntryStatus })[] {
  const out: (MemberEntry & { status: GroupEntryStatus })[] = [];
  for (const key of userKeys(userId)) {
    for (const e of getAthleteByKey(key)?.entries ?? []) {
      const owner = entryOwner(e);
      out.push({
        ...e,
        status: owner ? (owner.user_id === userId ? "mine" : "taken") : "excluded",
      });
    }
  }
  return out;
}
