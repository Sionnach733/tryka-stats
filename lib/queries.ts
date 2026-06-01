import Database from "better-sqlite3";
import { getDb } from "./db";

export type SearchHit = {
  id: number;
  members: string;
  age_group: string | null;
  gender: string | null;
  overall_time: string | null;
  rank_overall: number | null;
  rank_age_group: number | null;
  total_gender: number | null;
  total_age_group: number | null;
  race_name: string;
  division: string;
};

export type ResultDetail = {
  id: number;
  idp: string;
  event_id: number;
  members: string;
  bib_number: string | null;
  gym_affiliate: string | null;
  age_group: string | null;
  gender: string | null;
  rank_overall: number | null;
  rank_age_group: number | null;
  league_points: number | null;
  overall_time: string | null;
  penalty: string | null;
  bonus: string | null;
  disqual_reason: string | null;
  total_gender: number | null;
  total_age_group: number | null;
  race_name: string;
  division: string;
};

export type RefinedSplit = {
  split_name: string;
  time: string | null;
  place: number | null;
};

export type RawSplit = {
  split_name: string;
  time_of_day: string | null;
  time: string | null;
  diff: string | null;
};

export type StationFieldRow = {
  split_name: string;
  time: string;
};

export type ResultIdRow = { id: number };

export type RaceSummary = { race_name: string };

export type FinishTimeRow = { id: number; overall_time: string | null };

export type RefinedSplitWithResultRow = {
  result_id: number;
  split_order: number;
  split_name: string;
  time: string | null;
};

// Lazily prepared statements — cached after first call to avoid
// opening the database at import time (which breaks Next.js builds).
let searchStmt: Database.Statement<[string], SearchHit> | null = null;
let detailStmt: Database.Statement<[number], ResultDetail> | null = null;
let refinedStmt: Database.Statement<[number], RefinedSplit> | null = null;
let rawStmt: Database.Statement<[number], RawSplit> | null = null;
let stationFieldStmt: Database.Statement<[number, string], StationFieldRow> | null = null;
let stationFieldByAgeStmt:
  | Database.Statement<[number, string, string], StationFieldRow>
  | null = null;
let runFieldStmt: Database.Statement<[number, string], StationFieldRow> | null = null;
let runFieldByAgeStmt:
  | Database.Statement<[number, string, string], StationFieldRow>
  | null = null;
let allIdsStmt: Database.Statement<[], ResultIdRow> | null = null;
let finishTimesByDivGenderStmt:
  | Database.Statement<[string, string], FinishTimeRow>
  | null = null;
let distinctDivisionsStmt:
  | Database.Statement<[], { division: string }>
  | null = null;
let allRacesStmt: Database.Statement<[], RaceSummary> | null = null;

function getSearchStmt() {
  if (!searchStmt) {
    searchStmt = getDb().prepare<[string], SearchHit>(`
      WITH totals AS (
        SELECT event_id, gender, age_group,
               MAX(rank_overall)   AS total_gender,
               MAX(rank_age_group) AS total_age_group
        FROM results
        GROUP BY event_id, gender, age_group
      )
      SELECT r.id, r.members, r.age_group, r.gender, r.overall_time,
             r.rank_overall, r.rank_age_group,
             t.total_gender, t.total_age_group,
             e.race_name, e.division
      FROM results r
      JOIN events e ON r.event_id = e.id
      JOIN totals t ON t.event_id = r.event_id AND t.gender = r.gender AND t.age_group = r.age_group
      WHERE LOWER(normalize_search(r.members)) LIKE LOWER('%' || normalize_search(?) || '%')
      ORDER BY e.race_name, r.rank_overall
      LIMIT 200
    `);
  }
  return searchStmt;
}

function getDetailStmt() {
  if (!detailStmt) {
    detailStmt = getDb().prepare<[number], ResultDetail>(`
      SELECT r.id, r.idp, r.event_id, r.members, r.bib_number, r.gym_affiliate,
             r.age_group, r.gender, r.rank_overall, r.rank_age_group,
             r.league_points, r.overall_time, r.penalty, r.bonus, r.disqual_reason,
             (SELECT COUNT(*) FROM results r2
              WHERE r2.event_id = r.event_id AND r2.gender = r.gender) AS total_gender,
             (SELECT COUNT(*) FROM results r2 WHERE r2.event_id = r.event_id
                AND r2.gender = r.gender
                AND r2.age_group = r.age_group) AS total_age_group,
             e.race_name, e.division
      FROM results r
      JOIN events e ON r.event_id = e.id
      WHERE r.id = ?
    `);
  }
  return detailStmt;
}

function getRefinedStmt() {
  if (!refinedStmt) {
    refinedStmt = getDb().prepare<[number], RefinedSplit>(`
      SELECT split_name, time, place
      FROM refined_splits
      WHERE result_id = ?
      ORDER BY split_order
    `);
  }
  return refinedStmt;
}

function getRawStmt() {
  if (!rawStmt) {
    rawStmt = getDb().prepare<[number], RawSplit>(`
      SELECT split_name, time_of_day, time, diff
      FROM raw_splits
      WHERE result_id = ?
      ORDER BY split_order
    `);
  }
  return rawStmt;
}

function getStationFieldStmt() {
  if (!stationFieldStmt) {
    stationFieldStmt = getDb().prepare<[number, string], StationFieldRow>(`
      SELECT rs.split_name, rs.time
      FROM refined_splits rs
      JOIN results r ON rs.result_id = r.id
      WHERE r.event_id = ? AND r.gender = ?
        AND rs.split_name IN ('SkiErg','KB Farmers Carry','Ramfit Thrusters',
          'Sled Push','Sled Pull','Rowing','Lunges','Burpees')
        AND rs.time IS NOT NULL
      ORDER BY rs.split_name, rs.time
    `);
  }
  return stationFieldStmt;
}

function getStationFieldByAgeStmt() {
  if (!stationFieldByAgeStmt) {
    stationFieldByAgeStmt = getDb().prepare<[number, string, string], StationFieldRow>(`
      SELECT rs.split_name, rs.time
      FROM refined_splits rs
      JOIN results r ON rs.result_id = r.id
      WHERE r.event_id = ? AND r.gender = ? AND r.age_group = ?
        AND rs.split_name IN ('SkiErg','KB Farmers Carry','Ramfit Thrusters',
          'Sled Push','Sled Pull','Rowing','Lunges','Burpees')
        AND rs.time IS NOT NULL
      ORDER BY rs.split_name, rs.time
    `);
  }
  return stationFieldByAgeStmt;
}

function getRunFieldStmt() {
  if (!runFieldStmt) {
    runFieldStmt = getDb().prepare<[number, string], StationFieldRow>(`
      SELECT rs.split_name, rs.time
      FROM refined_splits rs
      JOIN results r ON rs.result_id = r.id
      WHERE r.event_id = ? AND r.gender = ?
        AND rs.split_name IN ('Running 1','Running 2','Running 3','Running 4',
          'Running 5','Running 6','Running 7','Running 8','TRY Zone Total')
        AND rs.time IS NOT NULL
      ORDER BY rs.split_name, rs.time
    `);
  }
  return runFieldStmt;
}

function getRunFieldByAgeStmt() {
  if (!runFieldByAgeStmt) {
    runFieldByAgeStmt = getDb().prepare<[number, string, string], StationFieldRow>(`
      SELECT rs.split_name, rs.time
      FROM refined_splits rs
      JOIN results r ON rs.result_id = r.id
      WHERE r.event_id = ? AND r.gender = ? AND r.age_group = ?
        AND rs.split_name IN ('Running 1','Running 2','Running 3','Running 4',
          'Running 5','Running 6','Running 7','Running 8','TRY Zone Total')
        AND rs.time IS NOT NULL
      ORDER BY rs.split_name, rs.time
    `);
  }
  return runFieldByAgeStmt;
}

export function searchAthletes(query: string): SearchHit[] {
  const q = query.trim();
  if (!q) return [];
  return getSearchStmt().all(q);
}

export function getResult(id: number): ResultDetail | undefined {
  return getDetailStmt().get(id);
}

export function getRefinedSplits(resultId: number): RefinedSplit[] {
  return getRefinedStmt().all(resultId);
}

export function getRawSplits(resultId: number): RawSplit[] {
  return getRawStmt().all(resultId);
}

export function getStationFieldTimes(
  eventId: number,
  gender: string,
  ageGroup?: string | null,
): StationFieldRow[] {
  if (ageGroup) {
    return getStationFieldByAgeStmt().all(eventId, gender, ageGroup);
  }
  return getStationFieldStmt().all(eventId, gender);
}

export function getRunFieldTimes(
  eventId: number,
  gender: string,
  ageGroup?: string | null,
): StationFieldRow[] {
  if (ageGroup) {
    return getRunFieldByAgeStmt().all(eventId, gender, ageGroup);
  }
  return getRunFieldStmt().all(eventId, gender);
}

function getAllIdsStmt() {
  if (!allIdsStmt) {
    allIdsStmt = getDb().prepare<[], ResultIdRow>(
      `SELECT id FROM results ORDER BY id`
    );
  }
  return allIdsStmt;
}

export function getAllResultIds(): ResultIdRow[] {
  return getAllIdsStmt().all();
}

function getFinishTimesByDivGenderStmt() {
  if (!finishTimesByDivGenderStmt) {
    finishTimesByDivGenderStmt = getDb().prepare<
      [string, string],
      FinishTimeRow
    >(`
      SELECT r.id, r.overall_time
      FROM results r
      JOIN events e ON r.event_id = e.id
      WHERE e.division = ? AND r.gender = ?
        AND r.overall_time IS NOT NULL
    `);
  }
  return finishTimesByDivGenderStmt;
}

export function getFinishTimesByDivisionAndGender(
  division: string,
  gender: string,
): FinishTimeRow[] {
  return getFinishTimesByDivGenderStmt().all(division, gender);
}

function getDistinctDivisionsStmt() {
  if (!distinctDivisionsStmt) {
    distinctDivisionsStmt = getDb().prepare<[], { division: string }>(
      `SELECT DISTINCT division FROM events ORDER BY division`
    );
  }
  return distinctDivisionsStmt;
}

export function getDistinctDivisions(): string[] {
  return getDistinctDivisionsStmt()
    .all()
    .map((r) => r.division);
}

function getAllRacesStmtFn() {
  if (!allRacesStmt) {
    allRacesStmt = getDb().prepare<[], RaceSummary>(`
      SELECT DISTINCT race_name
      FROM events
      WHERE division NOT LIKE 'TRYKA JNR%'
        AND division != 'TRYKA CLAN FITNESS'
      ORDER BY race_name
    `);
  }
  return allRacesStmt;
}

export function getAllRaces(): RaceSummary[] {
  return getAllRacesStmtFn().all();
}

export function getRefinedSplitsForResults(
  ids: number[]
): RefinedSplitWithResultRow[] {
  if (ids.length === 0) return [];
  const placeholders = ids.map(() => "?").join(",");
  const stmt = getDb().prepare<number[], RefinedSplitWithResultRow>(`
    SELECT result_id, split_order, split_name, time
    FROM refined_splits
    WHERE result_id IN (${placeholders})
      AND time IS NOT NULL
    ORDER BY split_order
  `);
  return stmt.all(...ids);
}
