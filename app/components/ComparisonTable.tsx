import { formatMmSs, formatDiff } from "@/lib/format";
import { RUN_SPLITS } from "@/lib/constants";
import type { CompareSplit } from "./ComparisonChart";

const runSplitSet = new Set(RUN_SPLITS);

export default function ComparisonTable({
  splits,
  primaryName,
  primaryRace,
  secondaryName,
  secondaryRace,
}: {
  splits: CompareSplit[];
  primaryName: string;
  primaryRace: string;
  secondaryName: string;
  secondaryRace: string;
}) {
  const rows = splits.map((s) => {
    const pTime = s.primaryTime;
    const sTime = s.secondaryTime;
    const splitDiff =
      pTime != null && sTime != null ? pTime - sTime : null;
    return {
      splitName: s.splitName,
      primarySplit: pTime,
      secondarySplit: sTime,
      splitDiff,
      isRun: runSplitSet.has(s.splitName),
    };
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
        <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-900 dark:text-slate-400">
          <tr>
            <th className="px-3 py-2 text-left">
              Split
            </th>
            <th className="px-3 py-2 text-center border-l border-slate-200 dark:border-slate-800">
              <div>{primaryName}</div>
              <div className="font-normal text-slate-400">{primaryRace}</div>
            </th>
            <th className="px-3 py-2 text-center border-l border-slate-200 dark:border-slate-800">
              <div>{secondaryName}</div>
              <div className="font-normal text-slate-400">{secondaryRace}</div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
          {rows.map((r) => (
            <tr key={r.splitName}>
              <td
                className={`px-3 py-2 font-medium ${
                  r.isRun
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-orange-600 dark:text-orange-400"
                }`}
              >
                {r.splitName}
              </td>
              <td className="px-3 py-2 text-right tabular-nums border-l border-slate-100 dark:border-slate-900">
                {r.primarySplit != null ? formatMmSs(r.primarySplit) : "—"}
                {r.splitDiff != null && (
                  <DiffBadge diff={r.splitDiff} />
                )}
              </td>
              <td className="px-3 py-2 text-right tabular-nums border-l border-slate-100 dark:border-slate-900">
                {r.secondarySplit != null
                  ? formatMmSs(r.secondarySplit)
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DiffBadge({ diff }: { diff: number }) {
  if (diff === 0) return null;
  const isSlower = diff > 0;
  return (
    <span
      className={`ml-1.5 text-xs font-medium ${
        isSlower
          ? "text-rose-500"
          : "text-emerald-500"
      }`}
    >
      {formatDiff(diff)}
    </span>
  );
}
