import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tryka Stats",
  description: "Look up your Tryka race results and splits.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-5xl px-4 py-6">
          <header className="mb-6 flex items-baseline justify-between">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              Tryka Stats
            </Link>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
