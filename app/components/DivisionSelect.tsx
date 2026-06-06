"use client";

import { useRouter } from "next/navigation";

export default function DivisionSelect({
  divisions,
  selected,
}: {
  divisions: string[];
  selected: string;
}) {
  const router = useRouter();

  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-slate-400">
        Division
      </span>
      <select
        name="division"
        value={selected}
        onChange={(e) =>
          router.replace(`?division=${encodeURIComponent(e.target.value)}`)
        }
        className="rounded-lg border border-tryka-navy-light bg-tryka-navy-light px-3 py-2 text-sm text-white shadow-sm focus:border-tryka-green focus:outline-none focus:ring-1 focus:ring-tryka-green"
      >
        {divisions.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </label>
  );
}
