import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GainLoss } from "../GainLoss";

describe("GainLoss", () => {
  it("renders formatted dollar value", () => {
    render(<GainLoss dollar={1234.56} />);
    expect(screen.getByText("$1,234.56")).toBeInTheDocument();
  });

  it("renders formatted percent value", () => {
    render(<GainLoss percent={12.34} />);
    expect(screen.getByText("+12.34%")).toBeInTheDocument();
  });

  it("renders both dollar and percent", () => {
    const { container } = render(<GainLoss dollar={100} percent={5.5} />);
    expect(container.textContent).toContain("$100.00");
    expect(container.textContent).toContain("+5.50%");
  });

  it("applies positive color class for positive values", () => {
    const { container } = render(<GainLoss dollar={100} />);
    expect(container.firstChild).toHaveClass("text-positive");
  });

  it("applies negative color class for negative values", () => {
    const { container } = render(<GainLoss dollar={-50} />);
    expect(container.firstChild).toHaveClass("text-negative");
  });

  it("applies muted color class for zero", () => {
    const { container } = render(<GainLoss dollar={0} />);
    expect(container.firstChild).toHaveClass("text-text-muted");
  });

  it("uses small text size when size=sm", () => {
    const { container } = render(<GainLoss dollar={100} size="sm" />);
    expect(container.firstChild).toHaveClass("text-xs");
  });
});
