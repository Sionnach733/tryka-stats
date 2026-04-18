/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import ResultTabs from "@/app/components/ResultTabs";

afterEach(cleanup);

describe("ResultTabs", () => {
  it("shows workout content by default", () => {
    render(
      <ResultTabs
        workoutContent={<div>Workout Table</div>}
        splitsContent={<div>Splits Table</div>}
      />
    );
    expect(screen.getByText("Workout Table")).toBeTruthy();
    expect(screen.queryByText("Splits Table")).toBeNull();
  });

  it("switches to splits content when Splits tab is clicked", () => {
    render(
      <ResultTabs
        workoutContent={<div>Workout Table</div>}
        splitsContent={<div>Splits Table</div>}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Splits" }));

    expect(screen.getByText("Splits Table")).toBeTruthy();
    expect(screen.queryByText("Workout Table")).toBeNull();
  });

  it("switches back to workout content when Workout Result tab is clicked", () => {
    render(
      <ResultTabs
        workoutContent={<div>Workout Table</div>}
        splitsContent={<div>Splits Table</div>}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Splits" }));
    fireEvent.click(screen.getByRole("button", { name: "Workout Result" }));

    expect(screen.getByText("Workout Table")).toBeTruthy();
    expect(screen.queryByText("Splits Table")).toBeNull();
  });
});
