import type { Metadata } from "next";
import Link from "next/link";
import { getAllRaces } from "@/lib/queries";
import { slugify } from "@/lib/format";

export const metadata: Metadata = {
  title: "Race Reports",
  description: "Race reports for Tryka events.",
};

export default function RaceReportsPage() {
  const races = getAllRaces();

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-tryka-green">
          Race Reports
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          In-depth reports from Tryka race events.
        </p>
      </header>

      {races.length === 0 ? (
        <p className="text-sm text-slate-400">No race reports available yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {races.map((race) => (
            <li key={race.race_name}>
              <Link
                href={`/races/${slugify(race.race_name)}`}
                className="group block rounded-lg border border-tryka-navy-light bg-tryka-navy-light p-4 shadow-sm transition hover:border-tryka-green focus:outline-none focus:ring-1 focus:ring-tryka-green"
              >
                <h2 className="text-sm font-semibold uppercase tracking-wide group-hover:text-tryka-green">
                  {race.race_name}
                </h2>
                <p className="mt-1 text-xs text-slate-400">{race.divisions}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
