/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import ResultTabs from "@/app/components/ResultTabs";

// Mock next/navigation hooks
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => "/results/1",
}));

afterEach(cleanup);

const tabProps = {
  workoutContent: <div>Workout Table</div>,
  splitsContent: <div>Splits Table</div>,
  stationsContent: <div>Stations Grid</div>,
};

describe("ResultTabs", () => {
  it("shows workout content by default", () => {
    render(<ResultTabs {...tabProps} />);
    expect(screen.getByText("Workout Table")).toBeTruthy();
    expect(screen.queryByText("Splits Table")).toBeNull();
    expect(screen.queryByText("Stations Grid")).toBeNull();
  });

  it("switches to splits content when Splits tab is clicked", () => {
    render(<ResultTabs {...tabProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Splits" }));

    expect(screen.getByText("Splits Table")).toBeTruthy();
    expect(screen.queryByText("Workout Table")).toBeNull();
    expect(screen.queryByText("Stations Grid")).toBeNull();
  });

  it("switches to stations content when Stations tab is clicked", () => {
    render(<ResultTabs {...tabProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Stations" }));

    expect(screen.getByText("Stations Grid")).toBeTruthy();
    expect(screen.queryByText("Workout Table")).toBeNull();
    expect(screen.queryByText("Splits Table")).toBeNull();
  });

  it("switches back to workout content when Workout Result tab is clicked", () => {
    render(<ResultTabs {...tabProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Stations" }));
    fireEvent.click(screen.getByRole("button", { name: "Workout Result" }));

    expect(screen.getByText("Workout Table")).toBeTruthy();
    expect(screen.queryByText("Splits Table")).toBeNull();
    expect(screen.queryByText("Stations Grid")).toBeNull();
  });
});
