import { describe, it, expect } from "vitest";
import { computeKde } from "@/lib/format";

describe("computeKde", () => {
  it("returns empty array for empty input", () => {
    expect(computeKde([], 0, 100)).toEqual([]);
  });

  it("returns correct number of points", () => {
    const points = computeKde([60, 120, 180], 0, 300, 50);
    expect(points).toHaveLength(50);
  });

  it("all densities are non-negative", () => {
    const points = computeKde([100, 200, 300, 400, 500], 50, 550, 100);
    for (const p of points) {
      expect(p.density).toBeGreaterThanOrEqual(0);
    }
  });

  it("x values span from xMin to xMax", () => {
    const points = computeKde([60, 120, 180], 30, 240, 20);
    expect(points[0].x).toBeCloseTo(30);
    expect(points[points.length - 1].x).toBeCloseTo(240);
  });

  it("handles single value without error", () => {
    const points = computeKde([42], 0, 100, 10);
    expect(points).toHaveLength(10);
    const maxDensity = Math.max(...points.map((p) => p.density));
    expect(maxDensity).toBeGreaterThan(0);
  });

  it("handles all same values", () => {
    const points = computeKde([100, 100, 100], 50, 150, 20);
    expect(points).toHaveLength(20);
    const maxDensity = Math.max(...points.map((p) => p.density));
    expect(maxDensity).toBeGreaterThan(0);
  });

  it("peak density is near the data concentration", () => {
    // Most values clustered around 200
    const data = [190, 195, 198, 200, 200, 202, 205, 210, 400];
    const points = computeKde(data, 100, 500, 100);
    const peak = points.reduce((a, b) => (b.density > a.density ? b : a));
    // Peak should be closer to 200 than to 400
    expect(peak.x).toBeLessThan(300);
  });
});
