"use client";

import { useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import {
  excludeEntryAction,
  includeEntryAction,
  releaseAthleteAction,
  removeManualAction,
} from "@/app/athletes/actions";
import type { ClaimResult } from "@/lib/claims";

export type ManageRow = {
  resultId: number;
  memberIndex: number;
  name: string;
  raceName: string;
  division: string;
  members: string;
  overallTime: string | null;
  status: "mine" | "excluded" | "taken" | "manual";
};

export type OwnedGroup = { slug: string; name: string };

export default function ManageResults({
  rows,
  groups,
}: {
  rows: ManageRow[];
  groups: OwnedGroup[];
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Tick/untick immediately; the server action's revalidation settles it.
  const [optimisticRows, setRowStatus] = useOptimistic(
    rows,
    (current, change: { id: string; status: ManageRow["status"] }) =>
      current.map((r) =>
        `${r.resultId}:${r.memberIndex}` === change.id ? { ...r, status: change.status } : r,
      ),
  );

  const run = (fn: () => Promise<ClaimResult>) =>
    startTransition(async () => {
      setError(null);
      const res = await fn();
      if (!res.ok) setError(res.error);
    });

  const groupRows = optimisticRows.filter((r) => r.status !== "manual");
  const manualRows = optimisticRows.filter((r) => r.status === "manual");

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
          {error}
        </p>
      )}

      <div>
        <h3 className="text-xs uppercase tracking-wide text-slate-400">
          Results under your name
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          Untick any results that belong to someone else with the same name.
        </p>
        <ul className="mt-3 divide-y divide-tryka-navy-light rounded-lg border border-tryka-navy-light">
          {groupRows.map((r) => (
            <li
              key={`${r.resultId}:${r.memberIndex}`}
              className="flex items-center gap-3 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                aria-label={`${r.raceName} ${r.division}`}
                checked={r.status === "mine"}
                disabled={r.status === "taken"}
                onChange={(ev) => {
                  const checked = ev.target.checked;
                  startTransition(async () => {
                    setError(null);
                    setRowStatus({
                      id: `${r.resultId}:${r.memberIndex}`,
                      status: checked ? "mine" : "excluded",
                    });
                    const res = checked
                      ? await includeEntryAction(r.resultId, r.memberIndex)
                      : await excludeEntryAction(r.resultId, r.memberIndex);
                    if (!res.ok) setError(res.error);
                  });
                }}
                className="h-4 w-4 accent-tryka-green"
              />
              <Link href={`/results/${r.resultId}`} className="flex-1 hover:text-tryka-green">
                {r.raceName} <span className="text-slate-400">· {r.division}</span>
                <span className="block text-xs text-slate-500">{r.members}</span>
              </Link>
              <span className="tabular-nums text-slate-400">{r.overallTime ?? "—"}</span>
              {r.status === "taken" && (
                <span className="text-xs text-slate-500">Claimed by another athlete</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {manualRows.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wide text-slate-400">Results you added</h3>
          <ul className="mt-3 divide-y divide-tryka-navy-light rounded-lg border border-tryka-navy-light">
            {manualRows.map((r) => (
              <li
                key={`${r.resultId}:${r.memberIndex}`}
                className="flex items-center gap-3 px-3 py-2 text-sm"
              >
                <Link href={`/results/${r.resultId}`} className="flex-1 hover:text-tryka-green">
                  {r.raceName} <span className="text-slate-400">· {r.division}</span>
                  <span className="block text-xs text-slate-500">
                    Listed as {r.name}
                  </span>
                </Link>
                <span className="tabular-nums text-slate-400">{r.overallTime ?? "—"}</span>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => run(() => removeManualAction(r.resultId, r.memberIndex))}
                  className="rounded-md border border-tryka-navy-light px-3 py-1.5 text-sm font-medium text-slate-400 hover:bg-tryka-navy-light disabled:opacity-50"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-xs uppercase tracking-wide text-slate-400">Names you&apos;ve claimed</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {groups.map((g) => (
            <li
              key={g.slug}
              className="flex items-center gap-2 rounded-md border border-tryka-navy-light px-3 py-1.5 text-sm"
            >
              {g.name}
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (window.confirm(`Release "${g.name}"? Its results will be removed from your profile.`)) {
                    run(() => releaseAthleteAction(g.slug));
                  }
                }}
                className="text-xs text-slate-400 hover:text-rose-400"
              >
                Release
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
