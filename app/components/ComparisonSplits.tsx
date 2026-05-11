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
        <div className="flex rounded-lg border border-tryka-navy-light">
          <button
            onClick={() => setView("chart")}
            className={`px-3 py-1.5 text-xs font-medium rounded-l-lg ${
              view === "chart"
                ? "bg-tryka-green text-tryka-navy"
                : "text-slate-400 hover:bg-tryka-navy-light"
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-3 py-1.5 text-xs font-medium rounded-r-lg ${
              view === "table"
                ? "bg-tryka-green text-tryka-navy"
                : "text-slate-400 hover:bg-tryka-navy-light"
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
