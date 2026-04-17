import { describe, it, expect } from "vitest";
import {
  searchAthletes,
  getResult,
  getRefinedSplits,
  getRawSplits,
} from "@/lib/queries";

describe("searchAthletes", () => {
  it("returns results for a known surname", () => {
    const hits = searchAthletes("Breen");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]).toMatchObject({
      id: expect.any(Number),
      members: expect.stringContaining("Breen"),
      race_name: expect.any(String),
      division: expect.any(String),
    });
  });

  it("is case-insensitive", () => {
    const lower = searchAthletes("breen");
    const upper = searchAthletes("BREEN");
    expect(lower.length).toBe(upper.length);
    expect(lower.length).toBeGreaterThan(0);
  });

  it("returns empty array for empty query", () => {
    expect(searchAthletes("")).toEqual([]);
  });

  it("returns empty array for whitespace-only query", () => {
    expect(searchAthletes("   ")).toEqual([]);
  });

  it("matches names with diacritics when searching without them", () => {
    const hits = searchAthletes("Ciaran");
    const match = hits.find((h) => h.members.includes("Ciarán"));
    expect(match).toBeDefined();
  });

  it("matches names with diacritics when searching with them", () => {
    const hits = searchAthletes("Ciarán");
    const match = hits.find((h) => h.members.includes("Ciarán"));
    expect(match).toBeDefined();
  });

  it("matches names with apostrophes when searching with a space instead", () => {
    const hits = searchAthletes("O Shea");
    const match = hits.find((h) => h.members.includes("O'Shea"));
    expect(match).toBeDefined();
  });

  it("matches names with apostrophes when searching with the apostrophe", () => {
    const hits = searchAthletes("O'Shea");
    const match = hits.find((h) => h.members.includes("O'Shea"));
    expect(match).toBeDefined();
  });

  it("returns empty array for a name that doesn't exist", () => {
    expect(searchAthletes("ZZZZNONEXISTENT")).toEqual([]);
  });

  it("respects the 200-row limit", () => {
    const hits = searchAthletes("a");
    expect(hits.length).toBeLessThanOrEqual(200);
  });

  it("matches team members", () => {
    // Search for a name that appears in a doubles/team event
    const hits = searchAthletes("Breen");
    const teamHit = hits.find((h) => {
      const members = JSON.parse(h.members);
      return Array.isArray(members) && members.length > 1;
    });
    // There should be at least one team result with Breen
    expect(teamHit).toBeDefined();
  });
});

describe("getResult", () => {
  it("returns a result for a known ID", () => {
    // Use a known ID from earlier verification
    const result = getResult(15079);
    expect(result).toBeDefined();
    expect(result!.race_name).toBe("DUBLIN AUTUMN RACE 1");
    expect(result!.members).toContain("Conor Breen");
    expect(result!.overall_time).toBe("00:44:35");
    expect(result!.gender).toBe("M");
    expect(result!.age_group).toBe("35 - 39");
  });

  it("returns undefined for a non-existent ID", () => {
    expect(getResult(999999999)).toBeUndefined();
  });

  it("includes all expected fields", () => {
    const result = getResult(15079);
    expect(result).toBeDefined();
    const keys = Object.keys(result!);
    for (const k of [
      "id", "idp", "members", "bib_number", "gym_affiliate",
      "age_group", "gender", "rank_overall", "rank_age_group",
      "league_points", "overall_time", "penalty", "bonus",
      "disqual_reason", "race_name", "division",
    ]) {
      expect(keys).toContain(k);
    }
  });
});

describe("getRefinedSplits", () => {
  it("returns ordered splits for a known result", () => {
    const splits = getRefinedSplits(15079);
    expect(splits.length).toBeGreaterThan(0);
    expect(splits[0].split_name).toBe("Running 1");
    expect(splits[0]).toHaveProperty("time");
    expect(splits[0]).toHaveProperty("place");
  });

  it("includes station and running splits", () => {
    const splits = getRefinedSplits(15079);
    const names = splits.map((s) => s.split_name);
    expect(names).toContain("SkiErg");
    expect(names).toContain("Running 1");
    expect(names).toContain("TRY Zone Total");
  });

  it("returns empty array for non-existent result", () => {
    expect(getRefinedSplits(999999999)).toEqual([]);
  });
});

describe("getRawSplits", () => {
  it("returns splits with time_of_day, time, and diff fields", () => {
    const splits = getRawSplits(15079);
    expect(splits.length).toBeGreaterThan(0);
    expect(splits[0]).toMatchObject({
      split_name: expect.any(String),
    });
    expect(splits[0]).toHaveProperty("time_of_day");
    expect(splits[0]).toHaveProperty("time");
    expect(splits[0]).toHaveProperty("diff");
  });

  it("returns empty array for non-existent result", () => {
    expect(getRawSplits(999999999)).toEqual([]);
  });
});
