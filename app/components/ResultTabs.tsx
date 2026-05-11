"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

type Tab = "workout" | "splits" | "stations" | "runs";

const VALID_TABS = new Set<Tab>(["workout", "splits", "stations", "runs"]);

function parseTab(value: string | null): Tab {
  return value && VALID_TABS.has(value as Tab) ? (value as Tab) : "workout";
}

export default function ResultTabs({
  workoutContent,
  splitsContent,
  stationsContent,
  runsContent,
}: {
  workoutContent: React.ReactNode;
  splitsContent: React.ReactNode;
  stationsContent: React.ReactNode;
  runsContent: React.ReactNode;
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
      <div className="flex border-b border-tryka-navy-light">
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
        <TabButton
          label="Runs"
          active={active === "runs"}
          onClick={() => switchTab("runs")}
        />
      </div>
      <div className="mt-4">
        {active === "stations"
          ? stationsContent
          : active === "runs"
            ? runsContent
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
          ? "border-b-2 border-tryka-green text-tryka-green"
          : "text-slate-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
