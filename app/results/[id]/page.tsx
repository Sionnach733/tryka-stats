import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getRawSplits,
  getRefinedSplits,
  getResult,
  getStationFieldTimes,
  getRunFieldTimes,
} from "@/lib/queries";
import { displayGender, displayMembers, parseMembers, parseTime, formatMmSs, formatPace, formatDiff } from "@/lib/format";
import type { RefinedSplit } from "@/lib/queries";
import { WORKOUT_STATIONS, PACE_DISTANCES, RUN_SPLITS } from "@/lib/constants";
import ResultTabs from "@/app/components/ResultTabs";
import StationsGrid from "@/app/components/StationsGrid";
import type { StationData } from "@/app/components/StationsGrid";
import RunsGrid from "@/app/components/RunsGrid";
import type { RunData } from "@/app/components/RunsGrid";
import CompareButton from "@/app/components/CompareButton";
import ComparisonTiles from "@/app/components/ComparisonTiles";
import type { ComparisonTotals } from "@/app/components/ComparisonTiles";
import ComparisonSplits from "@/app/components/ComparisonSplits";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ q?: string; compare?: string }>;

export default async function ResultPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const { id: rawId } = await params;
  const { q, compare } = await searchParams;
  const id = Number(rawId);
  if (!Number.isFinite(id)) notFound();

  const result = getResult(id);
  if (!result) notFound();

  const refined = getRefinedSplits(id);
  const raw = getRawSplits(id);
  const members = parseMembers(result.members);

  const stationData = buildStationData(refined, result.event_id, result.gender);
  const runData = buildRunData(refined, result.event_id, result.gender);

  // Comparison data
  const compareId = compare ? Number(compare) : null;
  const compareResult = compareId && Number.isFinite(compareId) ? getResult(compareId) : undefined;
  const compareRefined = compareResult ? getRefinedSplits(compareId!) : [];
  const isCompareMode = !!compareResult;

  let comparisonTotals: { primary: ComparisonTotals; secondary: ComparisonTotals } | null = null;
  let compareSplits: { splitName: string; primaryTime: number | null; secondaryTime: number | null }[] = [];

  if (isCompareMode) {
    const primaryTotals = { ...buildComparisonTotals(refined), overallTime: result.overall_time };
    const secondaryTotals = { ...buildComparisonTotals(compareRefined), overallTime: compareResult.overall_time };
    comparisonTotals = { primary: primaryTotals, secondary: secondaryTotals };

    // Align splits by order from primary, then add any extras from secondary
    const excludeFromCompare = new Set(["Best Run Lap", "Run Total"]);
    const secondaryByName = new Map(compareRefined.map((s) => [s.split_name, s]));
    const seen = new Set<string>();
    for (const s of refined) {
      seen.add(s.split_name);
      if (excludeFromCompare.has(s.split_name)) continue;
      compareSplits.push({
        splitName: s.split_name,
        primaryTime: parseTime(s.time),
        secondaryTime: parseTime(secondaryByName.get(s.split_name)?.time),
      });
    }
    for (const s of compareRefined) {
      if (!seen.has(s.split_name) && !excludeFromCompare.has(s.split_name)) {
        compareSplits.push({
          splitName: s.split_name,
          primaryTime: null,
          secondaryTime: parseTime(s.time),
        });
      }
    }
  }

  const primaryName = displayMembers(members);
  const compareName = compareResult ? displayMembers(parseMembers(compareResult.members)) : "";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href={q ? `/?q=${encodeURIComponent(q)}` : "/"}
          className="text-sm text-blue-700 hover:underline dark:text-blue-400"
        >
          &larr; Back to search
        </Link>
        <Suspense>
          <CompareButton currentId={id} compareId={compareId} />
        </Suspense>
      </div>

      <div className={isCompareMode ? "grid grid-cols-1 gap-4 lg:grid-cols-2" : ""}>
        <AthleteCard result={result} members={members} />
        {isCompareMode && compareResult && (
          <AthleteCard result={compareResult} members={parseMembers(compareResult.members)} />
        )}
      </div>

      {isCompareMode && comparisonTotals ? (
        <ComparisonTiles primary={comparisonTotals.primary} secondary={comparisonTotals.secondary} />
      ) : (
        <SummaryTiles refined={refined} division={result.division} overallTime={result.overall_time} />
      )}

      <Suspense>
      <ResultTabs
        workoutContent={
          isCompareMode ? (
            <ComparisonSplits
              splits={compareSplits}
              primaryName={primaryName}
              primaryRace={`${result.race_name}`}
              secondaryName={compareName}
              secondaryRace={`${compareResult!.race_name}`}
            />
          ) : (
            <SplitsTable
              headers={["Split", "Time"]}
              rows={refined.map((s) => [
                s.split_name,
                s.time ?? "—",
              ])}
              numericCols={[1]}
            />
          )
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
        runsContent={<RunsGrid runs={runData} />}
      />
      </Suspense>
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

function AthleteCard({
  result,
  members,
}: {
  result: { race_name: string; division: string; overall_time: string | null; rank_overall: number | null; rank_age_group: number | null; age_group: string | null; gender: string | null; bib_number: string | null; gym_affiliate: string | null; league_points: number | null; total_gender: number | null; total_age_group: number | null; penalty: string | null; bonus: string | null; disqual_reason: string | null };
  members: string[];
}) {
  return (
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
          label="Overall Rank"
          value={result.rank_overall != null
            ? `${result.rank_overall} of ${result.total_gender}`
            : null}
        />
        <Field
          label="Rank (AG)"
          value={result.rank_age_group != null
            ? `${result.rank_age_group} of ${result.total_age_group}`
            : null}
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
  );
}

function buildComparisonTotals(refined: RefinedSplit[]): ComparisonTotals {
  const byName = new Map(refined.map((s) => [s.split_name, s]));
  const runTotal = byName.get("Run Total")?.time ?? null;
  const workoutSecs = WORKOUT_STATIONS.reduce((sum, name) => {
    const secs = parseTime(byName.get(name)?.time);
    return secs != null ? sum + secs : sum;
  }, 0);
  const tryZone = byName.get("TRY Zone Total")?.time ?? null;
  // Find overall time from the last refined split or use a dedicated field
  // We pass overall_time from the result, but here we work with refined splits
  // Overall time comes from the result object, not refined splits
  // So we compute workout total as MM:SS string
  return {
    overallTime: null, // Will be set from result object
    runTotal,
    workoutTotal: workoutSecs > 0 ? formatMmSs(workoutSecs) : null,
    tryZone,
  };
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

function buildStationData(
  refined: RefinedSplit[],
  eventId: number,
  gender: string | null,
): StationData[] {
  if (!gender) return [];

  const fieldRows = getStationFieldTimes(eventId, gender);

  // Group field times by station, parsed to seconds
  const fieldByStation = new Map<string, number[]>();
  for (const row of fieldRows) {
    const secs = parseTime(row.time);
    if (secs == null) continue;
    let arr = fieldByStation.get(row.split_name);
    if (!arr) {
      arr = [];
      fieldByStation.set(row.split_name, arr);
    }
    arr.push(secs);
  }

  const athleteSplits = new Map(refined.map((s) => [s.split_name, s]));

  return WORKOUT_STATIONS.map((station) => {
    const split = athleteSplits.get(station);
    const timeSecs = parseTime(split?.time);
    const fieldTimes = fieldByStation.get(station) ?? [];
    const totalCompetitors = fieldTimes.length;
    const xMin = fieldTimes.length > 0 ? fieldTimes[0] : 0;
    const p99Idx = fieldTimes.length > 0 ? Math.ceil(fieldTimes.length * 0.99) - 1 : 0;
    const xMax = fieldTimes.length > 0 ? fieldTimes[p99Idx] : 1;
    // Compute rank and percentile from field times
    let rank: number | null = null;
    let percentile: number | null = null;
    if (timeSecs != null && totalCompetitors > 0) {
      let faster = 0;
      for (const t of fieldTimes) {
        if (t < timeSecs) faster++;
      }
      rank = faster + 1;
      percentile = (rank / totalCompetitors) * 100;
    }

    return {
      station,
      time: timeSecs,
      rank,
      totalCompetitors,
      percentile,
      fieldTimes,
      xMin,
      xMax,
    };
  });
}


function buildRunData(
  refined: RefinedSplit[],
  eventId: number,
  gender: string | null,
): RunData[] {
  if (!gender) return [];

  const fieldRows = getRunFieldTimes(eventId, gender);

  const fieldByRun = new Map<string, number[]>();
  for (const row of fieldRows) {
    const secs = parseTime(row.time);
    if (secs == null) continue;
    let arr = fieldByRun.get(row.split_name);
    if (!arr) {
      arr = [];
      fieldByRun.set(row.split_name, arr);
    }
    arr.push(secs);
  }

  const athleteSplits = new Map(refined.map((s) => [s.split_name, s]));

  return RUN_SPLITS.map((run) => {
    const split = athleteSplits.get(run);
    const timeSecs = parseTime(split?.time);
    const fieldTimes = fieldByRun.get(run) ?? [];
    const xMin = fieldTimes.length > 0 ? fieldTimes[0] : 0;
    const p99Idx = fieldTimes.length > 0 ? Math.ceil(fieldTimes.length * 0.99) - 1 : 0;
    const xMax = fieldTimes.length > 0 ? fieldTimes[p99Idx] : 1;
    const totalCompetitors = fieldTimes.length;
    let rank: number | null = null;
    let percentile: number | null = null;
    if (timeSecs != null && totalCompetitors > 0) {
      let faster = 0;
      for (const t of fieldTimes) {
        if (t < timeSecs) faster++;
      }
      rank = faster + 1;
      percentile = (rank / totalCompetitors) * 100;
    }

    return {
      run,
      time: timeSecs,
      rank,
      totalCompetitors,
      percentile,
      fieldTimes,
      xMin,
      xMax,
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
