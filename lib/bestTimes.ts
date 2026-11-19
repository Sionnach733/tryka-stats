import { canonicalDivision } from "@/lib/queries";
import { parseTime } from "@/lib/format";

export type BestTime = {
  division: string;
  seconds: number;
  resultId: number;
  raceName: string;
};

/**
 * Fastest overall time per (canonical) division. `results` should be newest
 * first: on a tie the newest result wins. Unparseable times are skipped and the
 * result is sorted by division name.
 */
export function bestTimesByDivision(
  results: { id: number; division: string; race_name: string; overall_time: string | null }[],
): BestTime[] {
  const best = new Map<string, BestTime>();
  for (const r of results) {
    const seconds = parseTime(r.overall_time);
    if (seconds == null) continue;
    const division = canonicalDivision(r.division);
    const prev = best.get(division);
    if (!prev || seconds < prev.seconds) {
      best.set(division, { division, seconds, resultId: r.id, raceName: r.race_name });
    }
  }
  return Array.from(best.values()).sort((a, b) => a.division.localeCompare(b.division));
}
