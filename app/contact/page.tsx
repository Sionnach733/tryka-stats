import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Tryka Stats team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-lg">
      <header className="mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-tryka-green">
          Contact Us
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Have a feature request, spotted a bug, noticed a data discrepancy, or
          just want to get in touch? Fill in the form below and we&rsquo;ll get
          back to you.
        </p>
      </header>
      <ContactForm />
      <p className="mt-4 text-xs text-slate-400">
        Your details are only used to reply to you. See our{" "}
        <Link href="/privacy" className="underline hover:text-tryka-green">
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}
