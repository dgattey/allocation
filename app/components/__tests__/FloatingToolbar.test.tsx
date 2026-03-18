import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FloatingToolbar } from "../FloatingToolbar";

function makeProps() {
  return {
    summary: {
      totalValue: 100000,
      totalGainLoss: 5000,
      totalGainLossPercent: 5,
      accounts: ["Brokerage", "Roth IRA"],
      investmentTypes: ["Stocks", "ETFs"],
    },
    filters: {
      investmentTypes: [],
      accounts: [],
    },
    onFiltersChange: vi.fn(),
    lastUpdated: new Date().toISOString(),
    viewMode: "holdings" as const,
    onViewModeChange: vi.fn(),
    treeMapGrouping: "fund" as const,
    onTreeMapGroupingChange: vi.fn(),
    funds: [
      {
        symbol: "VTI",
        name: "Vanguard Total Stock Market",
        color: "#4E9999",
        value: 1000,
        hasChildren: true,
      },
      {
        symbol: "SPY",
        name: "SPDR S&P 500",
        color: "#8B74AB",
        value: 800,
        hasChildren: true,
      },
    ],
    selectedFunds: [],
    onToggleFund: vi.fn(),
    onClearFunds: vi.fn(),
  };
}

describe("FloatingToolbar", () => {
  it("switches treemap grouping and toggles fund chips", () => {
    const props = makeProps();
    render(<FloatingToolbar {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Flat" }));
    expect(props.onTreeMapGroupingChange).toHaveBeenCalledWith("holding");

    fireEvent.click(screen.getByRole("button", { name: "VTI" }));
    expect(props.onToggleFund).toHaveBeenCalledWith("VTI");

    fireEvent.click(screen.getByRole("button", { name: "All funds" }));
    expect(props.onClearFunds).toHaveBeenCalledTimes(1);
  });

  it("resets filters and fund selections together", () => {
    const props = makeProps();
    props.filters = {
      investmentTypes: ["Stocks"],
      accounts: ["Brokerage"],
    };
    props.selectedFunds = ["VTI"];

    render(<FloatingToolbar {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(props.onFiltersChange).toHaveBeenCalledWith({
      investmentTypes: [],
      accounts: [],
    });
    expect(props.onClearFunds).toHaveBeenCalledTimes(1);
  });

  it("updates the account filter from the simplified select", () => {
    const props = makeProps();
    render(<FloatingToolbar {...props} />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Roth IRA" },
    });

    expect(props.onFiltersChange).toHaveBeenCalledWith({
      investmentTypes: [],
      accounts: ["Roth IRA"],
    });
  });
});
