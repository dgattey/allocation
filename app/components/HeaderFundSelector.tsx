"use client";

import { useState, type ReactNode } from "react";
import type { FundOption } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HeaderFundSelectorProps {
  funds: FundOption[];
  selectedFunds: string[];
  onToggleFund: (symbol: string) => void;
  onClearFunds: () => void;
}

export function HeaderFundSelector({
  funds,
  selectedFunds,
  onToggleFund,
  onClearFunds,
}: HeaderFundSelectorProps) {
  const [showChooser, setShowChooser] = useState(false);
  const selectedOptions = funds.filter((fund) =>
    selectedFunds.includes(fund.symbol)
  );

  if (funds.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 max-w-[720px]">
      <div className="flex flex-wrap items-center gap-2">
        <HeaderLabel>Funds</HeaderLabel>

        <button
          onClick={onClearFunds}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer whitespace-nowrap",
            selectedFunds.length === 0
              ? "bg-white/12 text-white border-white/0 shadow-sm"
              : "bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10"
          )}
        >
          All funds
        </button>

        {selectedOptions.map((fund) => (
          <button
            key={fund.symbol}
            onClick={() => onToggleFund(fund.symbol)}
            aria-label={`Remove ${fund.symbol}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white border border-white/0 shadow-sm cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-95 whitespace-nowrap"
            style={{
              backgroundColor: fund.color,
              borderColor: `${fund.color}66`,
            }}
          >
            {fund.symbol}
            <span className="text-[10px] opacity-70">x</span>
          </button>
        ))}

        <button
          onClick={() => setShowChooser((open) => !open)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border cursor-pointer whitespace-nowrap",
            showChooser
              ? "bg-white/12 text-white border-white/0 shadow-sm"
              : "bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10"
          )}
        >
          {showChooser
            ? "Hide funds"
            : selectedFunds.length > 0
              ? "Add fund"
              : "Select funds"}
        </button>
      </div>

      {showChooser && (
        <div className="mt-3 rounded-2xl border border-white/8 bg-[#151b24]/88 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.25)] p-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-sm font-medium text-white">
                Compare specific funds
              </p>
              <p className="text-xs text-white/55">
                Select one or more funds. Treemap clicks still work too.
              </p>
            </div>

            {selectedFunds.length > 0 && (
              <button
                onClick={onClearFunds}
                className="text-xs font-medium text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                Clear selection
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {funds.map((fund) => {
              const selected = selectedFunds.includes(fund.symbol);

              return (
                <button
                  key={fund.symbol}
                  onClick={() => onToggleFund(fund.symbol)}
                  title={fund.name}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border cursor-pointer whitespace-nowrap",
                    "hover:brightness-110 active:scale-95",
                    selected
                      ? "text-white border-white/0 shadow-sm"
                      : "bg-white/5 text-white/68 border-white/10 hover:text-white hover:bg-white/10"
                  )}
                  style={
                    selected
                      ? {
                          backgroundColor: fund.color,
                          borderColor: `${fund.color}66`,
                        }
                      : undefined
                  }
                >
                  {fund.symbol}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function HeaderLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40 whitespace-nowrap">
      {children}
    </span>
  );
}
