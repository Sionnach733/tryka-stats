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
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          {compareId != null ? "Change comparison" : "Compare"}
        </button>
        {compareId != null && (
          <button
            onClick={handleClear}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
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
