import { describe, it, expect } from "vitest";
import { signInEmail } from "@/lib/authEmail";

const link = "https://trykastats.com/api/auth/verify?token=abc_-123&next=%2Fathletes%2Femer-breen";

describe("signInEmail", () => {
  const { subject, html, text } = signInEmail(link);

  it("keeps the subject", () => {
    expect(subject).toBe("Your Tryka Stats sign-in link");
  });

  it("puts the escaped link on the button only", () => {
    const escaped = link.replace(/&/g, "&amp;");
    expect(html).toContain(`href="${escaped}"`);
    expect(html).toContain(">Sign in</a>");
    // The link must not appear as visible text or unescaped anywhere.
    expect(html.split(escaped)).toHaveLength(2);
    expect(html).not.toContain(link);
  });

  it("uses the site colours", () => {
    expect(html).toContain("#171F38");
    expect(html).toContain("#06e38b");
  });

  it("escapes markup in the link", () => {
    const evil = signInEmail('https://x.test/?a="><script>alert(1)</script>').html;
    expect(evil).not.toContain("<script>alert");
  });

  it("text part has the plain link and expiry note", () => {
    expect(text).toContain(link);
    expect(text).toContain("15 minutes");
    expect(text).toContain("once");
  });
});
