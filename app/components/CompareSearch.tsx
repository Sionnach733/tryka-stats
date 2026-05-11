"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { SearchHit } from "@/lib/queries";
import { displayMembers, parseMembers } from "@/lib/format";

export default function CompareSearch({
  currentId,
  onClose,
}: {
  currentId: number;
  onClose: () => void;
}) {
  const [value, setValue] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

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
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal },
        );
        if (res.ok) {
          const data: SearchHit[] = await res.json();
          setHits(data.filter((h) => h.id !== currentId));
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [value, currentId]);

  const handleSelect = (id: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("compare", String(id));
    router.push(`${pathname}?${params.toString()}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-lg border border-tryka-navy-light bg-tryka-navy shadow-xl">
        <div className="border-b border-tryka-navy-light p-4">
          <h3 className="text-sm font-semibold">Search for an athlete to compare</h3>
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search by athlete name…"
            className="mt-2 w-full rounded-lg border border-tryka-navy-light bg-tryka-navy-light px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-400 focus:border-tryka-green focus:outline-none focus:ring-1 focus:ring-tryka-green"
          />
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <p className="px-4 py-3 text-sm text-slate-400">Searching…</p>
          )}

          {!loading && value.trim().length >= 3 && hits.length === 0 && (
            <p className="px-4 py-3 text-sm text-slate-400">No results found.</p>
          )}

          {hits.map((hit) => (
            <button
              key={hit.id}
              onClick={() => handleSelect(hit.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-tryka-navy-light"
            >
              <div>
                <div className="font-medium">
                  {displayMembers(parseMembers(hit.members))}
                </div>
                <div className="text-xs text-slate-500">
                  {hit.race_name} · {hit.division}
                </div>
              </div>
              <div className="tabular-nums text-slate-500">
                {hit.overall_time ?? "—"}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
