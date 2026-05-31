"use client";

import { useState } from "react";

export type GenderKey = "Men" | "Women" | "Mixed";
export type StationRow = { gender: GenderKey; sec: number };
export type StationData = { station: string; rows: StationRow[] };

export type StationsByDivision = {
  division: string;
  data: StationData[];
};

export default function StationPicker({ divisions }: { divisions: StationsByDivision[] }) {
  const [selected, setSelected] = useState<string>(divisions[0]?.division ?? "");
  const current = divisions.find((d) => d.division === selected) ?? divisions[0];

  if (!current) return null;

  return (
    <div>
      <label className="block">
        <span className="text-xs uppercase tracking-wide text-slate-400">Division</span>
        <select
          className="mt-2 block w-full max-w-xs rounded-lg border border-tryka-navy-light bg-tryka-navy-light px-3 py-2 text-sm text-white shadow-sm focus:border-tryka-green focus:outline-none focus:ring-1 focus:ring-tryka-green"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {divisions.map((d) => (
            <option key={d.division} value={d.division}>
              {d.division}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-6">
        <DivisionStationChart division={current.division} data={current.data} />
      </div>
    </div>
  );
}

const GENDER_ORDER: GenderKey[] = ["Men", "Women", "Mixed"];

function opacityFor(g: GenderKey): number {
  return g === "Men" ? 1 : g === "Women" ? 0.55 : 0.3;
}

function DivisionStationChart({
  division,
  data,
}: {
  division: string;
  data: StationData[];
}) {
  const maxSec = Math.max(...data.flatMap((s) => s.rows.map((r) => r.sec)));
  const BAR_W = 480;
  const ROW_H = 18;
  const ROW_GAP = 3;
  const STATION_GAP = 14;
  const LABEL_W = 170;
  const xW = (s: number) => Math.round((s / maxSec) * BAR_W);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  let cursor = 8;
  const placed = data.map((s) => {
    const top = cursor;
    const height = s.rows.length * ROW_H + (s.rows.length - 1) * ROW_GAP;
    cursor = top + height + STATION_GAP;
    return { ...s, top, height };
  });
  const totalH = cursor + 30;

  // Only show legend entries for genders that actually appear in this division's data.
  // Individual formats (no Mixed teams) don't include Mixed rows, so the swatch is hidden.
  const presentGenders = GENDER_ORDER.filter((g) =>
    data.some((s) => s.rows.some((r) => r.gender === g)),
  );

  return (
    <div className="rounded-lg border border-tryka-navy-light bg-tryka-navy-light p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-tryka-green">
        {division}
      </h3>
      <svg viewBox={`0 0 720 ${totalH}`} className="w-full" role="img" aria-label={`${division} station times`}>
        <g transform={`translate(${LABEL_W}, 0)`}>
          {placed.map((s) => (
            <g key={s.station}>
              <text
                x={-10}
                y={s.top + s.height / 2 + 5}
                textAnchor="end"
                fill="#ffffff"
                fontSize="13"
              >
                {s.station}
              </text>
              {s.rows.map((r, ri) => {
                const ry = s.top + ri * (ROW_H + ROW_GAP);
                return (
                  <g key={r.gender}>
                    <rect
                      x={0}
                      y={ry}
                      width={xW(r.sec)}
                      height={ROW_H}
                      fill="#06e38b"
                      fillOpacity={opacityFor(r.gender)}
                    />
                    <text
                      x={xW(r.sec) + 6}
                      y={ry + ROW_H - 4}
                      fill="#ffffff"
                      fontSize="11"
                      className="tabular-nums"
                    >
                      {fmt(r.sec)}
                    </text>
                  </g>
                );
              })}
            </g>
          ))}
        </g>
        <g transform={`translate(20, ${cursor + 10})`}>
          {presentGenders.map((g, i) => (
            <g key={g} transform={`translate(${i * 70}, 0)`}>
              <rect width={11} height={11} fill="#06e38b" fillOpacity={opacityFor(g)} />
              <text x={16} y={10} fill="#94a3b8" fontSize="11">
                {g}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
