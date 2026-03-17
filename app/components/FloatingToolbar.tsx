"use client";

import type { PortfolioSummary, FilterState, ViewMode } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FloatingToolbarProps {
  summary: PortfolioSummary;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  lastUpdated: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  focusedFund?: { symbol: string; name: string; color: string } | null;
  onClearFocus?: () => void;
}

export function FloatingToolbar({
  summary,
  filters,
  onFiltersChange,
  lastUpdated,
  viewMode,
  onViewModeChange,
  focusedFund,
  onClearFocus,
}: FloatingToolbarProps) {
  function toggleInvestmentType(type: string) {
    const current = filters.investmentTypes;
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onFiltersChange({ ...filters, investmentTypes: updated });
  }

  function handleAccountChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    onFiltersChange({
      ...filters,
      accounts: value === "" ? [] : [value],
    });
  }

  function clearAllFilters() {
    onFiltersChange({ investmentTypes: [], accounts: [] });
  }

  const hasFilters =
    filters.investmentTypes.length > 0 || filters.accounts.length > 0;

  const secondsAgo = Math.floor(
    (Date.now() - new Date(lastUpdated).getTime()) / 1000
  );
  const timeAgo =
    secondsAgo < 5
      ? "just now"
      : secondsAgo < 60
        ? `${secondsAgo}s ago`
        : `${Math.floor(secondsAgo / 60)}m ago`;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-2xl",
          "bg-[#1a1d28]/92 backdrop-blur-2xl saturate-150",
          "border border-white/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.2)]",
          "ring-1 ring-inset ring-white/[0.04]",
          "max-w-[90vw] overflow-x-auto"
        )}
      >
        {/* View Mode Toggle */}
        <div className="flex items-center rounded-lg bg-white/5 p-0.5">
          <button
            onClick={() => onViewModeChange("holdings")}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap",
              viewMode === "holdings"
                ? "bg-white/15 text-white shadow-sm"
                : "text-white/50 hover:text-white/80"
            )}
          >
            Holdings
          </button>
          <button
            onClick={() => onViewModeChange("positions")}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap",
              viewMode === "positions"
                ? "bg-white/15 text-white shadow-sm"
                : "text-white/50 hover:text-white/80"
            )}
          >
            Positions
          </button>
        </div>

        {/* Focused Fund Badge */}
        {focusedFund && (
          <>
            <div className="w-px h-6 bg-white/10 flex-shrink-0" />
            <button
              onClick={onClearFocus}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                "text-white cursor-pointer whitespace-nowrap",
                "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                "animate-[scale-in_300ms_ease-out_both]",
                "hover:brightness-110 active:scale-95"
              )}
              style={{ backgroundColor: focusedFund.color }}
            >
              {focusedFund.symbol}
              <span className="opacity-70 text-[10px]">✕</span>
            </button>
          </>
        )}

        <div className="w-px h-6 bg-white/10 flex-shrink-0" />

        {/* Investment Type Filters */}
        <div className="flex items-center gap-1.5">
          {summary.investmentTypes.map((type) => (
            <button
              key={type}
              onClick={() => toggleInvestmentType(type)}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap",
                "active:scale-95",
                filters.investmentTypes.includes(type)
                  ? "bg-accent text-white shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-white/10 flex-shrink-0" />

        {/* Account Select */}
        <select
          value={filters.accounts.length === 1 ? filters.accounts[0] : ""}
          onChange={handleAccountChange}
          className={cn(
            "bg-white/5 border border-white/10 rounded-lg",
            "text-xs text-white/80 px-2.5 py-1.5",
            "cursor-pointer outline-none",
            "hover:bg-white/10 transition-colors",
            "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.5)%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_6px_center] bg-no-repeat pr-6"
          )}
        >
          <option value="" className="bg-[#1a1d2e] text-white">
            All accounts
          </option>
          {summary.accounts.map((acct) => (
            <option
              key={acct}
              value={acct}
              className="bg-[#1a1d2e] text-white"
            >
              {acct}
            </option>
          ))}
        </select>

        {/* Reset filters — only when filters are active, destructive style */}
        {hasFilters && (
          <>
            <div className="w-px h-6 bg-white/10 flex-shrink-0" />
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-400/80 hover:text-red-300 font-medium whitespace-nowrap cursor-pointer transition-colors animate-fade-in"
            >
              Reset
            </button>
          </>
        )}

        <div className="w-px h-6 bg-white/10 flex-shrink-0" />

        {/* Status */}
        <div className="flex items-center gap-1.5 text-xs text-white/40 whitespace-nowrap">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {timeAgo}
        </div>
      </div>
    </div>
  );
}
