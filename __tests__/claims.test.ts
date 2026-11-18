import { describe, it, expect, beforeEach } from "vitest";
import { openAppDb, setAppDbForTests, getAppDb } from "@/lib/appDb";
import { getAthleteForName } from "@/lib/athletes";
import {
  claimAthlete,
  claimEntryManually,
  excludeEntry,
  getGroupEntries,
  getProfile,
  includeEntry,
  profileKeyForEntry,
  releaseAthlete,
  unclaimManual,
} from "@/lib/claims";

function createUser(email: string): number {
  return Number(
    getAppDb()
      .prepare("INSERT INTO users (email, created_at) VALUES (?, ?)")
      .run(email, Date.now()).lastInsertRowid,
  );
}

const emer = () => getAthleteForName("Emer Breen")!;
const grainne = () => getAthleteForName("Grainne Bolger")!;
const ids = (entries: { resultId: number }[]) => entries.map((e) => e.resultId).sort();

let alice: number;
let bob: number;

beforeEach(() => {
  setAppDbForTests(openAppDb(":memory:"));
  alice = createUser("alice@example.com");
  bob = createUser("bob@example.com");
});

describe("claiming", () => {
  it("unclaimed profiles show every grouped result", () => {
    const p = getProfile(emer());
    expect(p.ownerId).toBeNull();
    expect(ids(p.entries)).toEqual(ids(emer().entries));
  });

  it("claiming an athlete attaches all its results", () => {
    expect(claimAthlete(alice, emer().key)).toEqual({ ok: true });
    const p = getProfile(emer());
    expect(p.ownerId).toBe(alice);
    expect(ids(p.entries)).toEqual(ids(emer().entries));
    expect(p.entries.every((e) => e.source === "auto")).toBe(true);
  });

  it("an athlete can only have one owner", () => {
    claimAthlete(alice, emer().key);
    expect(claimAthlete(bob, emer().key).ok).toBe(false);
  });

  it("excluding frees a result for someone else to claim", () => {
    claimAthlete(alice, emer().key);
    const entry = emer().entries[0];
    expect(claimEntryManually(bob, entry).ok).toBe(false); // bob has no profile yet
    claimAthlete(bob, grainne().key);
    expect(claimEntryManually(bob, entry).ok).toBe(false); // still alice's

    excludeEntry(alice, entry);
    expect(ids(getProfile(emer()).entries)).not.toContain(entry.resultId);
    expect(claimEntryManually(bob, entry)).toEqual({ ok: true });
    expect(getProfile(grainne()).entries).toContainEqual({ ...entry, source: "manual" });

    // Alice can't re-include it while Bob holds it.
    expect(includeEntry(alice, entry).ok).toBe(false);
    expect(getGroupEntries(alice).find((e) => e.resultId === entry.resultId && e.memberIndex === entry.memberIndex)?.status).toBe("taken");
  });

  it("sync doesn't re-add excluded results, include does", () => {
    claimAthlete(alice, emer().key);
    const entry = emer().entries[0];
    excludeEntry(alice, entry);
    expect(ids(getProfile(emer()).entries)).not.toContain(entry.resultId);
    includeEntry(alice, entry);
    expect(ids(getProfile(emer()).entries)).toContain(entry.resultId);
  });

  it("only the owner can exclude results from a group", () => {
    claimAthlete(alice, emer().key);
    claimAthlete(bob, grainne().key);
    expect(excludeEntry(bob, emer().entries[0]).ok).toBe(false);
  });

  it("manual claims show on the profile and can be removed", () => {
    claimAthlete(alice, emer().key);
    const other = grainne().entries.find(
      (g) => !emer().entries.some((e) => e.resultId === g.resultId && e.memberIndex === g.memberIndex),
    )!;
    expect(claimEntryManually(alice, other)).toEqual({ ok: true });
    expect(getProfile(emer()).entries).toContainEqual({ ...other, source: "manual" });
    // Grainne's (unclaimed) profile no longer shows it.
    expect(getProfile(grainne()).entries.some((e) => e.resultId === other.resultId && e.memberIndex === other.memberIndex)).toBe(false);
    expect(profileKeyForEntry(other)).toBe(emer().key);

    expect(unclaimManual(alice, other)).toEqual({ ok: true });
    expect(getProfile(grainne()).entries).toContainEqual({ ...other, source: null });
  });

  it("a second claimed name redirects to the primary profile", () => {
    claimAthlete(alice, emer().key);
    claimAthlete(alice, grainne().key);
    const p = getProfile(grainne());
    expect(p.redirectKey).toBe(emer().key);
  });

  it("releasing an athlete removes its auto claims", () => {
    claimAthlete(alice, emer().key);
    expect(releaseAthlete(bob, emer().key).ok).toBe(false);
    expect(releaseAthlete(alice, emer().key)).toEqual({ ok: true });
    const p = getProfile(emer());
    expect(p.ownerId).toBeNull();
    expect(ids(p.entries)).toEqual(ids(emer().entries));
  });
});
