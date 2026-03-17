import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pill } from "../Pill";

describe("Pill", () => {
  it("renders label text", () => {
    render(<Pill label="Stocks" />);
    expect(screen.getByText("Stocks")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Pill label="ETFs" onClick={onClick} />);
    fireEvent.click(screen.getByText("ETFs"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("shows count badge when count provided", () => {
    render(<Pill label="Stocks" count={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("does not show count when not provided", () => {
    render(<Pill label="Stocks" />);
    expect(screen.queryByText("5")).not.toBeInTheDocument();
  });

  it("applies active styling class when active", () => {
    const { container } = render(<Pill label="Stocks" active />);
    const button = container.querySelector("button");
    expect(button?.className).toContain("bg-accent");
  });

  it("applies inactive styling when not active", () => {
    const { container } = render(<Pill label="Stocks" />);
    const button = container.querySelector("button");
    expect(button?.className).toContain("bg-surface");
  });
});
