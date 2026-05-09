"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import { formatMmSs, computeKde } from "@/lib/format";

export interface RunData {
  run: string;
  time: number | null;
  rank: number | null;
  totalCompetitors: number;
  percentile: number | null;
  fieldTimes: number[];
  xMin: number;
  xMax: number;
}

export default function RunCard({ data }: { data: RunData }) {
  const { run, time, rank, totalCompetitors, percentile, fieldTimes, xMin, xMax } = data;

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
        {run}
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
  const svgW = 300;
  const svgH = 64;

  const points = useMemo(
    () => computeKde(fieldTimes, xMin, xMax, 100),
    [fieldTimes, xMin, xMax],
  );

  const sorted = useMemo(
    () => [...fieldTimes].sort((a, b) => a - b),
    [fieldTimes],
  );

  const { maxDensity, range, toX, toY, fromX, areaPath, athleteX } = useMemo(() => {
    const maxD = Math.max(...points.map((p) => p.density));
    const r = xMax - xMin || 1;
    const tx = (x: number) => ((x - xMin) / r) * svgW;
    const ty = (d: number) => svgH - (d / maxD) * svgH;
    const fx = (svgX: number) => xMin + (svgX / svgW) * r;
    const linePoints = points.map((p) => `${tx(p.x)},${ty(p.density)}`);
    const ap = `M${tx(xMin)},${svgH} L${linePoints.join(" L")} L${tx(xMax)},${svgH} Z`;
    const ax = athleteTime != null ? tx(Math.min(Math.max(athleteTime, xMin), xMax)) : null;
    return { maxDensity: maxD, range: r, toX: tx, toY: ty, fromX: fx, areaPath: ap, athleteX: ax };
  }, [points, xMin, xMax, athleteTime]);

  if (points.length === 0) return null;
  if (maxDensity === 0) return null;

  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ svgX: number; time: number; pct: number } | null>(null);

  const handlePointer = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const frac = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      const svgX = frac * svgW;
      const time = Math.round(fromX(svgX));
      let faster = 0;
      for (const t of sorted) {
        if (t < time) faster++;
        else break;
      }
      const rank = faster + 1;
      const pct = (rank / sorted.length) * 100;
      setHover({ svgX, time, pct });
    },
    [sorted, svgW, fromX],
  );

  return (
    <div
      ref={containerRef}
      className="mt-3"
      role="img"
      aria-label={
        athleteTime != null
          ? `Distribution of ${fieldTimes.length} competitors, your time ${formatMmSs(athleteTime)}`
          : `Distribution of ${fieldTimes.length} competitors`
      }
      onMouseMove={(e) => handlePointer(e.clientX)}
      onMouseLeave={() => setHover(null)}
      onTouchMove={(e) => handlePointer(e.touches[0].clientX)}
      onTouchEnd={() => setHover(null)}
    >
      <div className="relative">
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
          {hover && (
            <line
              x1={hover.svgX}
              y1={0}
              x2={hover.svgX}
              y2={svgH}
              className="stroke-slate-400 dark:stroke-slate-500"
              strokeWidth={1}
              strokeDasharray="3 2"
            />
          )}
        </svg>
        {hover && (
          <div
            className="pointer-events-none absolute -top-10 z-10 rounded bg-slate-800 px-2 py-1 text-[11px] tabular-nums text-white shadow dark:bg-slate-200 dark:text-slate-900"
            style={{
              left: `${(hover.svgX / svgW) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            {formatMmSs(hover.time)} · top {hover.pct.toFixed(1)}%
          </div>
        )}
      </div>
      <div className="mt-1 flex justify-between text-[10px] tabular-nums text-slate-400">
        <span>{formatMmSs(xMin)}</span>
        <span>{formatMmSs(xMax)}</span>
      </div>
    </div>
  );
}
