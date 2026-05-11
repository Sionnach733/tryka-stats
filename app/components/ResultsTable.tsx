"use client";

import Link from "next/link";
import type { SearchHit } from "@/lib/queries";
import { displayGender, displayMembers, parseMembers } from "@/lib/format";

export default function ResultsTable({ hits, query }: { hits: SearchHit[]; query?: string }) {
  if (hits.length === 0) {
    return (
      <p className="mt-6 text-sm text-slate-400">
        No results. Try a different name (try just a surname).
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-tryka-navy-light">
      <table className="min-w-full divide-y divide-tryka-navy-light text-sm">
        <thead className="bg-tryka-navy-light text-left text-xs uppercase tracking-wide text-slate-400">
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
        <tbody className="divide-y divide-tryka-navy-light">
          {hits.map((hit) => (
            <tr
              key={hit.id}
              className="hover:bg-tryka-navy-light/50"
            >
              <td className="px-3 py-2 font-medium">
                <Link
                  href={`/results/${hit.id}${query ? `?q=${encodeURIComponent(query)}` : ""}`}
                  className="text-tryka-green hover:underline"
                >
                  {displayMembers(parseMembers(hit.members))}
                </Link>
              </td>
              <td className="px-3 py-2">{hit.race_name}</td>
              <td className="px-3 py-2">{hit.division}</td>
              <td className="px-3 py-2">{hit.age_group ?? "—"}</td>
              <td className="px-3 py-2">{displayGender(hit.gender)}</td>
              <td className="px-3 py-2 text-right tabular-nums">
                {hit.rank_overall != null
                  ? `${hit.rank_overall}/${hit.total_gender}`
                  : "—"}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {hit.rank_age_group != null
                  ? `${hit.rank_age_group}/${hit.total_age_group}`
                  : "—"}
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
