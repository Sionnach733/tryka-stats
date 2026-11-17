// Athlete identity: groups result-members across races by normalised name.
//
// tryka.db has no cross-race athlete id (`idp` is unique per result), so an
// "athlete" is every member entry whose name normalises to the same key.
// Doubles/relay results contribute one entry per member, so they appear on
// every partner's profile. Name collisions are resolved by claiming (see
// lib/claims.ts).
import { getDb, normalizeSearch } from "./db";

export type MemberEntry = { resultId: number; memberIndex: number };

export type Athlete = {
  key: string;
  slug: string;
  name: string;
  entries: MemberEntry[];
};

export type ResultMeta = {
  eventId: number;
  raceName: string;
  division: string;
  members: string[];
};

export type AthleteHit = {
  slug: string;
  name: string;
  resultCount: number;
  races: string[];
  divisions: string[];
  latestRace: string | null;
  claimed: boolean;
};

type AthleteIndex = {
  dataVersion: number;
  byKey: Map<string, Athlete>;
  bySlug: Map<string, string>;
  results: Map<number, ResultMeta>;
};

declare global {
  // eslint-disable-next-line no-var
  var __trykaAthleteIndex: AthleteIndex | undefined;
}

const COUNTRY_SUFFIX = /\s*\([A-Za-z]{2,3}\)\s*$/;

/** Strip a trailing country code, e.g. "Conor Mccarthy (IRL)" → "Conor Mccarthy". */
export function stripCountry(name: string): string {
  return name.replace(COUNTRY_SUFFIX, "").trim();
}

/** Grouping key: diacritic/apostrophe/case-insensitive, without country suffix. */
export function athleteKey(name: string): string {
  return normalizeSearch(stripCountry(name)).toLowerCase().replace(/\s+/g, " ").trim();
}

export function athleteSlug(key: string): string {
  return key.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function pickDisplayName(counts: Map<string, number>): string {
  let best = "";
  let bestCount = -1;
  for (const [name, count] of counts) {
    if (count > bestCount || (count === bestCount && name < best)) {
      best = name;
      bestCount = count;
    }
  }
  return best;
}

function dataVersion(): number {
  return getDb().pragma("data_version", { simple: true }) as number;
}

function buildIndex(): AthleteIndex {
  const db = getDb();
  const version = dataVersion();

  const results = new Map<number, ResultMeta>();
  const resultRows = db
    .prepare<[], { id: number; event_id: number; race_name: string; division: string; members: string }>(
      `SELECT r.id, r.event_id, e.race_name, e.division, r.members
       FROM results r JOIN events e ON e.id = r.event_id`,
    )
    .all();

  const groups = new Map<string, { entries: MemberEntry[]; names: Map<string, number> }>();
  for (const row of resultRows) {
    let members: string[] = [];
    try {
      const parsed = JSON.parse(row.members);
      if (Array.isArray(parsed)) members = parsed.filter((s) => typeof s === "string");
    } catch {
      // ignore malformed members
    }
    results.set(row.id, {
      eventId: row.event_id,
      raceName: row.race_name,
      division: row.division,
      members,
    });
    members.forEach((raw, memberIndex) => {
      const key = athleteKey(raw);
      if (!key || !athleteSlug(key)) return;
      let g = groups.get(key);
      if (!g) {
        g = { entries: [], names: new Map() };
        groups.set(key, g);
      }
      g.entries.push({ resultId: row.id, memberIndex });
      const display = stripCountry(raw);
      g.names.set(display, (g.names.get(display) ?? 0) + 1);
    });
  }

  // Assign slugs deterministically (sorted keys) so collisions resolve stably.
  const byKey = new Map<string, Athlete>();
  const bySlug = new Map<string, string>();
  for (const key of Array.from(groups.keys()).sort()) {
    const g = groups.get(key)!;
    const base = athleteSlug(key);
    let slug = base;
    for (let n = 2; bySlug.has(slug); n++) slug = `${base}-${n}`;
    bySlug.set(slug, key);
    byKey.set(key, { key, slug, name: pickDisplayName(g.names), entries: g.entries });
  }

  return { dataVersion: version, byKey, bySlug, results };
}

function getIndex(): AthleteIndex {
  const cached = global.__trykaAthleteIndex;
  // data_version changes when another connection (the scraper) commits.
  if (cached && cached.dataVersion === dataVersion()) return cached;
  const idx = buildIndex();
  global.__trykaAthleteIndex = idx;
  return idx;
}

export function getAthleteByKey(key: string): Athlete | undefined {
  return getIndex().byKey.get(key);
}

export function getAthleteBySlug(slug: string): Athlete | undefined {
  const idx = getIndex();
  const key = idx.bySlug.get(slug);
  return key ? idx.byKey.get(key) : undefined;
}

export function getAthleteForName(name: string): Athlete | undefined {
  return getAthleteByKey(athleteKey(name));
}

export function getResultMeta(resultId: number): ResultMeta | undefined {
  return getIndex().results.get(resultId);
}

export function getAllAthleteSlugs(): string[] {
  return Array.from(getIndex().bySlug.keys());
}

function summarise(athlete: Athlete, claimed: boolean): AthleteHit {
  const idx = getIndex();
  const races = new Set<string>();
  const divisions = new Set<string>();
  let latest: ResultMeta | null = null;
  for (const e of athlete.entries) {
    const meta = idx.results.get(e.resultId);
    if (!meta) continue;
    races.add(meta.raceName);
    divisions.add(meta.division);
    if (!latest || meta.eventId > latest.eventId) latest = meta;
  }
  return {
    slug: athlete.slug,
    name: athlete.name,
    resultCount: athlete.entries.length,
    races: Array.from(races),
    divisions: Array.from(divisions).sort(),
    latestRace: latest?.raceName ?? null,
    claimed,
  };
}

const SEARCH_LIMIT = 50;

/**
 * Athletes whose key contains the (normalised) query. Exact matches first,
 * then prefix matches, then by number of results.
 */
export function searchAthletes(
  query: string,
  isClaimed: (key: string) => boolean = () => false,
): AthleteHit[] {
  const q = athleteKey(query);
  if (!q) return [];
  const matches: Athlete[] = [];
  for (const athlete of getIndex().byKey.values()) {
    if (athlete.key.includes(q)) matches.push(athlete);
  }
  const rank = (a: Athlete) => (a.key === q ? 0 : a.key.startsWith(q) ? 1 : 2);
  matches.sort(
    (a, b) =>
      rank(a) - rank(b) ||
      b.entries.length - a.entries.length ||
      a.name.localeCompare(b.name),
  );
  return matches.slice(0, SEARCH_LIMIT).map((a) => summarise(a, isClaimed(a.key)));
}
