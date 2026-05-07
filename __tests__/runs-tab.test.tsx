/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import RunCard from "@/app/components/RunCard";
import type { RunData } from "@/app/components/RunCard";
import RunsGrid from "@/app/components/RunsGrid";

afterEach(cleanup);

const baseRun: RunData = {
  run: "Running 1",
  time: 301,
  rank: 12,
  totalCompetitors: 200,
  percentile: 6.0,
  fieldTimes: [180, 200, 250, 301, 350, 400, 500],
  xMin: 180,
  xMax: 500,
};

describe("RunCard", () => {
  it("renders run name, rank, time, and percentile", () => {
    render(<RunCard data={baseRun} />);
    expect(screen.getByText("Running 1")).toBeTruthy();
    expect(screen.getByText("#12 of 200")).toBeTruthy();
    expect(screen.getByText("05:01")).toBeTruthy();
    expect(screen.getByText("top 6.0%")).toBeTruthy();
  });

  it("shows N/A when time is null", () => {
    render(
      <RunCard
        data={{ ...baseRun, time: null, rank: null, percentile: null }}
      />
    );
    const nas = screen.getAllByText("N/A");
    expect(nas.length).toBe(2);
  });

  it("applies gold border for rank 1", () => {
    const { container } = render(
      <RunCard data={{ ...baseRun, rank: 1 }} />
    );
    const card = container.firstElementChild!;
    expect(card.className).toContain("border-l-yellow-400");
  });

  it("applies silver border for rank 2", () => {
    const { container } = render(
      <RunCard data={{ ...baseRun, rank: 2 }} />
    );
    const card = container.firstElementChild!;
    expect(card.className).toContain("border-l-slate-400");
  });

  it("applies bronze border for rank 3", () => {
    const { container } = render(
      <RunCard data={{ ...baseRun, rank: 3 }} />
    );
    const card = container.firstElementChild!;
    expect(card.className).toContain("border-l-amber-700");
  });

  it("does not apply rank border for rank > 3", () => {
    const { container } = render(
      <RunCard data={{ ...baseRun, rank: 10 }} />
    );
    const card = container.firstElementChild!;
    expect(card.className).not.toContain("border-l-yellow");
    expect(card.className).not.toContain("border-l-amber");
  });

  it("renders KDE plot with aria-label", () => {
    render(<RunCard data={baseRun} />);
    const plot = screen.getByRole("img");
    expect(plot.getAttribute("aria-label")).toContain("7 competitors");
    expect(plot.getAttribute("aria-label")).toContain("05:01");
  });
});

describe("RunsGrid", () => {
  it("renders message when no runs", () => {
    render(<RunsGrid runs={[]} />);
    expect(screen.getByText("No run data available.")).toBeTruthy();
  });

  it("renders a card for each run", () => {
    const runs: RunData[] = [
      { ...baseRun, run: "Running 1" },
      { ...baseRun, run: "Running 2" },
    ];
    render(<RunsGrid runs={runs} />);
    expect(screen.getByText("Running 1")).toBeTruthy();
    expect(screen.getByText("Running 2")).toBeTruthy();
  });
});
