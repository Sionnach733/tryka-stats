import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_TTL_MS, appUrl, consumeLoginToken, safeNext } from "@/lib/auth";

export function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const next = safeNext(req.nextUrl.searchParams.get("next"));
  const session = token ? consumeLoginToken(token) : null;

  if (!session) {
    return NextResponse.redirect(new URL("/login?error=expired", appUrl()));
  }
  const res = NextResponse.redirect(new URL(next, appUrl()));
  res.cookies.set(SESSION_COOKIE, session.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
  return res;
}
