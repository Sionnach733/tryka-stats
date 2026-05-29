import { parseTime } from "./format";

export const CALCULATOR_POOL_SIZE = 20;

export const ATOMIC_SEGMENTS: ReadonlySet<string> = new Set([
  "Running 1",
  "Running 2",
  "Running 3",
  "Running 4",
  "Running 5",
  "Running 6",
  "Running 7",
  "Running 8",
  "Running Finish Sprint",
  "SkiErg",
  "KB Farmers Carry",
  "Ramfit Thrusters",
  "Sled Push",
  "Sled Pull",
  "Rowing",
  "Lunges",
  "Burpees",
  "TRY Zone Total",
]);

export type FinishTime = { id: number; overall_time: string | null };

export type SplitRow = {
  result_id: number;
  split_order: number;
  split_name: string;
  time: string | null;
};

export type PredictedSegment = {
  split_order: number;
  split_name: string;
  avgSeconds: number;
  sampleSize: number;
};

/**
 * Pick the ids of the N athletes whose parsed finish times are closest
 * to `targetSeconds`. Rows with unparseable times are skipped.
 */
export function pickClosestIds(
  rows: FinishTime[],
  targetSeconds: number,
  n: number = CALCULATOR_POOL_SIZE,
): number[] {
  const scored: { id: number; diff: number }[] = [];
  for (const row of rows) {
    const secs = parseTime(row.overall_time);
    if (secs == null) continue;
    scored.push({ id: row.id, diff: Math.abs(secs - targetSeconds) });
  }
  scored.sort((a, b) => a.diff - b.diff);
  return scored.slice(0, n).map((s) => s.id);
}

/**
 * Group split rows by `split_name`, parse their `time` strings, and return
 * one PredictedSegment per split with the mean in seconds. Sorted by the
 * canonical race order (taken from the minimum split_order seen per split).
 */
export function averageSplits(rows: SplitRow[]): PredictedSegment[] {
  const buckets = new Map<
    string,
    { total: number; count: number; minOrder: number }
  >();
  for (const row of rows) {
    const secs = parseTime(row.time);
    if (secs == null) continue;
    const b = buckets.get(row.split_name);
    if (b) {
      b.total += secs;
      b.count += 1;
      if (row.split_order < b.minOrder) b.minOrder = row.split_order;
    } else {
      buckets.set(row.split_name, {
        total: secs,
        count: 1,
        minOrder: row.split_order,
      });
    }
  }

  const segments: PredictedSegment[] = [];
  for (const [name, b] of buckets) {
    segments.push({
      split_order: b.minOrder,
      split_name: name,
      avgSeconds: b.total / b.count,
      sampleSize: b.count,
    });
  }
  segments.sort((a, b) => a.split_order - b.split_order);
  return segments;
}

export function filterAtomicSegments(
  segments: PredictedSegment[],
): PredictedSegment[] {
  return segments.filter((s) => ATOMIC_SEGMENTS.has(s.split_name));
}

export function totalSeconds(segments: PredictedSegment[]): number {
  return segments.reduce((sum, s) => sum + s.avgSeconds, 0);
}

/**
 * Sum the averaged times of the eight numbered "Running 1" through
 * "Running 8" legs. Used for pace calculation, which is calibrated against
 * the per-division run distances in PACE_DISTANCES — so the finish sprint
 * is intentionally excluded.
 */
export function runningSeconds(segments: PredictedSegment[]): number {
  return segments.reduce(
    (sum, s) =>
      /^Running [1-8]$/.test(s.split_name) ? sum + s.avgSeconds : sum,
    0,
  );
}
