import type { MetadataRoute } from "next";
import { getAllResultIds } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const ids = getAllResultIds();

  const resultUrls = ids.map((row) => ({
    url: `https://trykastats.com/results/${row.id}`,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: "https://trykastats.com",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...resultUrls,
  ];
}
