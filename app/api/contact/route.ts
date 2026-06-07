import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !EMAIL_RE.test(email) ||
    typeof message !== "string" || !message.trim()
  ) {
    return NextResponse.json({ error: "Please fill in all fields with valid values." }, { status: 422 });
  }

  const { error } = await resend.emails.send({
    from: "Tryka Stats <noreply@trykastats.com>",
    to: "info@trykastats.com",
    replyTo: email,
    subject: `Tryka Stats contact: ${name.trim()}`,
    text: `Name: ${name.trim()}\nEmail: ${email}\n\n${message.trim()}`,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
