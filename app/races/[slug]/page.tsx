import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllRaces } from "@/lib/queries";
import { slugify } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

type ReportModule = {
  default: ComponentType;
  intro?: string;
};

async function loadReport(slug: string): Promise<ReportModule | null> {
  try {
    const mod = (await import(`@/content/race-reports/${slug}`)) as ReportModule;
    return mod;
  } catch {
    return null;
  }
}

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

  const report = await loadReport(slug);
  const ReportComponent = report?.default;

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
        {report?.intro ? (
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{report.intro}</p>
        ) : null}
      </header>

      {ReportComponent ? (
        <ReportComponent />
      ) : (
        <div className="rounded-lg border border-tryka-navy-light bg-tryka-navy-light p-6 text-sm text-slate-400">
          Race report coming soon.
        </div>
      )}
    </div>
  );
}
