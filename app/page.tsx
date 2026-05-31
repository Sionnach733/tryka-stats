import Link from "next/link";
import SearchBar from "./components/SearchBar";
import { searchAthletes } from "@/lib/queries";

type SearchParams = Promise<{ q?: string }>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q: rawQ } = await searchParams;
  const q = (rawQ ?? "").trim();
  const hits = q.length >= 3 ? searchAthletes(q) : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-tryka-green">
          Athlete Search
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Search by name to find your Tryka results. Returns individual and team
          entries from all races — including finish time, station splits, and
          how you ranked in your division.
        </p>
      </div>

      <SearchBar initialQuery={q} initialHits={hits} />

      <div className="mt-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Explore
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <li>
            <Link
              href="/races"
              className="group block h-full rounded-lg border border-tryka-navy-light bg-tryka-navy-light p-4 shadow-sm transition hover:border-tryka-green focus:outline-none focus:ring-1 focus:ring-tryka-green"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide group-hover:text-tryka-green">
                Race Reports
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                In-depth breakdowns of past Tryka events — splits, station
                charts, and division rankings.
              </p>
            </Link>
          </li>
          <li>
            <Link
              href="/calculator"
              className="group block h-full rounded-lg border border-tryka-navy-light bg-tryka-navy-light p-4 shadow-sm transition hover:border-tryka-green focus:outline-none focus:ring-1 focus:ring-tryka-green"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide group-hover:text-tryka-green">
                Race Calculator
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Enter a target finish time to see a predicted race breakdown
                based on athletes with similar results in your division.
              </p>
            </Link>
          </li>
          <li>
            <Link
              href="/stations"
              className="group block h-full rounded-lg border border-tryka-navy-light bg-tryka-navy-light p-4 shadow-sm transition hover:border-tryka-green focus:outline-none focus:ring-1 focus:ring-tryka-green"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide group-hover:text-tryka-green">
                Stations
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Movement standards, weights, and tips for all 8 workout
                stations — from SkiErg to Sprint Finish.
              </p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
