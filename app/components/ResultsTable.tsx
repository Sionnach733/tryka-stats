"use client";

import Link from "next/link";
import type { SearchHit } from "@/lib/queries";
import { displayGender, displayMembers, parseMembers } from "@/lib/format";

export default function ResultsTable({ hits }: { hits: SearchHit[] }) {
  if (hits.length === 0) {
    return (
      <p className="mt-6 text-sm text-slate-500">
        No results. Try a different name (try just a surname).
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
        <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-900 dark:text-slate-400">
          <tr>
            <th className="px-3 py-2">Athlete</th>
            <th className="px-3 py-2">Race</th>
            <th className="px-3 py-2">Division</th>
            <th className="px-3 py-2">Age Group</th>
            <th className="px-3 py-2">Gender</th>
            <th className="px-3 py-2 text-right">Rank (M/W)</th>
            <th className="px-3 py-2 text-right">Rank (Age)</th>
            <th className="px-3 py-2 text-right">Overall Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
          {hits.map((hit) => (
            <tr
              key={hit.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-900/60"
            >
              <td className="px-3 py-2 font-medium">
                <Link
                  href={`/results/${hit.id}`}
                  className="text-blue-700 hover:underline dark:text-blue-400"
                >
                  {displayMembers(parseMembers(hit.members))}
                </Link>
              </td>
              <td className="px-3 py-2">{hit.race_name}</td>
              <td className="px-3 py-2">{hit.division}</td>
              <td className="px-3 py-2">{hit.age_group ?? "—"}</td>
              <td className="px-3 py-2">{displayGender(hit.gender)}</td>
              <td className="px-3 py-2 text-right tabular-nums">
                {hit.rank_overall ?? "—"}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {hit.rank_age_group ?? "—"}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {hit.overall_time ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
