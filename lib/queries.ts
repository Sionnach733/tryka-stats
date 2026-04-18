import { db } from "./db";

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

const searchStmt = db.prepare<[string], SearchHit>(`
  SELECT r.id, r.members, r.age_group, r.gender, r.overall_time,
         r.rank_overall, r.rank_age_group,
         (SELECT MAX(r2.rank_overall) FROM results r2
          WHERE r2.event_id = r.event_id AND r2.gender = r.gender) AS total_gender,
         (SELECT MAX(r2.rank_age_group) FROM results r2
          WHERE r2.event_id = r.event_id AND r2.gender = r.gender
            AND r2.age_group = r.age_group) AS total_age_group,
         e.race_name, e.division
  FROM results r
  JOIN events e ON r.event_id = e.id
  WHERE LOWER(normalize_search(r.members)) LIKE LOWER('%' || normalize_search(?) || '%')
  ORDER BY e.race_name, r.rank_overall
  LIMIT 200
`);

const detailStmt = db.prepare<[number], ResultDetail>(`
  SELECT r.id, r.idp, r.event_id, r.members, r.bib_number, r.gym_affiliate,
         r.age_group, r.gender, r.rank_overall, r.rank_age_group,
         r.league_points, r.overall_time, r.penalty, r.bonus, r.disqual_reason,
         e.race_name, e.division
  FROM results r
  JOIN events e ON r.event_id = e.id
  WHERE r.id = ?
`);

const refinedStmt = db.prepare<[number], RefinedSplit>(`
  SELECT split_name, time, place
  FROM refined_splits
  WHERE result_id = ?
  ORDER BY split_order
`);

const rawStmt = db.prepare<[number], RawSplit>(`
  SELECT split_name, time_of_day, time, diff
  FROM raw_splits
  WHERE result_id = ?
  ORDER BY split_order
`);

export function searchAthletes(query: string): SearchHit[] {
  const q = query.trim();
  if (!q) return [];
  return searchStmt.all(q);
}

export function getResult(id: number): ResultDetail | undefined {
  return detailStmt.get(id);
}

export function getRefinedSplits(resultId: number): RefinedSplit[] {
  return refinedStmt.all(resultId);
}

export function getRawSplits(resultId: number): RawSplit[] {
  return rawStmt.all(resultId);
}

const stationFieldStmt = db.prepare<[number, string], StationFieldRow>(`
  SELECT rs.split_name, rs.time
  FROM refined_splits rs
  JOIN results r ON rs.result_id = r.id
  WHERE r.event_id = ? AND r.gender = ?
    AND rs.split_name IN ('SkiErg','KB Farmers Carry','Ramfit Thrusters',
      'Sled Push','Sled Pull','Rowing','Lunges','Burpees')
    AND rs.time IS NOT NULL
  ORDER BY rs.split_name, rs.time
`);

export function getStationFieldTimes(eventId: number, gender: string): StationFieldRow[] {
  return stationFieldStmt.all(eventId, gender);
}
