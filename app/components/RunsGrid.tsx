import RunCard from "./RunCard";
import type { RunData } from "./RunCard";

export type { RunData };

export default function RunsGrid({ runs }: { runs: RunData[] }) {
  if (runs.length === 0) {
    return <p className="text-sm text-slate-500">No run data available.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {runs.map((r) => (
        <RunCard key={r.run} data={r} />
      ))}
    </div>
  );
}
