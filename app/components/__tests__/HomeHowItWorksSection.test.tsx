import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeHowItWorksSection } from "../HomeHowItWorksSection";

describe("HomeHowItWorksSection", () => {
  it("explains the app, data flow, and privacy", () => {
    render(<HomeHowItWorksSection />);
    expect(
      screen.getByRole("heading", { name: /how does it work/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Fidelity positions CSV/i)).toBeInTheDocument();
    expect(screen.getByText(/treemap/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy:/i)).toBeInTheDocument();
    expect(screen.getByText(/in this browser/i)).toBeInTheDocument();
  });
});
