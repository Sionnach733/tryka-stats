import type { Metadata } from "next";
import Link from "next/link";
import { STATIONS } from "@/lib/stations-content";

export const metadata: Metadata = {
  title: "Stations – Tips & Movement Standards",
  description:
    "Tips, tricks, and the latest Tryka movement standards for each workout station — SkiErg, KB Farmers Carry, Thrusters, Sleds, Rowing, Lunges, and Burpees.",
};

export default function StationsIndexPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-tryka-green">
          Stations
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Choose a station for tips, tricks, and the latest movement standards
          for individual and doubles races.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STATIONS.map((station) => (
          <li key={station.slug}>
            <Link
              href={`/stations/${station.slug}`}
              className="group block rounded-lg border border-tryka-navy-light bg-tryka-navy-light p-4 shadow-sm transition hover:border-tryka-green focus:outline-none focus:ring-1 focus:ring-tryka-green"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wide group-hover:text-tryka-green">
                {station.name}
              </h2>
              <p className="mt-1 text-xs text-slate-400">{station.tagline}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
