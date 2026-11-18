"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { SearchHit } from "@/lib/queries";
import { addResultAction } from "@/app/athletes/actions";
import { parseMembers } from "@/lib/format";

export default function AddResultSearch({ claimedIds }: { claimedIds: string[] }) {
  const [value, setValue] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const abortRef = useRef<AbortController | null>(null);
  const claimed = new Set(claimedIds);

  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed.length < 3) {
      setHits([]);
      return;
    }
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const res = await fetch(`/api/results-search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (res.ok) setHits(await res.json());
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [value]);

  const add = (resultId: number, memberIndex: number) =>
    startTransition(async () => {
      setMessage(null);
      const res = await addResultAction(resultId, memberIndex);
      setMessage(res.ok ? { ok: true, text: "Result added to your profile." } : { ok: false, text: res.error });
    });

  return (
    <div>
      <h3 className="text-xs uppercase tracking-wide text-slate-400">Add a missing result</h3>
      <p className="mt-1 text-sm text-slate-400">
        Results filed under a misspelled name won&apos;t appear automatically. Search for the
        name as it was entered and pick yourself.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Name as entered on the result"
          aria-label="Search results to add"
          className="flex-1 rounded-lg border border-tryka-navy-light bg-tryka-navy-light px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-400 focus:border-tryka-green focus:outline-none focus:ring-1 focus:ring-tryka-green"
        />
        {loading && <span className="self-center text-sm text-tryka-green">Searching…</span>}
      </div>
      {message && (
        <p className={`mt-2 text-sm ${message.ok ? "text-tryka-green" : "text-rose-400"}`}>
          {message.text}
        </p>
      )}
      {hits.length > 0 && (
        <ul className="mt-3 max-h-96 divide-y divide-tryka-navy-light overflow-y-auto rounded-lg border border-tryka-navy-light">
          {hits.map((hit) => (
            <li key={hit.id} className="px-3 py-2 text-sm">
              <div className="flex justify-between gap-3">
                <span>
                  {hit.race_name} <span className="text-slate-400">· {hit.division}</span>
                </span>
                <span className="tabular-nums text-slate-400">{hit.overall_time ?? "—"}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                {parseMembers(hit.members).map((name, i) =>
                  claimed.has(`${hit.id}:${i}`) ? (
                    <span key={i} className="px-2 py-1 text-xs text-slate-500">
                      {name} (on your profile)
                    </span>
                  ) : (
                    <button
                      key={i}
                      type="button"
                      disabled={pending}
                      onClick={() => add(hit.id, i)}
                      className="rounded-md border border-tryka-navy-light px-2 py-1 text-xs font-medium text-slate-400 hover:bg-tryka-navy-light hover:text-tryka-green disabled:opacity-50"
                    >
                      + I&apos;m {name}
                    </button>
                  ),
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
