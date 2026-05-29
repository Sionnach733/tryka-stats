import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STATIONS, getStationBySlug } from "@/lib/stations-content";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return STATIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const station = getStationBySlug(slug);
  if (!station) return {};
  return {
    title: `${station.name} – Tips & Movement Standards`,
    description: `${station.tagline} Tryka movement standards for ${station.name} (individual and doubles).`,
  };
}

export default async function StationDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const station = getStationBySlug(slug);
  if (!station) notFound();

  return (
    <article>
      <nav className="mb-4 text-xs text-slate-400">
        <Link href="/stations" className="hover:text-tryka-green">
          ← All stations
        </Link>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-tryka-green">
          {station.name}
        </h1>
        <p className="mt-2 text-sm text-slate-300">{station.tagline}</p>
      </header>

      <section className="mb-8 rounded-lg border border-tryka-navy-light bg-tryka-navy-light p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide">
          Tips & Tricks
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-200">
          {station.tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-tryka-navy-light bg-tryka-navy-light p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide">
          Movement Standards
        </h2>
        <p className="mb-4 text-xs text-slate-400">
          Per the latest Tryka rulebook. Always check the official rulebook
          before race day for any updates.
        </p>

        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-tryka-green">
          Individual
        </h3>
        <ul className="mb-5 list-disc space-y-2 pl-5 text-sm text-slate-200">
          {station.standardsIndividual.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>

        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-tryka-green">
          Doubles
        </h3>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-200">
          {station.standardsDoubles.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
