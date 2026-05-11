"use client";

import { useState, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import CompareSearch from "./CompareSearch";

export default function CompareButton({
  currentId,
  compareId,
}: {
  currentId: number;
  compareId: number | null;
}) {
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClear = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("compare");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowSearch(true)}
          className="rounded-md bg-tryka-green px-3 py-1.5 text-sm font-medium text-tryka-navy hover:bg-tryka-green/90"
        >
          {compareId != null ? "Change comparison" : "Compare"}
        </button>
        {compareId != null && (
          <button
            onClick={handleClear}
            className="rounded-md border border-tryka-navy-light px-3 py-1.5 text-sm font-medium text-slate-400 hover:bg-tryka-navy-light"
          >
            Clear
          </button>
        )}
      </div>

      {showSearch && (
        <Suspense>
          <CompareSearch
            currentId={currentId}
            onClose={() => setShowSearch(false)}
          />
        </Suspense>
      )}
    </>
  );
}
