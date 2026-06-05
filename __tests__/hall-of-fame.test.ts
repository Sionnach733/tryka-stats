import { describe, it, expect } from "vitest";
import {
  canonicalDivision,
  getDistinctDivisions,
  getDivisionRecords,
  getRecordEligibleDivisions,
} from "@/lib/queries";
import { getDb } from "@/lib/db";

describe("getDivisionRecords", () => {
  it("returns at most one row per (gender, age_group) combo", () => {
    const records = getDivisionRecords("TRYKA PRO");
    expect(records.length).toBeGreaterThan(0);
    const keys = new Set(records.map((r) => `${r.gender}|${r.age_group ?? ""}`));
    expect(keys.size).toBe(records.length);
  });

  it("each record holds the fastest overall_time for its combo", () => {
    const records = getDivisionRecords("TRYKA PRO");
    const db = getDb();
    const minStmt = db.prepare<
      [string, string, string],
      { best: string | null }
    >(`
      SELECT MIN(r.overall_time) AS best
      FROM results r
      JOIN events e ON r.event_id = e.id
      WHERE e.division = ? AND r.gender = ? AND r.age_group IS ?
        AND r.overall_time IS NOT NULL
        AND r.disqual_reason IS NULL
    `);
    for (const r of records) {
      const row = minStmt.get("TRYKA PRO", r.gender ?? "", r.age_group);
      expect(row?.best).toBe(r.overall_time);
    }
  });

  it("exposes a result id usable for /results/[id]", () => {
    const records = getDivisionRecords("TRYKA PRO");
    for (const r of records) {
      expect(typeof r.id).toBe("number");
      expect(r.id).toBeGreaterThan(0);
    }
  });

  it("returns empty array for an unknown division", () => {
    expect(getDivisionRecords("NOT A REAL DIVISION")).toEqual([]);
  });

  it("covers every gender × age-group combo present in the division", () => {
    const division = "TRYKA OPEN 800";
    const records = getDivisionRecords(division);
    const db = getDb();
    const combos = db
      .prepare<[string], { gender: string | null; age_group: string | null }>(
        `
      SELECT DISTINCT r.gender, r.age_group
      FROM results r
      JOIN events e ON r.event_id = e.id
      WHERE e.division = ?
        AND r.overall_time IS NOT NULL
        AND r.disqual_reason IS NULL
        AND r.age_group IS NOT NULL
    `,
      )
      .all(division);
    expect(records.length).toBe(combos.length);
  });
});

describe("division alias folding", () => {
  it("canonicalDivision maps the old Pro Doubles spelling", () => {
    expect(canonicalDivision("TRYKA DOUBLES PRO")).toBe("TRYKA PRO DOUBLES");
    expect(canonicalDivision("TRYKA PRO DOUBLES")).toBe("TRYKA PRO DOUBLES");
    expect(canonicalDivision("TRYKA PRO")).toBe("TRYKA PRO");
  });

  it("getDistinctDivisions exposes only the canonical Pro Doubles name", () => {
    const divisions = getDistinctDivisions();
    expect(divisions).toContain("TRYKA PRO DOUBLES");
    expect(divisions).not.toContain("TRYKA DOUBLES PRO");
  });

  it("pools records across both Pro Doubles spellings", () => {
    const records = getDivisionRecords("TRYKA PRO DOUBLES");
    const m20s = records.find(
      (r) => r.gender === "M" && r.age_group === "20 - 29",
    );
    expect(m20s).toBeDefined();
    // 21032 (Darragh Okeeffe / Jay Hogan, Winter 2, 00:43:10) is the
    // fastest M 20-29 across both alias spellings — beats 26475 (00:43:26).
    expect(m20s!.id).toBe(21032);
    expect(m20s!.overall_time).toBe("00:43:10");
    expect(m20s!.race_name).toBe("DUBLIN WINTER RACE 2");
  });

  it("getRecordEligibleDivisions excludes divisions with no age-grouped results", () => {
    const eligible = getRecordEligibleDivisions();
    const all = getDistinctDivisions();
    // CLAN FITNESS only has null-age-group records, so it's eligible nowhere.
    expect(all).toContain("TRYKA CLAN FITNESS");
    expect(eligible).not.toContain("TRYKA CLAN FITNESS");
    // Standard divisions should still be present.
    expect(eligible).toContain("TRYKA PRO");
    expect(eligible).toContain("TRYKA PRO DOUBLES");
  });

  it("merged record set matches all combos across both spellings", () => {
    const records = getDivisionRecords("TRYKA PRO DOUBLES");
    const db = getDb();
    const combos = db
      .prepare<[], { gender: string | null; age_group: string | null }>(
        `
      SELECT DISTINCT r.gender, r.age_group
      FROM results r
      JOIN events e ON r.event_id = e.id
      WHERE e.division IN ('TRYKA PRO DOUBLES', 'TRYKA DOUBLES PRO')
        AND r.overall_time IS NOT NULL
        AND r.disqual_reason IS NULL
        AND r.age_group IS NOT NULL
    `,
      )
      .all();
    expect(records.length).toBe(combos.length);
  });
});
