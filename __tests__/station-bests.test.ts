import { describe, it, expect } from "vitest";
import { bestStationTimes } from "@/lib/stationBests";

const results = [
  { id: 3, division: "TRYKA OPEN 800", race_name: "Race C" },
  { id: 2, division: "TRYKA DOUBLES 500", race_name: "Race B" },
  { id: 1, division: "TRYKA RELAY", race_name: "Race A" },
];

describe("bestStationTimes", () => {
  it("picks the fastest time per station and links its result", () => {
    const out = bestStationTimes(results, [
      { result_id: 3, split_name: "SkiErg", time: "00:04:30" },
      { result_id: 2, split_name: "SkiErg", time: "00:04:10" },
    ]);
    expect(out).toEqual([
      { station: "SkiErg", seconds: 250, resultId: 2, division: "TRYKA DOUBLES 500", raceName: "Race B" },
    ]);
  });

  it("skips relay results", () => {
    const out = bestStationTimes(results, [{ result_id: 1, split_name: "Burpees", time: "00:03:00" }]);
    expect(out).toEqual([]);
  });

  it("skips Tryka Clan Fitness results", () => {
    const out = bestStationTimes(
      [{ id: 9, division: "TRYKA CLAN FITNESS", race_name: "Race D" }],
      [{ result_id: 9, split_name: "Sled Pull", time: "00:02:00" }],
    );
    expect(out).toEqual([]);
  });

  it("ignores impossibly fast times", () => {
    const out = bestStationTimes(results, [
      { result_id: 3, split_name: "Sled Push", time: "00:00:08" },
      { result_id: 2, split_name: "Sled Push", time: "00:01:10" },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0].seconds).toBe(70);
    expect(out[0].resultId).toBe(2);
  });

  it("ignores non-station splits and null times", () => {
    const out = bestStationTimes(results, [
      { result_id: 3, split_name: "Running 1", time: "00:04:00" },
      { result_id: 3, split_name: "Rowing", time: null },
    ]);
    expect(out).toEqual([]);
  });

  it("prefers the newest result on a tie", () => {
    const out = bestStationTimes(results, [
      { result_id: 2, split_name: "Lunges", time: "00:03:00" },
      { result_id: 3, split_name: "Lunges", time: "00:03:00" },
    ]);
    expect(out[0].resultId).toBe(3);
  });

  it("orders tiles by workout station order", () => {
    const out = bestStationTimes(results, [
      { result_id: 3, split_name: "Burpees", time: "00:04:00" },
      { result_id: 3, split_name: "SkiErg", time: "00:04:00" },
    ]);
    expect(out.map((b) => b.station)).toEqual(["SkiErg", "Burpees"]);
  });
});
