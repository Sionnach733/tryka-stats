import { parseTime, formatDiff } from "@/lib/format";

export interface ComparisonTotals {
  overallTime: string | null;
  runTotal: string | null;
  workoutTotal: string | null;
  tryZone: string | null;
}

export default function ComparisonTiles({
  primary,
  secondary,
}: {
  primary: ComparisonTotals;
  secondary: ComparisonTotals;
}) {
  const metrics = [
    { label: "Overall Time", a: primary.overallTime, b: secondary.overallTime },
    { label: "Run Total", a: primary.runTotal, b: secondary.runTotal },
    { label: "Workout Total", a: primary.workoutTotal, b: secondary.workoutTotal },
    { label: "TRY Zone", a: primary.tryZone, b: secondary.tryZone },
  ];

  const cards = metrics
    .filter((m) => m.a != null || m.b != null)
    .map((m) => {
      const aSecs = parseTime(m.a);
      const bSecs = parseTime(m.b);
      const diff = aSecs != null && bSecs != null ? aSecs - bSecs : null;
      return { label: m.label, diff, a: m.a, b: m.b };
    });

  if (cards.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold">Key Totals</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Top-level times compared side by side (positive = first athlete is slower)
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="text-xs uppercase tracking-wide text-slate-500">
              {c.label}
            </div>
            <div
              className={`mt-1 text-2xl font-bold tabular-nums ${
                c.diff == null
                  ? "text-slate-400"
                  : c.diff < 0
                    ? "text-emerald-500"
                    : c.diff > 0
                      ? "text-rose-500"
                      : "text-slate-400"
              }`}
            >
              {c.diff != null ? formatDiff(c.diff) : "—"}
            </div>
            <div className="mt-1 text-xs tabular-nums text-slate-500">
              {c.a ?? "—"} vs {c.b ?? "—"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
