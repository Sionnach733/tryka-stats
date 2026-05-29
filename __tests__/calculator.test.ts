import { describe, it, expect } from "vitest";
import {
  CALCULATOR_POOL_SIZE,
  averageSplits,
  filterAtomicSegments,
  pickClosestIds,
  runningSeconds,
  totalSeconds,
  type PredictedSegment,
} from "@/lib/calculator";
import { formatMmSs } from "@/lib/format";

function segment(
  split_order: number,
  split_name: string,
  avgSeconds: number,
): PredictedSegment {
  return { split_order, split_name, avgSeconds, sampleSize: 1 };
}

describe("pickClosestIds", () => {
  it("returns the ids of athletes closest to the target", () => {
    const rows = [
      { id: 1, overall_time: "40:00" }, // 2400s, diff 300
      { id: 2, overall_time: "44:30" }, // 2670s, diff 30
      { id: 3, overall_time: "45:10" }, // 2710s, diff 10
      { id: 4, overall_time: "1:00:00" }, // 3600s, diff 900
      { id: 5, overall_time: "45:00" }, // 2700s, diff 0
    ];
    const target = 45 * 60; // 2700s
    const result = pickClosestIds(rows, target, 3);
    expect(result).toEqual([5, 3, 2]);
  });

  it("skips rows with null or unparseable overall_time", () => {
    const rows = [
      { id: 1, overall_time: null },
      { id: 2, overall_time: "not a time" },
      { id: 3, overall_time: "30:00" },
    ];
    const result = pickClosestIds(rows, 30 * 60, 5);
    expect(result).toEqual([3]);
  });

  it("returns at most N ids", () => {
    const rows = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      overall_time: `${30 + i}:00`,
    }));
    const result = pickClosestIds(rows, 45 * 60);
    expect(result).toHaveLength(CALCULATOR_POOL_SIZE);
  });

  it("returns empty array when no rows are parseable", () => {
    const rows = [
      { id: 1, overall_time: null },
      { id: 2, overall_time: "bogus" },
    ];
    expect(pickClosestIds(rows, 2700)).toEqual([]);
  });
});

describe("averageSplits", () => {
  it("averages times per split_name and orders by split_order", () => {
    const rows = [
      // SkiErg: two athletes, 1:00 and 2:00 -> avg 1:30 (90s)
      { result_id: 1, split_order: 2, split_name: "SkiErg", time: "1:00" },
      { result_id: 2, split_order: 2, split_name: "SkiErg", time: "2:00" },
      // Running 1: 4:00 and 5:00 -> avg 4:30 (270s)
      { result_id: 1, split_order: 1, split_name: "Running 1", time: "4:00" },
      { result_id: 2, split_order: 1, split_name: "Running 1", time: "5:00" },
    ];
    const result = averageSplits(rows);
    expect(result).toHaveLength(2);
    expect(result[0].split_name).toBe("Running 1");
    expect(result[0].avgSeconds).toBe(270);
    expect(formatMmSs(result[0].avgSeconds)).toBe("04:30");
    expect(result[1].split_name).toBe("SkiErg");
    expect(result[1].avgSeconds).toBe(90);
    expect(formatMmSs(result[1].avgSeconds)).toBe("01:30");
  });

  it("skips rows with null or unparseable times", () => {
    const rows = [
      { result_id: 1, split_order: 1, split_name: "Running 1", time: null },
      { result_id: 2, split_order: 1, split_name: "Running 1", time: "bad" },
      { result_id: 3, split_order: 1, split_name: "Running 1", time: "3:00" },
    ];
    const result = averageSplits(rows);
    expect(result).toHaveLength(1);
    expect(result[0].avgSeconds).toBe(180);
    expect(result[0].sampleSize).toBe(1);
  });

  it("returns an empty array when given no rows", () => {
    expect(averageSplits([])).toEqual([]);
  });
});

describe("filterAtomicSegments", () => {
  it("drops Best Run Lap and Run Total but keeps TRY Zone Total", () => {
    const all: PredictedSegment[] = [
      segment(1, "Running 1", 90),
      segment(2, "SkiErg", 200),
      segment(3, "Best Run Lap", 80),
      segment(4, "Run Total", 700),
      segment(5, "TRY Zone Total", 180),
      segment(6, "Burpees", 60),
    ];
    const result = filterAtomicSegments(all);
    const names = result.map((s) => s.split_name);
    expect(names).toEqual(["Running 1", "SkiErg", "TRY Zone Total", "Burpees"]);
    expect(names).not.toContain("Best Run Lap");
    expect(names).not.toContain("Run Total");
  });

  it("keeps every atomic name when nothing else is present", () => {
    const atomicNames = [
      "Running 1","Running 2","Running 3","Running 4",
      "Running 5","Running 6","Running 7","Running 8",
      "Running Finish Sprint",
      "SkiErg","KB Farmers Carry","Ramfit Thrusters","Sled Push",
      "Sled Pull","Rowing","Lunges","Burpees",
      "TRY Zone Total",
    ];
    const segs = atomicNames.map((n, i) => segment(i + 1, n, 60));
    expect(filterAtomicSegments(segs)).toHaveLength(18);
  });

  it("keeps Running Finish Sprint", () => {
    const segs = [segment(99, "Running Finish Sprint", 45)];
    expect(filterAtomicSegments(segs)).toEqual(segs);
  });
});

describe("totalSeconds", () => {
  it("sums avgSeconds across all segments", () => {
    const segs = [
      segment(1, "Running 1", 90),
      segment(2, "SkiErg", 200),
      segment(3, "Burpees", 60.5),
    ];
    expect(totalSeconds(segs)).toBeCloseTo(350.5);
  });

  it("returns 0 for an empty list", () => {
    expect(totalSeconds([])).toBe(0);
  });
});

describe("runningSeconds", () => {
  it("sums only the numbered Running 1..8 legs", () => {
    const segs = [
      segment(1, "Running 1", 90),
      segment(2, "SkiErg", 200),
      segment(3, "Running 2", 100),
      segment(4, "Sled Push", 75),
      segment(5, "Running 3", 105),
    ];
    expect(runningSeconds(segs)).toBe(90 + 100 + 105);
  });

  it("excludes Running Finish Sprint (not in PACE_DISTANCES denominator)", () => {
    const segs = [
      segment(1, "Running 1", 90),
      segment(2, "Running 8", 100),
      segment(3, "Running Finish Sprint", 45),
    ];
    expect(runningSeconds(segs)).toBe(190);
  });

  it("returns 0 when there are no running rows", () => {
    expect(runningSeconds([segment(1, "SkiErg", 200)])).toBe(0);
  });
});
