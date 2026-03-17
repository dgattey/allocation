import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../Badge";

describe("Badge", () => {
  it("renders label text", () => {
    render(<Badge label="Stocks" />);
    expect(screen.getByText("Stocks")).toBeInTheDocument();
  });

  it("renders ETFs variant", () => {
    render(<Badge label="ETFs" />);
    expect(screen.getByText("ETFs")).toBeInTheDocument();
  });

  it("renders Mutual Funds variant", () => {
    render(<Badge label="Mutual Funds" />);
    expect(screen.getByText("Mutual Funds")).toBeInTheDocument();
  });

  it("renders Cash variant", () => {
    render(<Badge label="Cash" />);
    expect(screen.getByText("Cash")).toBeInTheDocument();
  });

  it("renders Others variant for unknown labels", () => {
    render(<Badge label="Unknown" />);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("applies Stocks-specific styling", () => {
    const { container } = render(<Badge label="Stocks" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("bg-blue-50");
  });

  it("applies ETFs-specific styling", () => {
    const { container } = render(<Badge label="ETFs" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("bg-violet-50");
  });
});
