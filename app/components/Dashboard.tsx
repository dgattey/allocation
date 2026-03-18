"use client";

import { useState } from "react";
import type {
  FundOption,
  PortfolioData,
  TreeMapNode,
  TableRow,
  FilterState,
  SortConfig,
  TreeMapGrouping,
  ViewMode,
} from "@/lib/types";
import { formatDollar } from "@/lib/utils";
import { SlidingNumber } from "./primitives/SlidingNumber";
import { GainLoss } from "./primitives/GainLoss";
import { TreeMap } from "./TreeMap";
import { PortfolioTable } from "./PortfolioTable";
import { FloatingToolbar } from "./FloatingToolbar";
import { cn } from "@/lib/utils";

interface DashboardProps {
  portfolioData: PortfolioData;
  filteredTreeMapNodes: TreeMapNode[];
  filteredRows: TableRow[];
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  expandedRows: Set<string>;
  onToggleExpand: (symbol: string) => void;
  onClearData: () => void;
  isLoading: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  treeMapGrouping: TreeMapGrouping;
  onTreeMapGroupingChange: (mode: TreeMapGrouping) => void;
  selectedFunds: string[];
  onToggleFund: (symbol: string) => void;
  onClearFunds: () => void;
  fundOptions: FundOption[];
  selectedFundsSummary: {
    value: number;
    gainLoss: number;
    gainLossPercent: number;
    label: string;
  } | null;
}

export function Dashboard({
  portfolioData,
  filteredTreeMapNodes,
  filteredRows,
  filters,
  onFiltersChange,
  sortConfig,
  onSort,
  expandedRows,
  onToggleExpand,
  onClearData,
  isLoading,
  viewMode,
  onViewModeChange,
  treeMapGrouping,
  onTreeMapGroupingChange,
  selectedFunds,
  onToggleFund,
  onClearFunds,
  fundOptions,
  selectedFundsSummary,
}: DashboardProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { summary, lastUpdated } = portfolioData;

  const displayValue = selectedFundsSummary?.value ?? summary.totalValue;
  const displayGainLoss =
    selectedFundsSummary?.gainLoss ?? summary.totalGainLoss;
  const displayGainLossPercent =
    selectedFundsSummary?.gainLossPercent ?? summary.totalGainLossPercent;
  const headerLabel = selectedFundsSummary
    ? selectedFundsSummary.label
    : "Portfolio Allocation";

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Sticky Header */}
      <header className="sticky-header sticky top-0 z-30 px-6 py-5">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between gap-4">
            <div className="group/header">
              {/* Title row with hover-reveal back button */}
              <div className="flex items-center gap-2 mb-1">
                {/* Back button — appears on hover */}
                <button
                  onClick={() => {
                    if (showClearConfirm) {
                      onClearData();
                      setShowClearConfirm(false);
                    } else {
                      setShowClearConfirm(true);
                      // Auto-dismiss after 3 seconds
                      setTimeout(() => setShowClearConfirm(false), 3000);
                    }
                  }}
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-lg",
                    "transition-all duration-200 cursor-pointer",
                    "-ml-8 mr-0",
                    showClearConfirm
                      ? "opacity-100 translate-x-0 bg-negative/10 text-negative hover:bg-negative/20"
                      : "opacity-0 -translate-x-1 group-hover/header:opacity-60 group-hover/header:translate-x-0 hover:!opacity-100 hover:bg-surface-hover text-text-muted"
                  )}
                  title={
                    showClearConfirm
                      ? "Click again to confirm"
                      : "Start over with a new file"
                  }
                >
                  {showClearConfirm ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  )}
                </button>

                <h1
                  className={cn(
                    "text-sm font-medium transition-colors duration-300 truncate max-w-[500px]",
                    selectedFundsSummary ? "text-text-primary" : "text-text-muted"
                  )}
                >
                  {showClearConfirm ? (
                    <span className="text-negative animate-fade-in">
                      Click ← again to start over
                    </span>
                  ) : (
                    headerLabel
                  )}
                </h1>
              </div>

              <div className="flex items-baseline gap-4">
                <SlidingNumber
                  value={displayValue}
                  format={formatDollar}
                  className="text-3xl font-bold text-text-primary"
                />
                <GainLoss
                  dollar={displayGainLoss}
                  percent={displayGainLossPercent}
                  size="md"
                />
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Loading...
              </div>
            )}
          </div>
        </div>
      </header>

      {/* TreeMap */}
      <section className="px-6 mb-6 max-w-[1400px] mx-auto">
        <TreeMap
          nodes={filteredTreeMapNodes}
          originalWidth={1200}
          originalHeight={400}
          grouping={treeMapGrouping}
          selectedFunds={selectedFunds}
          onToggleFund={onToggleFund}
          onClearFunds={onClearFunds}
        />
      </section>

      {/* Table */}
      <section className="px-6 max-w-[1400px] mx-auto">
        <PortfolioTable
          rows={filteredRows}
          sortConfig={sortConfig}
          onSort={onSort}
          expandedRows={expandedRows}
          onToggleExpand={onToggleExpand}
        />
      </section>

      {/* Floating Toolbar */}
      <FloatingToolbar
        summary={summary}
        filters={filters}
        onFiltersChange={onFiltersChange}
        lastUpdated={lastUpdated}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        treeMapGrouping={treeMapGrouping}
        onTreeMapGroupingChange={onTreeMapGroupingChange}
        funds={fundOptions}
        selectedFunds={selectedFunds}
        onToggleFund={onToggleFund}
        onClearFunds={onClearFunds}
      />
    </div>
  );
}
