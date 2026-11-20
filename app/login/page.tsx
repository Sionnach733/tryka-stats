import type { Metadata } from "next";
import Link from "next/link";
import { safeNext } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false },
};

type SearchParams = Promise<{ next?: string; error?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const { next, error } = await searchParams;
  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold uppercase tracking-wider text-tryka-green">Log in</h1>
      <p className="mt-2 text-sm text-slate-300">
        Sign in to claim your athlete profile, hide results that aren&apos;t yours and add any
        that were entered under a misspelled name. No password needed — we&apos;ll email you a link.
      </p>
      {error === "expired" && (
        <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-400">
          That sign-in link is invalid or has expired. Request a new one below.
        </p>
      )}
      <div className="mt-6 rounded-lg border border-tryka-navy-light bg-tryka-navy-light px-4 py-4 shadow-sm">
        <LoginForm next={safeNext(next)} />
      </div>
      <p className="mt-4 text-xs text-slate-400">
        We store your email to sign you in. See our{" "}
        <Link href="/privacy" className="underline hover:text-tryka-green">
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}
