"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Me = { email: string; primarySlug: string | null } | null;

export default function AuthNav() {
  const [me, setMe] = useState<Me | undefined>(undefined);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Me) => {
        if (!cancelled) setMe(data);
      })
      .catch(() => {
        if (!cancelled) setMe(null);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (me === undefined) return null;

  if (!me) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(pathname)}`}
        className="text-white hover:text-tryka-green"
      >
        Log in
      </Link>
    );
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    router.refresh();
  };

  return (
    <span className="flex items-center gap-4">
      <Link
        href={me.primarySlug ? `/athletes/${me.primarySlug}` : "/"}
        className="text-white hover:text-tryka-green"
        title={me.primarySlug ? undefined : "Search for your name to claim your profile"}
      >
        {me.primarySlug ? "My Profile" : "Find my profile"}
      </Link>
      <button type="button" onClick={logout} className="text-slate-400 hover:text-tryka-green">
        Log out
      </button>
    </span>
  );
}
