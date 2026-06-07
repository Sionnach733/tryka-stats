import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL("https://trykastats.com"),
  title: {
    default: "Tryka Stats – Tryka Race Results & Splits",
    template: "%s | Tryka Stats",
  },
  description:
    "Search and analyse your Tryka race results, splits, station times, and rankings.",
  openGraph: {
    title: "Tryka Stats",
    description:
      "Search and analyse your Tryka race results, splits, station times, and rankings.",
    url: "https://trykastats.com",
    siteName: "Tryka Stats",
    type: "website",
    locale: "en_IE",
  },
  twitter: {
    card: "summary",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const BMC_URL = "https://buymeacoffee.com/sionnach733";
const INSTAGRAM_URL = "https://www.instagram.com/tryka.stats/";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Tryka Stats",
              url: "https://trykastats.com",
              description:
                "Search and analyse your Tryka race results, splits, station times, and rankings.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://trykastats.com/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <div className="mx-auto max-w-5xl px-4 py-6">
          <Navbar />
          <main>{children}</main>
          <footer className="mt-12 border-t border-tryka-navy-light pt-6 pb-8 text-center text-xs text-slate-400">
            <p>
              Built by{" "}
              <a href={BMC_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-tryka-green">
                Sionnach733
              </a>
            </p>
            <p className="mt-2">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow tryka.stats on Instagram"
                className="inline-flex items-center gap-1.5 hover:text-tryka-green transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                tryka.stats
              </a>
            </p>
            <p className="mt-2">
              <Link href="/contact" className="hover:text-tryka-green transition-colors">
                Contact
              </Link>
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
