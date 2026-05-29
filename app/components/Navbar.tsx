"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/stations", label: "Stations" },
  { href: "/calculator", label: "Race Calculator" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-tryka-navy-light pb-3">
      <Link
        href="/"
        className="text-xl font-bold uppercase tracking-wider text-tryka-green"
      >
        Tryka Stats
      </Link>
      <nav>
        <ul className="flex flex-wrap items-center gap-4 text-sm font-medium">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    active
                      ? "text-tryka-green"
                      : "text-white hover:text-tryka-green"
                  }
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
