"use client";

import { useState } from "react";

type Tab = "workout" | "splits";

export default function ResultTabs({
  workoutContent,
  splitsContent,
}: {
  workoutContent: React.ReactNode;
  splitsContent: React.ReactNode;
}) {
  const [active, setActive] = useState<Tab>("workout");

  return (
    <div>
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <TabButton
          label="Workout Result"
          active={active === "workout"}
          onClick={() => setActive("workout")}
        />
        <TabButton
          label="Splits"
          active={active === "splits"}
          onClick={() => setActive("splits")}
        />
      </div>
      <div className="mt-4">
        {active === "workout" ? workoutContent : splitsContent}
      </div>
    </div>
  );
}

function TabButton({
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
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
          : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      }`}
    >
      {label}
    </button>
  );
}
