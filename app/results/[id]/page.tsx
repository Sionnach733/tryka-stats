import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getRawSplits,
  getRefinedSplits,
  getResult,
  getStationFieldTimes,
} from "@/lib/queries";
import { displayGender, displayMembers, parseMembers, parseTime, formatMmSs, formatPace } from "@/lib/format";
import type { RefinedSplit } from "@/lib/queries";
import ResultTabs from "@/app/components/ResultTabs";
import StationsGrid from "@/app/components/StationsGrid";
import type { StationData } from "@/app/components/StationsGrid";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ q?: string }>;

export default async function ResultPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const { id: rawId } = await params;
  const { q } = await searchParams;
  const id = Number(rawId);
  if (!Number.isFinite(id)) notFound();

  const result = getResult(id);
  if (!result) notFound();

  const refined = getRefinedSplits(id);
  const raw = getRawSplits(id);
  const members = parseMembers(result.members);

  const stationData = buildStationData(refined, result.event_id, result.gender);

  return (
    <div className="space-y-8">
      <Link
        href={q ? `/?q=${encodeURIComponent(q)}` : "/"}
        className="text-sm text-blue-700 hover:underline dark:text-blue-400"
      >
        &larr; Back to search
      </Link>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-semibold tracking-tight">
          {displayMembers(members)}
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          {result.race_name} &middot; {result.division}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-4">
          <Field label="Overall Time" value={result.overall_time} mono />
          <Field
            label="Rank (M/W)"
            value={result.rank_overall?.toString() ?? null}
          />
          <Field
            label="Rank (AG)"
            value={result.rank_age_group?.toString() ?? null}
          />
          <Field label="Age Group" value={result.age_group} />
          <Field label="Gender" value={displayGender(result.gender)} />
          <Field label="Bib" value={result.bib_number} />
          <Field label="Gym Affiliate" value={result.gym_affiliate} />
          <Field
            label="League Points"
            value={result.league_points?.toString() ?? null}
          />
        </dl>

        {(result.penalty || result.bonus || result.disqual_reason) && (
          <div className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
            {result.penalty && (
              <Notice tone="warn" label="Penalty" value={result.penalty} />
            )}
            {result.bonus && (
              <Notice tone="good" label="Bonus" value={result.bonus} />
            )}
            {result.disqual_reason && (
              <Notice
                tone="bad"
                label="Disqualified"
                value={result.disqual_reason}
              />
            )}
          </div>
        )}
      </section>

      <SummaryTiles refined={refined} division={result.division} overallTime={result.overall_time} />

      <ResultTabs
        workoutContent={
          <SplitsTable
            headers={["Split", "Time", "Place"]}
            rows={refined.map((s) => [
              s.split_name,
              s.time ?? "—",
              s.place != null ? String(s.place) : "—",
            ])}
            numericCols={[1, 2]}
          />
        }
        splitsContent={
          <SplitsTable
            headers={["Split", "Time of Day", "Elapsed", "Diff"]}
            rows={raw.map((s) => [
              s.split_name,
              s.time_of_day ?? "—",
              s.time ?? "—",
              s.diff ?? "—",
            ])}
            numericCols={[1, 2, 3]}
          />
        }
        stationsContent={<StationsGrid stations={stationData} />}
      />
    </div>
  );
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className={mono ? "tabular-nums font-medium" : "font-medium"}>
        {value && value.length > 0 ? value : "—"}
      </dd>
    </div>
  );
}

function Notice({
  tone,
  label,
  value,
}: {
  tone: "good" | "warn" | "bad";
  label: string;
  value: string;
}) {
  const styles = {
    good: "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    warn: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200",
    bad: "border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200",
  }[tone];
  return (
    <div className={`rounded border px-3 py-2 ${styles}`}>
      <div className="text-xs font-semibold uppercase tracking-wide">{label}</div>
      <div>{value}</div>
    </div>
  );
}

const WORKOUT_STATIONS = [
  "SkiErg",
  "KB Farmers Carry",
  "Ramfit Thrusters",
  "Sled Push",
  "Sled Pull",
  "Rowing",
  "Lunges",
  "Burpees",
];

const PACE_DISTANCES: Record<string, number> = {
  "TRYKA OPEN 800": 6.4,
  "TRYKA DOUBLES 800": 6.4,
  "TRYKA RELAY": 6.4,
  "TRYKA PRO": 6.4,
  "TRYKA PRO DOUBLES": 6.4,
  "TRYKA DOUBLES PRO": 6.4,
  "TRYKA OPEN 500": 4,
  "TRYKA DOUBLES 500": 4,
};

function SummaryTiles({
  refined,
  division,
  overallTime,
}: {
  refined: RefinedSplit[];
  division: string;
  overallTime: string | null;
}) {
  const byName = new Map(refined.map((s) => [s.split_name, s]));

  const runTotal = byName.get("Run Total")?.time ?? null;
  const runTotalSecs = parseTime(runTotal);

  const workoutSecs = WORKOUT_STATIONS.reduce((sum, name) => {
    const secs = parseTime(byName.get(name)?.time);
    return secs != null ? sum + secs : sum;
  }, 0);

  const tryZone = byName.get("TRY Zone Total")?.time ?? null;

  const distanceKm = PACE_DISTANCES[division];

  const tiles: { label: string; value: string }[] = [];

  if (runTotal) {
    tiles.push({ label: "Run Total", value: runTotal });
  }
  if (distanceKm && runTotalSecs) {
    tiles.push({ label: "Pace", value: formatPace(runTotalSecs, distanceKm) });
  }
  const overallSecs = parseTime(overallTime);

  if (workoutSecs > 0) {
    tiles.push({ label: "Workout Total", value: formatMmSs(workoutSecs) });
    if (overallSecs && overallSecs > 0) {
      const ratio = (workoutSecs / overallSecs) * 100;
      tiles.push({ label: "Workout Ratio", value: `${ratio.toFixed(1)}%` });
    }
  }
  if (tryZone) {
    tiles.push({ label: "TRY Zone", value: tryZone });
  }

  if (tiles.length === 0) return null;

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {tiles.map((t) => (
        <div
          key={t.label}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="text-xs uppercase tracking-wide text-slate-500">
            {t.label}
          </div>
          <div className="mt-1 text-lg font-semibold tabular-nums">
            {t.value}
          </div>
        </div>
      ))}
    </section>
  );
}

/** Minimum realistic times per station (seconds). Times faster than these are outliers. */
const STATION_MIN_TIMES: Record<string, number> = {
  "SkiErg": 180,           // 03:00
  "KB Farmers Carry": 30,  // 00:30
  "Ramfit Thrusters": 60,  // 01:00
  "Sled Push": 40,         // 00:40
  "Sled Pull": 60,         // 01:00
  "Rowing": 180,           // 03:00
  "Lunges": 60,            // 01:00
  "Burpees": 60,           // 01:00
};

function buildStationData(
  refined: RefinedSplit[],
  eventId: number,
  gender: string | null,
): StationData[] {
  if (!gender) return [];

  const fieldRows = getStationFieldTimes(eventId, gender);

  // Group field times by station, parsed to seconds, filtering outliers
  const fieldByStation = new Map<string, number[]>();
  for (const row of fieldRows) {
    const secs = parseTime(row.time);
    if (secs == null) continue;
    const minTime = STATION_MIN_TIMES[row.split_name] ?? 0;
    if (secs < minTime) continue;
    let arr = fieldByStation.get(row.split_name);
    if (!arr) {
      arr = [];
      fieldByStation.set(row.split_name, arr);
    }
    arr.push(secs);
  }

  // Compute shared x-axis range across all stations
  let globalMin = Infinity;
  let globalMax = -Infinity;
  for (const times of fieldByStation.values()) {
    if (times.length === 0) continue;
    globalMin = Math.min(globalMin, times[0]);
    globalMax = Math.max(globalMax, times[times.length - 1]);
  }
  if (!isFinite(globalMin)) {
    globalMin = 0;
    globalMax = 1;
  }

  const athleteSplits = new Map(refined.map((s) => [s.split_name, s]));

  return WORKOUT_STATIONS.map((station) => {
    const split = athleteSplits.get(station);
    const timeSecs = parseTime(split?.time);
    const rank = split?.place ?? null;
    const fieldTimes = fieldByStation.get(station) ?? [];
    const totalCompetitors = fieldTimes.length;
    const percentile =
      rank != null && totalCompetitors > 0
        ? (rank / totalCompetitors) * 100
        : null;

    return {
      station,
      time: timeSecs,
      rank,
      totalCompetitors,
      percentile,
      fieldTimes,
      xMin: globalMin,
      xMax: globalMax,
    };
  });
}

function SplitsTable({
  headers,
  rows,
  numericCols = [],
}: {
  headers: string[];
  rows: string[][];
  numericCols?: number[];
}) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-slate-500">No splits recorded.</p>
    );
  }
  const numeric = new Set(numericCols);
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
        <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-900 dark:text-slate-400">
          <tr>
            {headers.map((h, i) => (
              <th
                key={h}
                className={`px-3 py-2 ${numeric.has(i) ? "text-right" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
          {rows.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  className={`px-3 py-2 ${
                    numeric.has(cIdx) ? "text-right tabular-nums" : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
