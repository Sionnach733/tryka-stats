"use client";

import { useState } from "react";

export default function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, next }),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setStatus("idle");
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 px-3 py-2 text-sm text-tryka-green">
        Check your inbox — we&apos;ve sent a sign-in link to <strong>{email}</strong>. It
        expires in 15 minutes.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block">
        <span className="text-xs uppercase tracking-wide text-slate-400">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-tryka-navy-light bg-tryka-navy-light px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-400 focus:border-tryka-green focus:outline-none focus:ring-1 focus:ring-tryka-green"
          placeholder="you@example.com"
        />
      </label>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-md bg-tryka-green px-3 py-1.5 text-sm font-medium text-tryka-navy hover:bg-tryka-green/90 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Email me a sign-in link"}
      </button>
    </form>
  );
}
