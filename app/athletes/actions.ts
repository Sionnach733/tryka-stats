"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { getAthleteBySlug } from "@/lib/athletes";
import {
  claimAthlete,
  claimEntryManually,
  excludeEntry,
  includeEntry,
  releaseAthlete,
  unclaimManual,
  type ClaimResult,
} from "@/lib/claims";

const NOT_SIGNED_IN: ClaimResult = { ok: false, error: "Please sign in first." };

function validEntry(resultId: unknown, memberIndex: unknown) {
  return (
    Number.isInteger(resultId) &&
    Number.isInteger(memberIndex) &&
    (resultId as number) > 0 &&
    (memberIndex as number) >= 0
  );
}

function done(result: ClaimResult): ClaimResult {
  if (result.ok) revalidatePath("/athletes/[slug]", "page");
  return result;
}

export async function claimAthleteAction(slug: string): Promise<ClaimResult> {
  const user = await getCurrentUser();
  if (!user) return NOT_SIGNED_IN;
  const athlete = getAthleteBySlug(slug);
  if (!athlete) return { ok: false, error: "Athlete not found." };
  return done(claimAthlete(user.id, athlete.key));
}

export async function releaseAthleteAction(slug: string): Promise<ClaimResult> {
  const user = await getCurrentUser();
  if (!user) return NOT_SIGNED_IN;
  const athlete = getAthleteBySlug(slug);
  if (!athlete) return { ok: false, error: "Athlete not found." };
  return done(releaseAthlete(user.id, athlete.key));
}

type EntryAction = (userId: number, e: { resultId: number; memberIndex: number }) => ClaimResult;

function entryAction(fn: EntryAction) {
  return async (resultId: number, memberIndex: number): Promise<ClaimResult> => {
    const user = await getCurrentUser();
    if (!user) return NOT_SIGNED_IN;
    if (!validEntry(resultId, memberIndex)) return { ok: false, error: "Invalid result." };
    return done(fn(user.id, { resultId, memberIndex }));
  };
}

export async function excludeEntryAction(resultId: number, memberIndex: number) {
  return entryAction(excludeEntry)(resultId, memberIndex);
}

export async function includeEntryAction(resultId: number, memberIndex: number) {
  return entryAction(includeEntry)(resultId, memberIndex);
}

export async function addResultAction(resultId: number, memberIndex: number) {
  return entryAction(claimEntryManually)(resultId, memberIndex);
}

export async function removeManualAction(resultId: number, memberIndex: number) {
  return entryAction(unclaimManual)(resultId, memberIndex);
}
