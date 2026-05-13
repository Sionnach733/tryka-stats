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

// Lazily prepared statements — cached after first call to avoid
// opening the database at import time (which breaks Next.js builds).
let searchStmt: Database.Statement<[string], SearchHit> | null = null;
let detailStmt: Database.Statement<[number], ResultDetail> | null = null;
let refinedStmt: Database.Statement<[number], RefinedSplit> | null = null;
let rawStmt: Database.Statement<[number], RawSplit> | null = null;
let stationFieldStmt: Database.Statement<[number, string], StationFieldRow> | null = null;
let runFieldStmt: Database.Statement<[number, string], StationFieldRow> | null = null;

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

export function getStationFieldTimes(eventId: number, gender: string): StationFieldRow[] {
  return getStationFieldStmt().all(eventId, gender);
}

export function getRunFieldTimes(eventId: number, gender: string): StationFieldRow[] {
  return getRunFieldStmt().all(eventId, gender);
}
