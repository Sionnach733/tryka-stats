/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import StationCard from "@/app/components/StationCard";
import type { StationData } from "@/app/components/StationCard";
import StationsGrid from "@/app/components/StationsGrid";

afterEach(cleanup);

const baseStation: StationData = {
  station: "SkiErg",
  time: 245,
  rank: 4,
  totalCompetitors: 45,
  percentile: 8.9,
  fieldTimes: [100, 150, 200, 245, 300, 350, 400],
  xMin: 30,
  xMax: 600,
};

describe("StationCard", () => {
  it("renders station name, rank, time, and percentile", () => {
    render(<StationCard data={baseStation} />);
    expect(screen.getByText("SkiErg")).toBeTruthy();
    expect(screen.getByText("#4 of 45")).toBeTruthy();
    expect(screen.getByText("04:05")).toBeTruthy();
    expect(screen.getByText("top 8.9%")).toBeTruthy();
  });

  it("shows N/A when time is null", () => {
    render(
      <StationCard
        data={{ ...baseStation, time: null, rank: null, percentile: null }}
      />
    );
    const nas = screen.getAllByText("N/A");
    expect(nas.length).toBe(2); // rank and time
  });

  it("applies gold border for rank 1", () => {
    const { container } = render(
      <StationCard data={{ ...baseStation, rank: 1 }} />
    );
    const card = container.firstElementChild!;
    expect(card.className).toContain("border-l-yellow-400");
  });

  it("applies silver border for rank 2", () => {
    const { container } = render(
      <StationCard data={{ ...baseStation, rank: 2 }} />
    );
    const card = container.firstElementChild!;
    expect(card.className).toContain("border-l-slate-400");
  });

  it("applies bronze border for rank 3", () => {
    const { container } = render(
      <StationCard data={{ ...baseStation, rank: 3 }} />
    );
    const card = container.firstElementChild!;
    expect(card.className).toContain("border-l-amber-700");
  });

  it("does not apply rank border for rank > 3", () => {
    const { container } = render(
      <StationCard data={{ ...baseStation, rank: 10 }} />
    );
    const card = container.firstElementChild!;
    expect(card.className).not.toContain("border-l-yellow");
    expect(card.className).not.toContain("border-l-amber");
  });

  it("renders KDE plot with aria-label", () => {
    render(<StationCard data={baseStation} />);
    const plot = screen.getByRole("img");
    expect(plot.getAttribute("aria-label")).toContain("7 competitors");
    expect(plot.getAttribute("aria-label")).toContain("04:05");
  });
});

describe("StationsGrid", () => {
  it("renders message when no stations", () => {
    render(<StationsGrid stations={[]} />);
    expect(screen.getByText("No station data available.")).toBeTruthy();
  });

  it("renders a card for each station", () => {
    const stations: StationData[] = [
      { ...baseStation, station: "SkiErg" },
      { ...baseStation, station: "Rowing" },
    ];
    render(<StationsGrid stations={stations} />);
    expect(screen.getByText("SkiErg")).toBeTruthy();
    expect(screen.getByText("Rowing")).toBeTruthy();
  });
});
