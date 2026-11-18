import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAthleteByKey } from "@/lib/athletes";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json(null, { headers: { "Cache-Control": "no-store" } });
  const primary = user.primaryAthleteKey ? getAthleteByKey(user.primaryAthleteKey) : undefined;
  return NextResponse.json(
    { email: user.email, primarySlug: primary?.slug ?? null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
