"use client";

import { useEffect, useRef, useState } from "react";
import type {
  PortfolioData,
  TreeMapNode,
  TableRow,
  FilterState,
  SortConfig,
  ViewMode,
} from "@/lib/types";
import { formatDollar } from "@/lib/utils";
import { logDebugEvent } from "@/lib/debugClient";
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
  focusedFund: string | null;
  onFocusFund: (symbol: string | null) => void;
  focusedSummary: {
    value: number;
    gainLoss: number;
    gainLossPercent: number;
    name: string;
    color: string;
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
  focusedFund,
  onFocusFund,
  focusedSummary,
}: DashboardProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const clearButtonRef = useRef<HTMLButtonElement | null>(null);
  const clearConfirmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const { summary, lastUpdated } = portfolioData;

  const displayValue = focusedSummary?.value ?? summary.totalValue;
  const displayGainLoss = focusedSummary?.gainLoss ?? summary.totalGainLoss;
  const displayGainLossPercent =
    focusedSummary?.gainLossPercent ?? summary.totalGainLossPercent;
  const headerLabel = focusedSummary
    ? focusedSummary.name
    : "Portfolio Allocation";

  const focusedFundInfo = focusedSummary
    ? {
        symbol: focusedFund!,
        name: focusedSummary.name,
        color: focusedSummary.color,
      }
    : null;

  useEffect(() => {
    // #region agent log
    logDebugEvent({
      hypothesisId: "C",
      location: "app/components/Dashboard.tsx:mount",
      message: "Dashboard mounted",
      data: {
        hasPortfolioData: true,
        showClearConfirm: false,
      },
    });
    // #endregion

    return () => {
      // #region agent log
      logDebugEvent({
        hypothesisId: "C",
        location: "app/components/Dashboard.tsx:unmount",
        message: "Dashboard unmounted",
        data: {
          hadTimeout: clearConfirmTimeoutRef.current !== null,
        },
      });
      // #endregion

      if (clearConfirmTimeoutRef.current) {
        clearTimeout(clearConfirmTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // #region agent log
    logDebugEvent({
      hypothesisId: "A",
      location: "app/components/Dashboard.tsx:showClearConfirm",
      message: "Clear confirmation state changed",
      data: {
        showClearConfirm,
        timeoutActive: clearConfirmTimeoutRef.current !== null,
      },
    });
    // #endregion

    if (showClearConfirm && clearButtonRef.current) {
      const rect = clearButtonRef.current.getBoundingClientRect();

      // #region agent log
      logDebugEvent({
        hypothesisId: "D",
        location: "app/components/Dashboard.tsx:confirmState",
        message: "Confirm button bounds after render",
        data: {
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
      });
      // #endregion
    }

    if (!showClearConfirm) {
      return;
    }

    function handleDocumentPointerDown(event: PointerEvent) {
      const target = event.target instanceof HTMLElement ? event.target : null;
      const button = clearButtonRef.current;
      const rect = button?.getBoundingClientRect();

      // #region agent log
      logDebugEvent({
        hypothesisId: "D",
        location: "app/components/Dashboard.tsx:documentPointerDownCapture",
        message: "Document pointerdown captured during confirm",
        data: {
          clientX: event.clientX,
          clientY: event.clientY,
          targetTag: target?.tagName ?? null,
          targetText: target?.textContent?.trim().slice(0, 80) ?? null,
          targetAriaLabel: target?.getAttribute("aria-label") ?? null,
          withinButton: Boolean(button && target && button.contains(target)),
          buttonLeft: rect ? Math.round(rect.left) : null,
          buttonRight: rect ? Math.round(rect.right) : null,
          buttonTop: rect ? Math.round(rect.top) : null,
          buttonBottom: rect ? Math.round(rect.bottom) : null,
        },
      });
      // #endregion
    }

    document.addEventListener("pointerdown", handleDocumentPointerDown, true);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleDocumentPointerDown,
        true
      );
    };
  }, [showClearConfirm]);

  function handleClearDataClick() {
    // #region agent log
    logDebugEvent({
      hypothesisId: "A",
      location: "app/components/Dashboard.tsx:handleClearDataClick:entry",
      message: "Clear button clicked",
      data: {
        showClearConfirm,
        timeoutActive: clearConfirmTimeoutRef.current !== null,
      },
    });
    // #endregion

    if (showClearConfirm) {
      if (clearConfirmTimeoutRef.current) {
        clearTimeout(clearConfirmTimeoutRef.current);
        clearConfirmTimeoutRef.current = null;
      }

      // #region agent log
      logDebugEvent({
        hypothesisId: "B",
        location: "app/components/Dashboard.tsx:handleClearDataClick:confirm",
        message: "Confirm branch reached, calling onClearData",
        data: {
          showClearConfirm,
        },
      });
      // #endregion

      onClearData();
      setShowClearConfirm(false);
      return;
    }

    setShowClearConfirm(true);
    if (clearConfirmTimeoutRef.current) {
      clearTimeout(clearConfirmTimeoutRef.current);
    }
    clearConfirmTimeoutRef.current = setTimeout(() => {
      // #region agent log
      logDebugEvent({
        hypothesisId: "A",
        location: "app/components/Dashboard.tsx:handleClearDataClick:timeout",
        message: "Clear confirmation timed out",
        data: {
          showClearConfirmAtTimeout: true,
        },
      });
      // #endregion

      setShowClearConfirm(false);
      clearConfirmTimeoutRef.current = null;
    }, 3000);
  }

  function handleClearButtonPointerDown() {
    // #region agent log
    logDebugEvent({
      hypothesisId: "E",
      location: "app/components/Dashboard.tsx:buttonPointerDown",
      message: "Clear button pointerdown",
      data: {
        showClearConfirm,
      },
    });
    // #endregion
  }

  function handleClearButtonClickCapture() {
    // #region agent log
    logDebugEvent({
      hypothesisId: "E",
      location: "app/components/Dashboard.tsx:buttonClickCapture",
      message: "Clear button click capture",
      data: {
        showClearConfirm,
      },
    });
    // #endregion
  }

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Sticky Header */}
      <header className="sticky-header sticky top-0 z-30 px-6 py-5">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between gap-4">
            <div className="group/header">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1
                  className={cn(
                    "text-sm font-medium transition-colors duration-300 truncate max-w-[500px]",
                    focusedSummary ? "text-text-primary" : "text-text-muted"
                  )}
                >
                  {headerLabel}
                </h1>
                <button
                  ref={clearButtonRef}
                  type="button"
                  onPointerDown={handleClearButtonPointerDown}
                  onClickCapture={handleClearButtonClickCapture}
                  onClick={handleClearDataClick}
                  className={cn(
                    "inline-flex min-h-10 items-center gap-2 rounded-full px-4 py-2",
                    "text-sm font-medium shadow-sm transition-all duration-200 cursor-pointer",
                    "border",
                    showClearConfirm
                      ? "border-negative/40 bg-negative/12 text-negative hover:bg-negative/18"
                      : "border-border bg-surface text-text-primary hover:bg-surface-hover"
                  )}
                  title={
                    showClearConfirm
                      ? "Click again to clear the uploaded file"
                      : "Clear the uploaded file"
                  }
                  aria-label={
                    showClearConfirm ? "Confirm clear file" : "Clear file"
                  }
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {showClearConfirm ? (
                      <path d="M18 6 6 18M6 6l12 12" />
                    ) : (
                      <>
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="m19 6-1 14H6L5 6" />
                      </>
                    )}
                  </svg>
                  <span>{showClearConfirm ? "Confirm clear" : "Clear file"}</span>
                </button>
                {showClearConfirm && (
                  <span className="text-xs text-negative animate-fade-in">
                    Click again to remove this upload
                  </span>
                )}
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
          focusedFund={focusedFund}
          onFocusFund={onFocusFund}
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
        focusedFund={focusedFundInfo}
        onClearFocus={() => onFocusFund(null)}
      />
    </div>
  );
}
