"use client";

import { useState, useRef } from "react";
import { formatDiff, formatMmSs } from "@/lib/format";

export interface CompareSplit {
  splitName: string;
  primaryTime: number | null;
  secondaryTime: number | null;
}

export default function ComparisonChart({
  splits,
  primaryName,
  secondaryName,
}: {
  splits: CompareSplit[];
  primaryName: string;
  secondaryName: string;
}) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const diffs = splits.map((s) => {
    if (s.primaryTime == null || s.secondaryTime == null) return 0;
    return s.primaryTime - s.secondaryTime;
  });

  const maxAbs = Math.max(...diffs.map(Math.abs), 1);
  // Round up to a nice axis range
  const axisMax = Math.ceil(maxAbs / 5) * 5 + 5;

  const rowHeight = 32;
  const labelWidth = 160;
  const diffLabelWidth = 60;
  const chartWidth = 600;
  const barAreaWidth = chartWidth - labelWidth - diffLabelWidth;
  const centerX = labelWidth + barAreaWidth / 2;
  const height = splits.length * rowHeight + 40; // +40 for x-axis

  const scale = (seconds: number) =>
    (seconds / axisMax) * (barAreaWidth / 2);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * (chartWidth + diffLabelWidth);
    const svgY = ((e.clientY - rect.top) / rect.height) * height;
    const rowIdx = Math.floor(svgY / rowHeight);
    if (rowIdx >= 0 && rowIdx < splits.length) {
      const s = splits[rowIdx];
      const diff = diffs[rowIdx];
      const lines = [s.splitName];
      if (s.primaryTime != null) lines.push(`${primaryName}: ${formatMmSs(s.primaryTime)}`);
      if (s.secondaryTime != null) lines.push(`${secondaryName}: ${formatMmSs(s.secondaryTime)}`);
      if (s.primaryTime != null && s.secondaryTime != null) lines.push(`Diff: ${formatDiff(diff)}`);
      setTooltip({
        x: svgX,
        y: rowIdx * rowHeight,
        text: lines.join("\n"),
      });
    } else {
      setTooltip(null);
    }
  };

  // Generate tick marks
  const ticks: number[] = [];
  for (let t = -axisMax; t <= axisMax; t += Math.max(Math.round(axisMax / 4), 1)) {
    ticks.push(t);
  }

  return (
    <div className="overflow-x-auto">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${chartWidth + diffLabelWidth} ${height}`}
        className="w-full"
        style={{ minWidth: 500 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Center line */}
        <line
          x1={centerX}
          y1={0}
          x2={centerX}
          y2={splits.length * rowHeight}
          stroke="currentColor"
          className="text-slate-500"
          strokeWidth={1}
        />

        {/* Grid lines and x-axis ticks */}
        {ticks.map((t) => {
          const x = centerX + scale(t);
          return (
            <g key={t}>
              <line
                x1={x}
                y1={0}
                x2={x}
                y2={splits.length * rowHeight}
                stroke="currentColor"
                className="text-tryka-navy-light"
                strokeWidth={0.5}
              />
              <text
                x={x}
                y={splits.length * rowHeight + 20}
                textAnchor="middle"
                className="fill-slate-500 text-[10px]"
              >
                {t > 0 ? `+${t}s` : t < 0 ? `${t}s` : "0s"}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {splits.map((s, i) => {
          const diff = diffs[i];
          const barWidth = Math.abs(scale(diff));
          const barX = diff >= 0 ? centerX : centerX - barWidth;
          const y = i * rowHeight + 4;
          const barH = rowHeight - 8;
          const hasBothTimes =
            s.primaryTime != null && s.secondaryTime != null;
          const isPositive = diff >= 0;

          return (
            <g key={s.splitName}>
              {/* Row background on hover */}
              <rect
                x={0}
                y={i * rowHeight}
                width={chartWidth + diffLabelWidth}
                height={rowHeight}
                fill="transparent"
              />

              {/* Split name label */}
              <text
                x={labelWidth - 8}
                y={y + barH / 2 + 4}
                textAnchor="end"
                className="fill-slate-300 text-[11px]"
              >
                {s.splitName}
              </text>

              {/* Bar */}
              {hasBothTimes && diff !== 0 && (
                <rect
                  x={barX}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx={3}
                  className={
                    isPositive
                      ? "fill-rose-500"
                      : "fill-tryka-green"
                  }
                />
              )}

              {/* Diff label */}
              {hasBothTimes && (
                <text
                  x={
                    diff >= 0
                      ? centerX + barWidth + 6
                      : centerX - barWidth - 6
                  }
                  y={y + barH / 2 + 4}
                  textAnchor={diff >= 0 ? "start" : "end"}
                  className={`text-[10px] font-medium ${
                    diff > 0
                      ? "fill-rose-500"
                      : diff < 0
                        ? "fill-tryka-green"
                        : "fill-slate-400"
                  }`}
                >
                  {formatDiff(diff)}
                </text>
              )}

              {!hasBothTimes && (
                <text
                  x={centerX}
                  y={y + barH / 2 + 4}
                  textAnchor="middle"
                  className="fill-slate-400 text-[10px]"
                >
                  —
                </text>
              )}
            </g>
          );
        })}

        {/* Tooltip */}
        {tooltip && (() => {
          const lines = tooltip.text.split("\n");
          const tooltipH = 10 + lines.length * 16;
          const tx = Math.min(tooltip.x + 10, chartWidth - 180);
          const ty = Math.max(tooltip.y - tooltipH / 2, 0);
          return (
            <g>
              <rect
                x={tx}
                y={ty}
                width={200}
                height={tooltipH}
                rx={4}
                className="fill-tryka-navy-light"
                opacity={0.9}
              />
              {lines.map((line, i) => (
                <text
                  key={i}
                  x={tx + 8}
                  y={ty + 16 + i * 16}
                  className={`fill-white text-[10px] ${i === 0 ? "font-semibold" : ""}`}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
