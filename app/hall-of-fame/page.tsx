import type { Metadata } from "next";
import Link from "next/link";
import {
  canonicalDivision,
  getDivisionRecords,
  getRecordEligibleDivisions,
  isRetiredAgeGroup,
  type DivisionRecord,
} from "@/lib/queries";
import { displayGender, displayMembers, parseMembers } from "@/lib/format";
import DivisionSelect from "@/app/components/DivisionSelect";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hall of Fame",
  description:
    "Course records by division, gender, and age group across all Tryka races.",
};

const DEFAULT_DIVISION = "TRYKA PRO";
const GENDER_ORDER: Record<string, number> = { M: 0, W: 1, X: 2 };

function ageGroupSortKey(ag: string | null): [number, string] {
  if (!ag) return [Number.POSITIVE_INFINITY, ""];
  const m = ag.match(/(\d+)/);
  return [m ? Number(m[1]) : Number.POSITIVE_INFINITY, ag];
}

function RecordsTable({ records }: { records: DivisionRecord[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-tryka-navy-light">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-tryka-navy-light text-left text-xs uppercase tracking-wide text-slate-400">
            <th className="px-3 py-2">Athlete</th>
            <th className="px-3 py-2">Race</th>
            <th className="px-3 py-2">Gender</th>
            <th className="px-3 py-2">Age Group</th>
            <th className="px-3 py-2 text-right">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-tryka-navy-light">
          {records.map((r) => (
            <tr key={r.id} className="hover:bg-tryka-navy-light/50">
              <td className="px-3 py-2 font-medium">
                <Link
                  href={`/results/${r.id}`}
                  className="text-tryka-green hover:underline"
                >
                  {displayMembers(parseMembers(r.members))}
                </Link>
              </td>
              <td className="px-3 py-2">{r.race_name}</td>
              <td className="px-3 py-2">{displayGender(r.gender)}</td>
              <td className="px-3 py-2">{r.age_group ?? "—"}</td>
              <td className="px-3 py-2 text-right tabular-nums">
                {r.overall_time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function HallOfFamePage({
  searchParams,
}: {
  searchParams: Promise<{ division?: string }>;
}) {
  const params = await searchParams;
  const divisions = getRecordEligibleDivisions();
  const requested = params.division ? canonicalDivision(params.division) : null;
  const selected =
    requested && divisions.includes(requested) ? requested : DEFAULT_DIVISION;

  const records = getDivisionRecords(selected).sort((a, b) => {
    const g =
      (GENDER_ORDER[a.gender ?? ""] ?? 99) -
      (GENDER_ORDER[b.gender ?? ""] ?? 99);
    if (g !== 0) return g;
    const [an, as] = ageGroupSortKey(a.age_group);
    const [bn, bs] = ageGroupSortKey(b.age_group);
    return an - bn || as.localeCompare(bs);
  });
  const current = records.filter((r) => !isRetiredAgeGroup(selected, r.age_group));
  const retired = records.filter((r) => isRetiredAgeGroup(selected, r.age_group));

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-tryka-green">
          Hall of Fame
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Course records by gender and age group, taken from the fastest time
          across every Tryka race to date.
        </p>
      </header>

      <div className="mb-6">
        <DivisionSelect divisions={divisions} selected={selected} />
      </div>

      {current.length === 0 ? (
        <p className="text-sm text-slate-400">
          No records yet for this division.
        </p>
      ) : (
        <RecordsTable records={current} />
      )}

      {retired.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold">Series 1 age groups</h2>
          <p className="mt-1 text-sm text-slate-400">
            Doubles used 10-year age groups in Series 1. These records stand
            but can no longer be beaten.
          </p>
          <div className="mt-4">
            <RecordsTable records={retired} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
