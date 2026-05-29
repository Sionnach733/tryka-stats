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
          placeholder="Search by athlete name (e.g. Aoife O'Rourke)"
          autoFocus
          className="flex-1 rounded-lg border border-tryka-navy-light bg-tryka-navy-light px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-400 focus:border-tryka-green focus:outline-none focus:ring-1 focus:ring-tryka-green"
        />
        {loading && (
          <span className="self-center text-sm text-tryka-green">
            Searching…
          </span>
        )}
      </div>

      {value.trim().length > 0 && value.trim().length < 3 && (
        <p className="mt-6 text-sm text-slate-400">
          Type at least 3 characters to search.
        </p>
      )}

      {hasSearched && !loading && <ResultsTable hits={hits} query={value.trim()} />}
    </div>
  );
}
