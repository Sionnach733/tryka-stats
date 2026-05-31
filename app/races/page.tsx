import type { Metadata } from "next";
import Link from "next/link";
import { getAllRaces } from "@/lib/queries";
import { slugify } from "@/lib/format";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Race Reports",
  description: "Race reports for Tryka events.",
};

async function loadIntro(slug: string): Promise<string | null> {
  try {
    const mod = (await import(`@/content/race-reports/${slug}`)) as { intro?: string };
    return mod.intro ?? null;
  } catch {
    return null;
  }
}

export default async function RaceReportsPage() {
  const races = getAllRaces();
  const cards = await Promise.all(
    races.map(async (race) => {
      const slug = slugify(race.race_name);
      const intro = await loadIntro(slug);
      return { race_name: race.race_name, slug, intro };
    }),
  );

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

      {cards.length === 0 ? (
        <p className="text-sm text-slate-400">No race reports available yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {cards.map((card) => (
            <li key={card.race_name}>
              <Link
                href={`/races/${card.slug}`}
                className="group block rounded-lg border border-tryka-navy-light bg-tryka-navy-light p-4 shadow-sm transition hover:border-tryka-green focus:outline-none focus:ring-1 focus:ring-tryka-green"
              >
                <h2 className="text-sm font-semibold uppercase tracking-wide group-hover:text-tryka-green">
                  {card.race_name}
                </h2>
                {card.intro ? (
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-400">
                    {card.intro}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
