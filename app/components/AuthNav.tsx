"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Me = { email: string; primarySlug: string | null } | null;

export default function AuthNav() {
  const [me, setMe] = useState<Me | undefined>(undefined);
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu on navigation, outside click, or Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

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
    setOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    router.refresh();
  };

  // Logged in but no profile claimed yet: a plain link, plus log out.
  if (!me.primarySlug) {
    return (
      <span className="flex items-center gap-4">
        <Link
          href="/"
          className="text-white hover:text-tryka-green"
          title="Search for your name to claim your profile"
        >
          Find my profile
        </Link>
        <button type="button" onClick={logout} className="text-slate-400 hover:text-tryka-green">
          Log out
        </button>
      </span>
    );
  }

  const itemClass = "block w-full px-3 py-2 text-left text-sm text-white hover:bg-tryka-navy hover:text-tryka-green";
  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1 text-white hover:text-tryka-green"
      >
        My Profile <span aria-hidden="true" className="text-xs">▾</span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-md border border-tryka-navy-light bg-tryka-navy-light shadow-lg"
        >
          <Link role="menuitem" href={`/athletes/${me.primarySlug}`} className={itemClass}>
            View profile
          </Link>
          <Link role="menuitem" href={`/athletes/${me.primarySlug}#manage`} className={itemClass}>
            Manage results
          </Link>
          <button role="menuitem" type="button" onClick={logout} className={`${itemClass} border-t border-tryka-navy text-slate-300`}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
