import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllRaces } from "@/lib/queries";
import { slugify } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const race = getAllRaces().find((r) => slugify(r.race_name) === slug);
  if (!race) return {};
  return {
    title: race.race_name,
    description: `Race report for ${race.race_name}.`,
  };
}

export default async function RaceReportPage({ params }: Props) {
  const { slug } = await params;
  const race = getAllRaces().find((r) => slugify(r.race_name) === slug);
  if (!race) notFound();

  return (
    <div>
      <nav className="mb-4 text-xs text-slate-400">
        <Link href="/races" className="hover:text-tryka-green">
          ← Race Reports
        </Link>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-tryka-green">
          {race.race_name}
        </h1>
        <p className="mt-1 text-sm text-slate-400">{race.divisions}</p>
      </header>

      <div className="rounded-lg border border-tryka-navy-light bg-tryka-navy-light p-6 text-sm text-slate-400">
        Race report coming soon.
      </div>
    </div>
  );
}
