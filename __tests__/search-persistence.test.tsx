/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import ResultsTable from "@/app/components/ResultsTable";
import type { SearchHit } from "@/lib/queries";

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

const hit: SearchHit = {
  id: 42,
  race_name: "Test Race",
  division: "Elite",
  members: '["Jane Doe"]',
  gender: "W",
  overall_time: "01:23:45",
  rank_overall: 1,
  total_gender: 10,
  age_group: "30-34",
  rank_age_group: 1,
  total_age_group: 5,
};

describe("ResultsTable query persistence", () => {
  it("includes ?q= param in result links when query is provided", () => {
    render(<ResultsTable hits={[hit]} query="jane" />);
    const link = screen.getByRole("link", { name: "Jane Doe" });
    expect(link.getAttribute("href")).toBe("/results/42?q=jane");
  });

  it("does not include ?q= param when query is empty", () => {
    render(<ResultsTable hits={[hit]} query="" />);
    const link = screen.getByRole("link", { name: "Jane Doe" });
    expect(link.getAttribute("href")).toBe("/results/42");
  });

  it("does not include ?q= param when query is omitted", () => {
    render(<ResultsTable hits={[hit]} />);
    const link = screen.getByRole("link", { name: "Jane Doe" });
    expect(link.getAttribute("href")).toBe("/results/42");
  });

  it("encodes special characters in query param", () => {
    render(<ResultsTable hits={[hit]} query="o'brien" />);
    const link = screen.getByRole("link", { name: "Jane Doe" });
    expect(link.getAttribute("href")).toBe("/results/42?q=o'brien");
  });
});
