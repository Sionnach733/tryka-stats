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
          <header className="mb-6">
            <Link href="/" className="text-xl font-bold uppercase tracking-wider text-tryka-green">
              Tryka Stats
            </Link>
          </header>
          <main>{children}</main>
          <footer className="mt-12 border-t border-tryka-navy-light pt-6 pb-8 text-center text-xs text-slate-400">
            <p>
              Built by{" "}
              <a href={BMC_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-tryka-green">
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
              <a href={BMC_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-tryka-green">
                consider buying me a coffee
              </a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
