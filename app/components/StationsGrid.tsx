"use client";

import StationCard from "./StationCard";
import type { StationData } from "./StationCard";

export type { StationData };

export default function StationsGrid({ stations }: { stations: StationData[] }) {
  if (stations.length === 0) {
    return <p className="text-sm text-slate-500">No station data available.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {stations.map((s) => (
        <StationCard key={s.station} data={s} />
      ))}
    </div>
  );
}
