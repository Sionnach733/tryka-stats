import type { Metadata } from "next";
import { displayGender, formatMmSs, formatPace, parseTime } from "@/lib/format";
import {
  CALCULATOR_POOL_SIZE,
  averageSplits,
  filterAtomicSegments,
  pickClosestIds,
  runningSeconds,
  totalSeconds,
} from "@/lib/calculator";
import {
  getDistinctDivisions,
  getFinishTimesByDivisionAndGender,
  getRefinedSplitsForResults,
} from "@/lib/queries";
import { PACE_DISTANCES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Race Calculator – Predict Your Tryka Breakdown",
  description:
    "Enter your division, gender, and target Tryka finish time to see a predicted race breakdown — averaged from athletes with similar finishes in your division.",
};

const GENDERS = ["M", "W", "X"] as const;

type SearchParams = Promise<{
  division?: string;
  gender?: string;
  target?: string;
}>;

export default async function CalculatorPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const division = (params.division ?? "").trim();
  const gender = (params.gender ?? "").trim();
  const target = (params.target ?? "").trim();

  const divisions = getDistinctDivisions();

  const targetSeconds = target ? parseTime(target) : null;
  const isTargetInvalid = target.length > 0 && targetSeconds == null;
  const allInputs = division.length > 0 && gender.length > 0 && targetSeconds != null;

  let atomic: ReturnType<typeof averageSplits> = [];
  let poolSize = 0;
  if (allInputs) {
    const ids = pickClosestIds(
      getFinishTimesByDivisionAndGender(division, gender),
      targetSeconds,
    );
    poolSize = ids.length;
    if (ids.length > 0) {
      atomic = filterAtomicSegments(
        averageSplits(getRefinedSplitsForResults(ids)),
      );
    }
  }

  const totalSecs = atomic.length > 0 ? totalSeconds(atomic) : 0;
  const runSecs = atomic.length > 0 ? runningSeconds(atomic) : 0;
  const paceKm = division ? PACE_DISTANCES[division] : undefined;
  const showPaceTile = atomic.length > 0 && paceKm != null && runSecs > 0;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-tryka-green">
          Race Calculator
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Pick your division, gender, and target finish time. We&apos;ll predict
          your breakdown from the {CALCULATOR_POOL_SIZE} athletes with the
          closest finish times in your division.
        </p>
      </header>

      <form
        method="get"
        action="/calculator"
        className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3"
      >
        <label className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
          Division
          <select
            name="division"
            defaultValue={division}
            className="rounded border border-tryka-navy-light bg-tryka-navy px-3 py-2 text-sm text-white focus:border-tryka-green focus:outline-none focus:ring-1 focus:ring-tryka-green"
          >
            <option value="">Select division…</option>
            {divisions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
          Gender
          <select
            name="gender"
            defaultValue={gender}
            className="rounded border border-tryka-navy-light bg-tryka-navy px-3 py-2 text-sm text-white focus:border-tryka-green focus:outline-none focus:ring-1 focus:ring-tryka-green"
          >
            <option value="">Select gender…</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {displayGender(g)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
          Target finish time
          <input
            type="text"
            name="target"
            defaultValue={target}
            placeholder="e.g. 45:00 or 1:05:30"
            inputMode="numeric"
            autoComplete="off"
            className="w-44 rounded border border-tryka-navy-light bg-tryka-navy px-3 py-2 text-sm tabular-nums text-white placeholder:text-slate-500 focus:border-tryka-green focus:outline-none focus:ring-1 focus:ring-tryka-green"
          />
        </label>

        <button
          type="submit"
          className="rounded bg-tryka-green px-4 py-2 text-sm font-semibold text-tryka-navy hover:bg-tryka-green/90 focus:outline-none focus:ring-2 focus:ring-tryka-green"
        >
          Calculate
        </button>
      </form>

      {isTargetInvalid && (
        <p className="mb-6 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
          Couldn&apos;t read that time. Try a format like <code>45:00</code> or{" "}
          <code>1:05:30</code>.
        </p>
      )}

      {allInputs && atomic.length === 0 && (
        <p className="rounded border border-tryka-navy-light bg-tryka-navy-light p-3 text-sm text-slate-300">
          No athletes found in {division} ({displayGender(gender)}) near{" "}
          {formatMmSs(targetSeconds)}.
        </p>
      )}

      {allInputs && atomic.length > 0 && (
        <section>
          {showPaceTile && (
            <div className="mb-6 rounded-lg border border-tryka-navy-light bg-tryka-navy-light p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Predicted running pace
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-tryka-green">
                {formatPace(runSecs, paceKm!)}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Across {paceKm} km of running ({division}).
              </p>
            </div>
          )}

          <p className="mb-3 text-sm text-slate-400">
            Predicted breakdown for a target of{" "}
            <span className="font-semibold text-white tabular-nums">
              {formatMmSs(targetSeconds)}
            </span>{" "}
            in {division} ({displayGender(gender)}), averaged across {poolSize}{" "}
            athletes.
          </p>
          <div className="overflow-hidden rounded-lg border border-tryka-navy-light">
            <table className="w-full text-sm">
              <thead className="bg-tryka-navy-light text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-2 text-left">Segment</th>
                  <th className="px-4 py-2 text-right">Predicted time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tryka-navy-light">
                {atomic.map((seg) => (
                  <tr key={seg.split_name}>
                    <td className="px-4 py-2">{seg.split_name}</td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {formatMmSs(seg.avgSeconds)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-tryka-green/40 bg-tryka-navy/40 font-semibold text-tryka-green">
                  <td className="px-4 py-2">Predicted total time</td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {formatMmSs(totalSecs)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
