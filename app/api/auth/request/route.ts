import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { EMAIL_RE, appUrl, createLoginToken, normalizeEmail, safeNext } from "@/lib/auth";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";

const ipLimited = createRateLimiter(10, 15 * 60_000);
const emailLimited = createRateLimiter(3, 15 * 60_000);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { email: rawEmail, next } = body as Record<string, unknown>;
  if (typeof rawEmail !== "string" || !EMAIL_RE.test(rawEmail.trim()) || rawEmail.length > 254) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }
  const email = normalizeEmail(rawEmail);

  if (ipLimited(clientIp(req.headers)) || emailLimited(email)) {
    return NextResponse.json(
      { error: "Too many sign-in requests. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  const token = createLoginToken(email);
  const params = new URLSearchParams({
    token,
    next: safeNext(typeof next === "string" ? next : null),
  });
  const link = `${appUrl()}/api/auth/verify?${params.toString()}`;

  if (!process.env.RESEND_API_KEY) {
    // Dev fallback: no email provider configured.
    console.log(`[auth] Sign-in link for ${email}: ${link}`);
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Tryka Stats <noreply@trykastats.com>",
    to: email,
    subject: "Your Tryka Stats sign-in link",
    text:
      `Click the link below to sign in to Tryka Stats. It expires in 15 minutes and can only be used once.\n\n` +
      `${link}\n\nIf you didn't request this, you can ignore this email.`,
  });
  if (error) {
    console.error("[auth] Resend error:", error);
    return NextResponse.json(
      { error: "Couldn't send the sign-in email. Please try again." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
