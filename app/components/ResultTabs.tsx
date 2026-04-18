"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

type Tab = "workout" | "splits" | "stations";

const VALID_TABS = new Set<Tab>(["workout", "splits", "stations"]);

function parseTab(value: string | null): Tab {
  return value && VALID_TABS.has(value as Tab) ? (value as Tab) : "workout";
}

export default function ResultTabs({
  workoutContent,
  splitsContent,
  stationsContent,
}: {
  workoutContent: React.ReactNode;
  splitsContent: React.ReactNode;
  stationsContent: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState<Tab>(parseTab(searchParams.get("tab")));

  function switchTab(tab: Tab) {
    setActive(tab);
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "workout") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }

  return (
    <div>
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <TabButton
          label="Workout Result"
          active={active === "workout"}
          onClick={() => switchTab("workout")}
        />
        <TabButton
          label="Splits"
          active={active === "splits"}
          onClick={() => switchTab("splits")}
        />
        <TabButton
          label="Stations"
          active={active === "stations"}
          onClick={() => switchTab("stations")}
        />
      </div>
      <div className="mt-4">
        {active === "stations"
          ? stationsContent
          : active === "splits"
            ? splitsContent
            : workoutContent}
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
