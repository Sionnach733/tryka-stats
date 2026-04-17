import { NextRequest, NextResponse } from "next/server";
import { searchAthletes } from "@/lib/queries";

export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 3) {
    return NextResponse.json([]);
  }
  return NextResponse.json(searchAthletes(q));
}
