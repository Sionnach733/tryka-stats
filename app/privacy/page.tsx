import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What personal data Tryka Stats collects, why, and how to have it removed.",
  alternates: { canonical: "https://trykastats.com/privacy" },
};

const UPDATED = "20 November 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-slate-300">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold uppercase tracking-wider text-tryka-green">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-slate-400">Last updated {UPDATED}</p>
      <p className="mt-4 text-sm leading-relaxed text-slate-300">
        Tryka Stats is an independent, unofficial site for searching and analysing Tryka race
        results. It is run by an individual, not by Tryka. This page explains what personal data
        the site handles and the choices you have.
      </p>

      <Section title="Who is responsible">
        <p>
          The site is run by Sionnach733 (&ldquo;we&rdquo;). For anything in this policy, use the{" "}
          <Link href="/contact" className="text-tryka-green hover:underline">
            contact form
          </Link>
          .
        </p>
      </Section>

      <Section title="Race results">
        <p>
          Results, names, age groups, finish times and splits shown on the site come from the
          publicly available Tryka race results pages. We collect and republish them so that
          athletes can search and compare results. We rely on our legitimate interest in providing
          this service. Results are grouped into athlete profiles by name, so a profile may include
          results from different people with the same name until the athlete claims it.
        </p>
        <p>
          If you would like a result or name removed or corrected, contact us and we will deal with
          it.
        </p>
      </Section>

      <Section title="Your account">
        <p>
          You do not need an account to use the site. If you log in to claim your profile, we
          store:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>your email address;</li>
          <li>
            which athlete profile and results you have claimed, and any results you have hidden or
            added;
          </li>
          <li>
            a login session, kept for 30 days. We store only a hash of the session and sign-in link
            tokens, never the tokens themselves.
          </li>
        </ul>
        <p>
          We use this to sign you in without a password and to let you manage your profile. The
          legal basis is providing the service you asked for. We keep your account until you ask us
          to delete it.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          The only cookie we set is a login cookie (<code>tryka_session</code>) after you sign in.
          It is strictly necessary for staying logged in, lasts 30 days and is removed when you log
          out. We do not use advertising or analytics cookies.
        </p>
      </Section>

      <Section title="Contact form and emails">
        <p>
          If you use the contact form, your name, email address and message are emailed to us so we
          can reply. We do not keep them in a database. Sign-in emails contain a single-use link
          that expires after 15 minutes.
        </p>
      </Section>

      <Section title="Who we share data with">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Resend</strong>, the email service that delivers sign-in and contact emails, so
            it processes the addresses and messages involved.
          </li>
          <li>
            <strong>Our hosting provider</strong>, whose servers store the site and its database.
          </li>
        </ul>
        <p>We do not sell your data or share it for advertising.</p>
      </Section>

      <Section title="Your rights">
        <p>
          You can ask us for a copy of your data, to correct it, or to delete it, including deleting
          your account and releasing your claimed profile. You can also object to us showing your
          race results. Contact us and we will respond within a month. If you are unhappy with how
          we handle your data you can complain to the Data Protection Commission (Ireland) at{" "}
          <a
            href="https://www.dataprotection.ie"
            target="_blank"
            rel="noopener noreferrer"
            className="text-tryka-green hover:underline"
          >
            dataprotection.ie
          </a>
          .
        </p>
      </Section>

      <Section title="Changes">
        <p>If this policy changes, we will update the date at the top of this page.</p>
      </Section>
    </div>
  );
}
