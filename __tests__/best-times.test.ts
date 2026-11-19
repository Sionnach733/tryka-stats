import { describe, it, expect } from "vitest";
import { bestTimesByDivision } from "@/lib/bestTimes";

const r = (id: number, division: string, overall_time: string | null, race_name = `Race ${id}`) => ({
  id,
  division,
  race_name,
  overall_time,
});

describe("bestTimesByDivision", () => {
  it("picks the fastest time per division and links its result", () => {
    const out = bestTimesByDivision([
      r(3, "TRYKA OPEN 800", "01:10:00"),
      r(2, "TRYKA OPEN 800", "01:05:00"),
      r(1, "TRYKA OPEN 500", "00:50:00"),
    ]);
    expect(out).toEqual([
      { division: "TRYKA OPEN 500", seconds: 3000, resultId: 1, raceName: "Race 1" },
      { division: "TRYKA OPEN 800", seconds: 3900, resultId: 2, raceName: "Race 2" },
    ]);
  });

  it("merges the renamed Pro Doubles divisions", () => {
    const out = bestTimesByDivision([
      r(2, "TRYKA PRO DOUBLES", "00:55:00"),
      r(1, "TRYKA DOUBLES PRO", "00:50:38"),
    ]);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ division: "TRYKA PRO DOUBLES", resultId: 1 });
  });

  it("prefers the newest result on a tie", () => {
    const out = bestTimesByDivision([r(5, "TRYKA OPEN 800", "01:00:00"), r(4, "TRYKA OPEN 800", "01:00:00")]);
    expect(out[0].resultId).toBe(5);
  });

  it("skips results without a valid time", () => {
    expect(bestTimesByDivision([r(1, "TRYKA OPEN 800", null), r(2, "TRYKA OPEN 800", "n/a")])).toEqual([]);
  });
});
