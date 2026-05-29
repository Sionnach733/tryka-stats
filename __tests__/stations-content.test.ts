import { describe, it, expect } from "vitest";
import { WORKOUT_STATIONS } from "@/lib/constants";
import { STATIONS, getStationBySlug } from "@/lib/stations-content";

describe("stations content", () => {
  it("has exactly one entry per WORKOUT_STATIONS name", () => {
    expect(STATIONS).toHaveLength(WORKOUT_STATIONS.length);
    const names = new Set(STATIONS.map((s) => s.name));
    for (const name of WORKOUT_STATIONS) {
      expect(names.has(name)).toBe(true);
    }
  });

  it("uses unique kebab-case slugs", () => {
    const slugs = STATIONS.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("getStationBySlug returns the matching station", () => {
    expect(getStationBySlug("ski-erg")?.name).toBe("SkiErg");
    expect(getStationBySlug("kb-farmers-carry")?.name).toBe("KB Farmers Carry");
  });

  it("getStationBySlug returns undefined for an unknown slug", () => {
    expect(getStationBySlug("nope")).toBeUndefined();
    expect(getStationBySlug("")).toBeUndefined();
  });

  it("every station has at least one tip and standards entry", () => {
    for (const s of STATIONS) {
      expect(s.tips.length).toBeGreaterThan(0);
      expect(s.standardsIndividual.length).toBeGreaterThan(0);
      expect(s.standardsDoubles.length).toBeGreaterThan(0);
    }
  });
});
