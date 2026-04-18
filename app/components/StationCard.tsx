"use client";

import { formatMmSs, computeKde } from "@/lib/format";

export interface StationData {
  station: string;
  time: number | null;
  rank: number | null;
  totalCompetitors: number;
  percentile: number | null;
  fieldTimes: number[];
  xMin: number;
  xMax: number;
}

export default function StationCard({ data }: { data: StationData }) {
  const { station, time, rank, totalCompetitors, percentile, fieldTimes, xMin, xMax } = data;

  const rankBorder =
    rank === 1
      ? "border-l-4 border-l-yellow-400"
      : rank === 2
        ? "border-l-4 border-l-slate-400"
        : rank === 3
          ? "border-l-4 border-l-amber-700"
          : "";

  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${rankBorder}`}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide">
        {station}
      </h3>

      <div className="mt-2 flex items-baseline gap-4 text-sm">
        <span className="font-semibold">
          {rank != null ? `#${rank} of ${totalCompetitors}` : "N/A"}
        </span>
        <span className="tabular-nums">
          {time != null ? formatMmSs(time) : "N/A"}
        </span>
        {percentile != null && (
          <span className="text-slate-500 dark:text-slate-400">
            top {percentile.toFixed(1)}%
          </span>
        )}
      </div>

      {fieldTimes.length > 0 && (
        <KdePlot fieldTimes={fieldTimes} athleteTime={time} xMin={xMin} xMax={xMax} />
      )}
    </div>
  );
}

function KdePlot({
  fieldTimes,
  athleteTime,
  xMin,
  xMax,
}: {
  fieldTimes: number[];
  athleteTime: number | null;
  xMin: number;
  xMax: number;
}) {
  const points = computeKde(fieldTimes, xMin, xMax, 100);
  if (points.length === 0) return null;

  const maxDensity = Math.max(...points.map((p) => p.density));
  if (maxDensity === 0) return null;

  const range = xMax - xMin || 1;
  const svgW = 300;
  const svgH = 64;
  const pad = 0;

  // Build SVG path: area fill from baseline
  const toX = (x: number) => pad + ((x - xMin) / range) * (svgW - 2 * pad);
  const toY = (d: number) => svgH - (d / maxDensity) * svgH;

  const linePoints = points.map((p) => `${toX(p.x)},${toY(p.density)}`);
  const areaPath = `M${toX(xMin)},${svgH} L${linePoints.join(" L")} L${toX(xMax)},${svgH} Z`;

  const athleteX =
    athleteTime != null
      ? toX(Math.min(Math.max(athleteTime, xMin), xMax))
      : null;

  return (
    <div
      className="mt-3"
      role="img"
      aria-label={
        athleteTime != null
          ? `Distribution of ${fieldTimes.length} competitors, your time ${formatMmSs(athleteTime)}`
          : `Distribution of ${fieldTimes.length} competitors`
      }
    >
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full"
        preserveAspectRatio="none"
        style={{ height: "4rem" }}
      >
        <path
          d={areaPath}
          className="fill-slate-200 dark:fill-slate-700"
        />
        {athleteX != null && (
          <line
            x1={athleteX}
            y1={0}
            x2={athleteX}
            y2={svgH}
            className="stroke-blue-600 dark:stroke-blue-400"
            strokeWidth={2}
          >
            <title>Your time: {formatMmSs(athleteTime!)}</title>
          </line>
        )}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] tabular-nums text-slate-400">
        <span>{formatMmSs(xMin)}</span>
        <span>{formatMmSs(xMax)}</span>
      </div>
    </div>
  );
}
