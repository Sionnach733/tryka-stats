"use client";

import { useState } from "react";
import ComparisonChart from "./ComparisonChart";
import ComparisonTable from "./ComparisonTable";
import type { CompareSplit } from "./ComparisonChart";

export type { CompareSplit };

export default function ComparisonSplits({
  splits,
  primaryName,
  primaryRace,
  secondaryName,
  secondaryRace,
}: {
  splits: CompareSplit[];
  primaryName: string;
  primaryRace: string;
  secondaryName: string;
  secondaryRace: string;
}) {
  const [view, setView] = useState<"chart" | "table">("chart");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Race Comparison</h3>
        </div>
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setView("chart")}
            className={`px-3 py-1.5 text-xs font-medium rounded-l-lg ${
              view === "chart"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-3 py-1.5 text-xs font-medium rounded-r-lg ${
              view === "table"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            Table
          </button>
        </div>
      </div>

      <div className="mt-4">
        {view === "chart" ? (
          <ComparisonChart
            splits={splits}
            primaryName={primaryName}
            secondaryName={secondaryName}
          />
        ) : (
          <ComparisonTable
            splits={splits}
            primaryName={primaryName}
            primaryRace={primaryRace}
            secondaryName={secondaryName}
            secondaryRace={secondaryRace}
          />
        )}
      </div>
    </div>
  );
}
