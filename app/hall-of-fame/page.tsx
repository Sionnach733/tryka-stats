import type { Metadata } from "next";
import Link from "next/link";
import {
  canonicalDivision,
  getDivisionRecords,
  getRecordEligibleDivisions,
} from "@/lib/queries";
import { displayGender, displayMembers, parseMembers } from "@/lib/format";

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

      <form method="GET" className="mb-6 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-slate-400">
            Division
          </span>
          <select
            name="division"
            defaultValue={selected}
            className="rounded-lg border border-tryka-navy-light bg-tryka-navy-light px-3 py-2 text-sm text-white shadow-sm focus:border-tryka-green focus:outline-none focus:ring-1 focus:ring-tryka-green"
          >
            {divisions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-md bg-tryka-green px-3 py-1.5 text-sm font-medium text-tryka-navy hover:bg-tryka-green/90"
        >
          Show records
        </button>
      </form>

      {records.length === 0 ? (
        <p className="text-sm text-slate-400">
          No records yet for this division.
        </p>
      ) : (
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
      )}
    </div>
  );
}
