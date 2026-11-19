import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAthleteByKey, getAthleteBySlug, getResultMeta, stripCountry } from "@/lib/athletes";
import { getCurrentUser } from "@/lib/auth";
import { getGroupEntries, getProfile, profileKeyForEntry, userKeys } from "@/lib/claims";
import { canonicalDivision, getRefinedSplitsForResults, getResultsByIds, type SearchHit } from "@/lib/queries";
import { bestStationTimes } from "@/lib/stationBests";
import { countPodiums, displayGender, formatMmSs, parseMembers, parseTime } from "@/lib/format";
import ClaimButton from "@/app/components/ClaimButton";
import ManageResults, { type ManageRow } from "@/app/components/ManageResults";
import AddResultSearch from "@/app/components/AddResultSearch";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ q?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const athlete = getAthleteBySlug(slug);
  if (!athlete) return {};
  const title = `${athlete.name} – Tryka results`;
  const description = `All Tryka race results for ${athlete.name}: finish times, rankings and splits.`;
  const url = `https://trykastats.com/athletes/${athlete.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Tryka Stats", type: "profile" },
  };
}

type Row = { hit: SearchHit; memberIndex: number; partners: { name: string; slug: string | null }[] };

export default async function AthletePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const { q } = await searchParams;
  const athlete = getAthleteBySlug(slug);
  if (!athlete) notFound();

  const profile = getProfile(athlete);
  if (profile.redirectKey) {
    const primary = getAthleteByKey(profile.redirectKey);
    if (primary) redirect(`/athletes/${primary.slug}${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  }

  const user = await getCurrentUser();
  const isOwner = user !== null && user.id === profile.ownerId;
  const isClaimed = profile.ownerId !== null;

  const hits = getResultsByIds(Array.from(new Set(profile.entries.map((e) => e.resultId))));
  const hitById = new Map(hits.map((h) => [h.id, h]));
  // Keep getResultsByIds ordering (most recent first).
  const order = new Map(hits.map((h, i) => [h.id, i]));
  const rows: Row[] = profile.entries
    .filter((e) => hitById.has(e.resultId))
    .sort((a, b) => order.get(a.resultId)! - order.get(b.resultId)!)
    .map((e) => {
      const hit = hitById.get(e.resultId)!;
      const partners = parseMembers(hit.members)
        .map((name, i) => ({ name, i }))
        .filter(({ i }) => i !== e.memberIndex)
        .map(({ name, i }) => {
          const key = profileKeyForEntry({ resultId: e.resultId, memberIndex: i });
          return {
            name: stripCountry(name),
            slug: key ? (getAthleteByKey(key)?.slug ?? null) : null,
          };
        });
      return { hit, memberIndex: e.memberIndex, partners };
    });

  const bestByDivision = new Map<string, number>();
  for (const { hit } of rows) {
    const t = parseTime(hit.overall_time);
    if (t == null) continue;
    const division = canonicalDivision(hit.division);
    const prev = bestByDivision.get(division);
    if (prev == null || t < prev) bestByDivision.set(division, t);
  }
  const bestStations = bestStationTimes(
    rows.map((r) => r.hit),
    getRefinedSplitsForResults(rows.map((r) => r.hit.id)),
  );
  const podiums = countPodiums(rows.map((r) => r.hit));

  let manageRows: ManageRow[] = [];
  let ownedGroups: { slug: string; name: string }[] = [];
  if (isOwner) {
    const manual = profile.entries
      .filter((e) => e.source === "manual")
      .map((e) => ({ ...e, status: "manual" as const }));
    const all = [...getGroupEntries(user.id), ...manual];
    const manageHits = new Map(
      getResultsByIds(Array.from(new Set(all.map((e) => e.resultId)))).map((h) => [h.id, h]),
    );
    manageRows = all.flatMap((e) => {
      const meta = getResultMeta(e.resultId);
      if (!meta) return [];
      const hit = manageHits.get(e.resultId);
      return [
        {
          resultId: e.resultId,
          memberIndex: e.memberIndex,
          name: stripCountry(meta.members[e.memberIndex] ?? ""),
          raceName: meta.raceName,
          division: canonicalDivision(meta.division),
          members: meta.members.map(stripCountry).join(" / "),
          overallTime: hit?.overall_time ?? null,
          status: e.status,
        },
      ];
    });
    ownedGroups = userKeys(user.id).flatMap((k) => {
      const a = getAthleteByKey(k);
      return a ? [{ slug: a.slug, name: a.name }] : [];
    });
  }

  return (
    <div className="space-y-8">
      <Link
        href={q ? `/?q=${encodeURIComponent(q)}` : "/"}
        className="text-sm text-tryka-green hover:underline"
      >
        &larr; Back to search
      </Link>

      <section className="rounded-lg border border-tryka-navy-light bg-tryka-navy-light p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {athlete.name}
              {isClaimed && (
                <span className="ml-3 rounded border border-tryka-green/30 bg-tryka-green/10 px-1.5 py-0.5 align-middle text-[10px] uppercase tracking-wide text-tryka-green">
                  Claimed
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {isClaimed
                ? "Results confirmed by the athlete."
                : "Results grouped automatically by name — may include other athletes with the same name."}
            </p>
          </div>
          {!isClaimed &&
            (user ? (
              <ClaimButton slug={athlete.slug} name={athlete.name} />
            ) : (
              <Link
                href={`/login?next=${encodeURIComponent(`/athletes/${athlete.slug}`)}`}
                className="rounded-md bg-tryka-green px-3 py-1.5 text-sm font-medium text-tryka-navy hover:bg-tryka-green/90"
              >
                Is this you? Log in to claim
              </Link>
            ))}
        </div>
      </section>

      <div className="grid grid-cols-3 gap-3">
        <Tile label="Results" value={String(rows.length)} />
        <Tile label="Podiums" value={String(podiums)} />
        <Tile label="Divisions" value={String(new Set(rows.map((r) => canonicalDivision(r.hit.division))).size)} />
      </div>

      {bestByDivision.size > 0 && (
        <section>
          <h2 className="text-lg font-semibold">Best times</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from(bestByDivision)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([division, t]) => (
                <Tile key={division} label={division} value={formatHms(t)} />
              ))}
          </div>
        </section>
      )}

      {bestStations.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">Best station times</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {bestStations.map((b) => (
              <Tile
                key={b.station}
                label={b.station}
                value={formatMmSs(b.seconds)}
                caption={`${b.raceName} · ${b.division.includes("DOUBLES") ? "Doubles" : b.division}`}
                href={`/results/${b.resultId}?tab=stations${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold">Results</h2>
        {rows.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">No results on this profile.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border border-tryka-navy-light">
            <table className="min-w-full divide-y divide-tryka-navy-light text-sm">
              <thead className="bg-tryka-navy-light text-left text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-3 py-2">Race</th>
                  <th className="px-3 py-2">Division</th>
                  <th className="px-3 py-2">Partners</th>
                  <th className="px-3 py-2">Gender</th>
                  <th className="px-3 py-2">Age Group</th>
                  <th className="px-3 py-2 text-right">Rank (M/W)</th>
                  <th className="px-3 py-2 text-right">Rank (Age)</th>
                  <th className="px-3 py-2 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tryka-navy-light">
                {rows.map(({ hit, memberIndex, partners }) => (
                  <tr key={`${hit.id}:${memberIndex}`} className="hover:bg-tryka-navy-light/50">
                    <td className="px-3 py-2 font-medium">
                      <Link
                        href={`/results/${hit.id}${q ? `?q=${encodeURIComponent(q)}` : ""}`}
                        className="text-tryka-green hover:underline"
                      >
                        {hit.race_name}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{canonicalDivision(hit.division)}</td>
                    <td className="px-3 py-2">
                      {partners.length === 0
                        ? "—"
                        : partners.map((p, i) => (
                            <span key={i}>
                              {i > 0 && ", "}
                              {p.slug ? (
                                <Link href={`/athletes/${p.slug}`} className="hover:text-tryka-green hover:underline">
                                  {p.name}
                                </Link>
                              ) : (
                                p.name
                              )}
                            </span>
                          ))}
                    </td>
                    <td className="px-3 py-2">{displayGender(hit.gender)}</td>
                    <td className="px-3 py-2">{hit.age_group ?? "—"}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {hit.rank_overall != null ? `${hit.rank_overall}/${hit.total_gender}` : "—"}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {hit.rank_age_group != null ? `${hit.rank_age_group}/${hit.total_age_group}` : "—"}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{hit.overall_time ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isOwner && (
        <section id="manage" className="mt-12 scroll-mt-6 space-y-8 rounded-lg border border-tryka-navy-light px-4 py-4">
          <h2 className="text-lg font-semibold">Manage your profile</h2>
          <ManageResults rows={manageRows} groups={ownedGroups} />
          <AddResultSearch
            claimedIds={profile.entries.map((e) => `${e.resultId}:${e.memberIndex}`)}
          />
        </section>
      )}
    </div>
  );
}

function formatHms(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const rest = seconds - h * 3600;
  return `${String(h).padStart(2, "0")}:${formatMmSs(rest)}`;
}

function Tile({
  label,
  value,
  caption,
  href,
}: {
  label: string;
  value: string;
  caption?: string;
  href?: string;
}) {
  const body = (
    <>
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-semibold tabular-nums">{value}</div>
      {caption && <div className="mt-0.5 truncate text-xs text-slate-400">{caption}</div>}
    </>
  );
  const cls = "rounded-lg border border-tryka-navy-light bg-tryka-navy-light px-3 py-2.5 shadow-sm";
  return href ? (
    <Link href={href} className={`block ${cls} hover:border-tryka-green`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
