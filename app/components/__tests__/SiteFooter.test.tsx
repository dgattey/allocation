import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooterInner } from "../SiteFooter";

describe("SiteFooterInner", () => {
  it("shows copyright with given year and creator link", () => {
    render(<SiteFooterInner year={2026} />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText(/© 2026 Dylan Gattey/)).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "gattey.com" });
    expect(link).toHaveAttribute("href", "https://gattey.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
