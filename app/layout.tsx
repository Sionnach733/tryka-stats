import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tryka Stats",
  description: "Look up your Tryka race results and splits.",
};

const BMC_URL = "https://buymeacoffee.com/sionnach733";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-5xl px-4 py-6">
          <header className="mb-6 flex items-baseline justify-between">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              Tryka Stats
            </Link>
            <a
              href={BMC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FFDD00] px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition-transform hover:scale-105"
            >
              <Image src="/bmc-qr.png" alt="" width={16} height={16} className="rounded-sm" />
              Buy me a coffee
            </a>
          </header>
          <main>{children}</main>
          <footer className="mt-12 border-t border-slate-200 pt-6 pb-8 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
            <p>
              Built by{" "}
              <a href={BMC_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600 dark:hover:text-slate-300">
                Sionnach733
              </a>
            </p>
            <a
              href={BMC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block"
            >
              <Image
                src="/bmc-qr.png"
                alt="Buy me a coffee QR code"
                width={120}
                height={120}
                className="mx-auto rounded-lg"
              />
            </a>
            <p className="mt-2">
              If you find this useful,{" "}
              <a href={BMC_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600 dark:hover:text-slate-300">
                consider buying me a coffee
              </a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
