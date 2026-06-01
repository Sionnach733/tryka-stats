"use client";

import { useState } from "react";
import RunsGrid from "./RunsGrid";
import type { RunData } from "./RunsGrid";

type Filter = "overall" | "ageGroup";

export default function RunsTab({
  overall,
  byAgeGroup,
  ageGroupLabel,
}: {
  overall: RunData[];
  byAgeGroup: RunData[] | null;
  ageGroupLabel: string | null;
}) {
  const [filter, setFilter] = useState<Filter>("overall");

  const showToggle = byAgeGroup != null && ageGroupLabel != null && ageGroupLabel.length > 0;
  const active = filter === "ageGroup" && showToggle ? byAgeGroup! : overall;

  return (
    <div>
      {showToggle && (
        <FilterToggle
          filter={filter}
          ageGroupLabel={ageGroupLabel!}
          onChange={setFilter}
        />
      )}
      <RunsGrid runs={active} />
    </div>
  );
}

function FilterToggle({
  filter,
  ageGroupLabel,
  onChange,
}: {
  filter: Filter;
  ageGroupLabel: string;
  onChange: (f: Filter) => void;
}) {
  return (
    <div className="mb-4 inline-flex rounded-md border border-tryka-navy-light bg-tryka-navy-light p-1">
      <ToggleButton
        label="Overall"
        active={filter === "overall"}
        onClick={() => onChange("overall")}
      />
      <ToggleButton
        label={ageGroupLabel}
        active={filter === "ageGroup"}
        onClick={() => onChange("ageGroup")}
      />
    </div>
  );
}

function ToggleButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors ${
        active
          ? "bg-tryka-green text-tryka-navy"
          : "text-slate-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
