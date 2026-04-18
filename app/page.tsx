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
      <SearchBar initialQuery={q} initialHits={hits} />
    </div>
  );
}
