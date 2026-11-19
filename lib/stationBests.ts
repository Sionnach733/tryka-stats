import { STATION_MIN_SECONDS, WORKOUT_STATIONS } from "@/lib/constants";
import { parseTime } from "@/lib/format";

export type BestStation = {
  station: string;
  seconds: number;
  resultId: number;
  division: string;
  raceName: string;
};

// Divisions whose athletes may not have done every station.
const EXCLUDED_DIVISIONS = new Set(["TRYKA RELAY", "TRYKA CLAN FITNESS"]);

/**
 * Fastest valid time per workout station across the given results.
 * Relay and Clan Fitness results are skipped (the athlete may not have done the
 * station) and so are times below STATION_MIN_SECONDS. `results` should be newest first:
 * on a tie the newest result wins. Stations with no valid time are omitted.
 */
export function bestStationTimes(
  results: { id: number; division: string; race_name: string }[],
  splits: { result_id: number; split_name: string; time: string | null }[],
): BestStation[] {
  const byId = new Map(
    results.filter((r) => !EXCLUDED_DIVISIONS.has(r.division)).map((r, i) => [r.id, { ...r, i }]),
  );
  const best = new Map<string, BestStation & { i: number }>();
  for (const s of splits) {
    const result = byId.get(s.result_id);
    const min = STATION_MIN_SECONDS[s.split_name];
    if (!result || min == null) continue;
    const seconds = parseTime(s.time);
    if (seconds == null || seconds < min) continue;
    const prev = best.get(s.split_name);
    if (!prev || seconds < prev.seconds || (seconds === prev.seconds && result.i < prev.i)) {
      best.set(s.split_name, {
        station: s.split_name,
        seconds,
        resultId: result.id,
        division: result.division,
        raceName: result.race_name,
        i: result.i,
      });
    }
  }
  return WORKOUT_STATIONS.flatMap((name) => {
    const b = best.get(name);
    if (!b) return [];
    const { i: _i, ...rest } = b;
    return [rest];
  });
}
