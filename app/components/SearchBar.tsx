"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { SearchHit } from "@/lib/queries";
import ResultsTable from "./ResultsTable";

export default function SearchBar({
  initialQuery = "",
  initialHits = [],
}: {
  initialQuery?: string;
  initialHits?: SearchHit[];
}) {
  const [value, setValue] = useState(initialQuery);
  const [hits, setHits] = useState<SearchHit[]>(initialHits);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const abortRef = useRef<AbortController | null>(null);
  const router = useRouter();

  useEffect(() => {
    const trimmed = value.trim();

    if (trimmed.length < 3) {
      setHits([]);
      setHasSearched(false);
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
          setHits(data);
          setHasSearched(true);
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
      } finally {
        setLoading(false);
      }

      // Update URL without full reload
      const params = new URLSearchParams({ q: trimmed });
      router.replace(`/?${params.toString()}`, { scroll: false });
    }, 250);

    return () => clearTimeout(timer);
  }, [value, router]);

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="search"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search by athlete name (e.g. Sinead Bent)"
          autoFocus
          className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-900"
        />
        {loading && (
          <span className="self-center text-sm text-slate-400">
            Searching…
          </span>
        )}
      </div>

      {value.trim().length > 0 && value.trim().length < 3 && (
        <p className="mt-6 text-sm text-slate-500">
          Type at least 3 characters to search.
        </p>
      )}

      {hasSearched && !loading && <ResultsTable hits={hits} />}
    </div>
  );
}
