import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The rules for using Tryka Stats, including claiming athlete profiles.",
  alternates: { canonical: "https://trykastats.com/terms" },
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

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold uppercase tracking-wider text-tryka-green">
        Terms of Use
      </h1>
      <p className="mt-2 text-sm text-slate-400">Last updated {UPDATED}</p>
      <p className="mt-4 text-sm leading-relaxed text-slate-300">
        By using Tryka Stats you agree to these terms. They are short and meant to be read. How we
        handle personal data is covered in the{" "}
        <Link href="/privacy" className="text-tryka-green hover:underline">
          privacy policy
        </Link>
        .
      </p>

      <Section title="About the site">
        <p>
          Tryka Stats is an independent, unofficial project. It is not run, endorsed or sponsored
          by Tryka. &ldquo;Tryka&rdquo; and related names belong to their owners and are used here
          only to describe the races whose results are shown.
        </p>
      </Section>

      <Section title="Accuracy of the data">
        <p>
          Results, splits, rankings and statistics come from publicly available race results and
          may contain errors, gaps or mistakes introduced when collecting them. Athlete profiles
          are grouped by name, so a profile can include results from different people with the same
          name. The site is provided &ldquo;as is&rdquo; and we do not guarantee that anything on
          it is accurate, complete or up to date. Official results are the ones published by
          Tryka.
        </p>
      </Section>

      <Section title="Accounts and claiming a profile">
        <ul className="list-disc space-y-1 pl-5">
          <li>Only claim a profile and results that are yours.</li>
          <li>
            Each name group and each result can be claimed by one account at a time. If someone
            else has claimed your name or result, contact us and we will look into it.
          </li>
          <li>
            You can untick results that are not yours and add results entered under a misspelled
            name. Do not use this to take over or hide another athlete&rsquo;s results.
          </li>
          <li>
            We may remove a claim, or close an account, if it is misused or we have reason to
            believe it belongs to someone else.
          </li>
          <li>You can ask us to delete your account at any time.</li>
        </ul>
      </Section>

      <Section title="Acceptable use">
        <p>Please do not:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>impersonate another person or claim results that are not yours;</li>
          <li>
            send automated or high-volume requests to the site, or try to disrupt or gain
            unauthorised access to it;
          </li>
          <li>misuse the sign-in or contact forms, for example to send spam.</li>
        </ul>
      </Section>

      <Section title="Our content">
        <p>
          The way the site is built and presented, including the analysis and charts, belongs to
          us. The underlying race results belong to their respective sources. You may share links
          and screenshots for personal and non-commercial use, with credit to Tryka Stats.
        </p>
      </Section>

      <Section title="Liability">
        <p>
          The site is a free hobby project. To the extent the law allows, we are not responsible
          for losses that result from using it or relying on its data, or from it being unavailable.
          Nothing in these terms limits any rights you have that cannot be limited by law.
        </p>
      </Section>

      <Section title="Changes and contact">
        <p>
          We may update these terms and will change the date above when we do. Continuing to use
          the site means you accept the updated terms. Questions, corrections and removal requests:
          use the{" "}
          <Link href="/contact" className="text-tryka-green hover:underline">
            contact form
          </Link>
          . These terms are governed by Irish law.
        </p>
      </Section>
    </div>
  );
}
