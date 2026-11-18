import { describe, it, expect } from "vitest";
import {
  athleteKey,
  athleteSlug,
  getAllAthleteSlugs,
  getAthleteBySlug,
  getAthleteForName,
  searchAthletes,
  stripCountry,
} from "@/lib/athletes";

describe("athleteKey", () => {
  it("strips the country suffix", () => {
    expect(athleteKey("Conor Mccarthy (IRL)")).toBe("conor mccarthy");
    expect(athleteKey("Conor Mccarthy")).toBe("conor mccarthy");
  });

  it("is diacritic, apostrophe, case and whitespace insensitive", () => {
    expect(athleteKey("Ciarán  Breathnach")).toBe("ciaran breathnach");
    expect(athleteKey("Paul O'Connor (IRL)")).toBe("paul o connor");
    expect(athleteKey("PAUL O CONNOR")).toBe("paul o connor");
  });

  it("only strips a trailing country code", () => {
    expect(stripCountry("Anne (Annie) Smith")).toBe("Anne (Annie) Smith");
    expect(stripCountry("Anne Smith (GBR)")).toBe("Anne Smith");
  });
});

describe("athleteSlug", () => {
  it("makes url-safe slugs", () => {
    expect(athleteSlug("paul o connor")).toBe("paul-o-connor");
    expect(athleteSlug("anne-marie  ryan")).toBe("anne-marie-ryan");
  });
});

describe("athlete index (fixture DB)", () => {
  it("groups a doubles/relay result under every member", () => {
    const emer = getAthleteForName("Emer Breen")!;
    const grainne = getAthleteForName("Grainne Bolger (IRL)")!;
    const emerIds = emer.entries.map((e) => e.resultId);
    const grainneIds = grainne.entries.map((e) => e.resultId);
    expect(emerIds).toEqual(expect.arrayContaining([21093, 31264, 35977]));
    expect(grainneIds).toEqual(expect.arrayContaining([21093, 35977]));
    expect(emer.name).toBe("Emer Breen");
  });

  it("looks athletes up by slug", () => {
    const emer = getAthleteForName("Emer Breen")!;
    expect(getAthleteBySlug(emer.slug)?.key).toBe("emer breen");
    expect(getAthleteBySlug("definitely-not-an-athlete")).toBeUndefined();
  });

  it("slugs are unique", () => {
    const slugs = getAllAthleteSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("searchAthletes", () => {
  it("returns one hit per athlete", () => {
    const hits = searchAthletes("Breen");
    const names = hits.map((h) => h.name);
    expect(new Set(names).size).toBe(names.length);
    const emer = hits.find((h) => h.name === "Emer Breen")!;
    expect(emer.resultCount).toBeGreaterThanOrEqual(3);
    expect(emer.divisions.length).toBeGreaterThan(1);
  });

  it("ranks exact matches first", () => {
    expect(searchAthletes("emer breen")[0].name).toBe("Emer Breen");
  });

  it("is diacritic-insensitive", () => {
    expect(searchAthletes("Ciaran").some((h) => h.name.includes("Ciarán"))).toBe(true);
  });

  it("marks claimed athletes", () => {
    const hits = searchAthletes("emer breen", (k) => k === "emer breen");
    expect(hits[0].claimed).toBe(true);
  });

  it("returns nothing for blank or unknown queries", () => {
    expect(searchAthletes("   ")).toEqual([]);
    expect(searchAthletes("ZZZZNONEXISTENT")).toEqual([]);
  });
});
