/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import AthleteResultsTable from "@/app/components/AthleteResultsTable";
import type { AthleteHit } from "@/lib/athletes";

afterEach(cleanup);

// Stub next/link to render a plain <a> so we can inspect href
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const hit: AthleteHit = {
  slug: "jane-doe",
  name: "Jane Doe",
  resultCount: 3,
  races: ["Test Race", "Other Race"],
  divisions: ["Elite"],
  latestRace: "Test Race",
  claimed: false,
};

describe("AthleteResultsTable query persistence", () => {
  it("includes ?q= param in profile links when query is provided", () => {
    render(<AthleteResultsTable hits={[hit]} query="jane" />);
    const link = screen.getByRole("link", { name: "Jane Doe" });
    expect(link.getAttribute("href")).toBe("/athletes/jane-doe?q=jane");
  });

  it("does not include ?q= param when query is empty", () => {
    render(<AthleteResultsTable hits={[hit]} query="" />);
    const link = screen.getByRole("link", { name: "Jane Doe" });
    expect(link.getAttribute("href")).toBe("/athletes/jane-doe");
  });

  it("does not include ?q= param when query is omitted", () => {
    render(<AthleteResultsTable hits={[hit]} />);
    const link = screen.getByRole("link", { name: "Jane Doe" });
    expect(link.getAttribute("href")).toBe("/athletes/jane-doe");
  });

  it("encodes special characters in query param", () => {
    render(<AthleteResultsTable hits={[hit]} query="o'brien" />);
    const link = screen.getByRole("link", { name: "Jane Doe" });
    expect(link.getAttribute("href")).toBe("/athletes/jane-doe?q=o'brien");
  });

  it("shows a claimed badge", () => {
    render(<AthleteResultsTable hits={[{ ...hit, claimed: true }]} />);
    expect(screen.getByText("Claimed")).toBeTruthy();
  });
});
