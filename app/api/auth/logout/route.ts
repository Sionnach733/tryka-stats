import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, deleteSession } from "@/lib/auth";

export function POST(req: NextRequest) {
  deleteSession(req.cookies.get(SESSION_COOKIE)?.value);
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
