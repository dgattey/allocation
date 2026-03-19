import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeHowItWorksSection } from "../HomeHowItWorksSection";

describe("HomeHowItWorksSection", () => {
  it("shows how-it-works copy and privacy basics", () => {
    render(<HomeHowItWorksSection />);
    expect(screen.getByText("How it works")).toBeInTheDocument();
    expect(screen.getByText(/treemap/i)).toBeVisible();
    expect(screen.getByText(/no brokerage login/i)).toBeVisible();
    expect(screen.getByText(/this browser/i)).toBeVisible();
  });
});
