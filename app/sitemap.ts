import type { MetadataRoute } from "next";
import { getAllResultIds } from "@/lib/queries";
import { getAllAthleteSlugs } from "@/lib/athletes";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const ids = getAllResultIds();

  const resultUrls = ids.map((row) => ({
    url: `https://trykastats.com/results/${row.id}`,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  const athleteUrls = getAllAthleteSlugs().map((slug) => ({
    url: `https://trykastats.com/athletes/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://trykastats.com",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...athleteUrls,
    ...resultUrls,
  ];
}
