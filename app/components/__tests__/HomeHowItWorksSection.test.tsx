import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { HomeHowItWorksSection } from "../HomeHowItWorksSection";

describe("HomeHowItWorksSection", () => {
  it("shows a compact disclosure with privacy and data-flow basics", () => {
    render(<HomeHowItWorksSection />);
    const summary = screen.getByText("How does it work?");
    expect(summary).toBeInTheDocument();

    const details = summary.closest("details");
    expect(details).toBeTruthy();
    expect(details).toHaveProperty("open", false);

    fireEvent.click(summary);
    expect(details).toHaveProperty("open", true);

    expect(screen.getByText(/treemap/i)).toBeVisible();
    expect(screen.getByText(/no brokerage login/i)).toBeVisible();
    expect(screen.getByText(/this browser/i)).toBeVisible();
  });
});
