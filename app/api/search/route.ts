import { NextRequest, NextResponse } from "next/server";
import { searchAthletes } from "@/lib/athletes";
import { claimedKeys } from "@/lib/claims";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";

const isRateLimited = createRateLimiter(60, 60_000);

export function GET(request: NextRequest) {
  if (isRateLimited(clientIp(request.headers))) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 3 || q.length > 200) {
    return NextResponse.json([]);
  }
  const claimed = claimedKeys();
  return NextResponse.json(searchAthletes(q, (k) => claimed.has(k)), {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
  });
}
