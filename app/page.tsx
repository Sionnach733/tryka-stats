import SearchBar from "./components/SearchBar";
import { searchAthletes } from "@/lib/queries";

type SearchParams = Promise<{ q?: string }>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q: rawQ } = await searchParams;
  const q = (rawQ ?? "").trim();
  const hits = q.length >= 3 ? searchAthletes(q) : [];

  return (
    <div>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
        Search by athlete name to see every Tryka result they appear in. Click a
        row for refined and raw splits.
      </p>
      <SearchBar initialQuery={q} initialHits={hits} />
    </div>
  );
}
