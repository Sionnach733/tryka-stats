"use client";

import Link from "next/link";
import type { AthleteHit } from "@/lib/athletes";

const MAX_DIVISIONS_SHOWN = 2;

export default function AthleteResultsTable({
  hits,
  query,
}: {
  hits: AthleteHit[];
  query?: string;
}) {
  if (hits.length === 0) {
    return (
      <p className="mt-6 text-sm text-slate-400">
        No athletes found. Try a different name (try just a surname).
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-tryka-navy-light">
      <table className="min-w-full divide-y divide-tryka-navy-light text-sm">
        <thead className="bg-tryka-navy-light text-left text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-3 py-2">Athlete</th>
            <th className="px-3 py-2 text-right">Results</th>
            <th className="px-3 py-2">Latest Race</th>
            <th className="px-3 py-2">Divisions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-tryka-navy-light">
          {hits.map((hit) => (
            <tr key={hit.slug} className="hover:bg-tryka-navy-light/50">
              <td className="px-3 py-2 font-medium">
                <Link
                  href={`/athletes/${hit.slug}${query ? `?q=${encodeURIComponent(query)}` : ""}`}
                  className="text-tryka-green hover:underline"
                >
                  {hit.name}
                </Link>
                {hit.claimed && (
                  <span
                    className="ml-2 rounded border border-tryka-green/30 bg-tryka-green/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-tryka-green"
                    title="Claimed by the athlete"
                  >
                    Claimed
                  </span>
                )}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">{hit.resultCount}</td>
              <td className="px-3 py-2">
                {hit.latestRace ?? "—"}
                {hit.races.length > 1 && (
                  <span className="ml-1 text-xs text-slate-500">
                    +{hit.races.length - 1} more
                  </span>
                )}
              </td>
              <td className="px-3 py-2 text-slate-400">
                {hit.divisions.slice(0, MAX_DIVISIONS_SHOWN).join(", ")}
                {hit.divisions.length > MAX_DIVISIONS_SHOWN &&
                  ` +${hit.divisions.length - MAX_DIVISIONS_SHOWN}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
