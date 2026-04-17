import { describe, it, expect } from "vitest";
import { parseMembers, displayMembers, displayGender } from "@/lib/format";

describe("parseMembers", () => {
  it("parses a solo athlete", () => {
    expect(parseMembers('["Conor Breen"]')).toEqual(["Conor Breen"]);
  });

  it("parses a team with multiple members", () => {
    expect(parseMembers('["Alice Smith", "Bob Jones"]')).toEqual([
      "Alice Smith",
      "Bob Jones",
    ]);
  });

  it("returns empty array for invalid JSON", () => {
    expect(parseMembers("not json")).toEqual([]);
  });

  it("returns empty array for non-array JSON", () => {
    expect(parseMembers('{"name":"x"}')).toEqual([]);
  });

  it("filters out non-string elements", () => {
    expect(parseMembers('[1, "Valid", null]')).toEqual(["Valid"]);
  });

  it("returns empty array for empty string", () => {
    expect(parseMembers("")).toEqual([]);
  });

  it("handles empty JSON array", () => {
    expect(parseMembers("[]")).toEqual([]);
  });
});

describe("displayMembers", () => {
  it("joins multiple members with /", () => {
    expect(displayMembers(["A", "B"])).toBe("A / B");
  });

  it("shows a single member as-is", () => {
    expect(displayMembers(["Solo"])).toBe("Solo");
  });

  it("returns dash for empty array", () => {
    expect(displayMembers([])).toBe("—");
  });
});

describe("displayGender", () => {
  it("maps M to Men", () => expect(displayGender("M")).toBe("Men"));
  it("maps W to Women", () => expect(displayGender("W")).toBe("Women"));
  it("maps X to Mixed", () => expect(displayGender("X")).toBe("Mixed"));
  it("returns dash for null", () => expect(displayGender(null)).toBe("—"));
  it("returns dash for undefined", () => expect(displayGender(undefined)).toBe("—"));
  it("returns dash for unknown string", () => expect(displayGender("Z")).toBe("—"));
});
