"use client";

import { cn } from "@/lib/utils";

interface PillProps {
  label: string;
  active?: boolean;
  count?: number;
  onClick?: () => void;
  className?: string;
}

export function Pill({ label, active, count, onClick, className }: PillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
        "transition-all duration-200 ease-out",
        "cursor-pointer select-none",
        "active:scale-95",
        active
          ? "bg-accent text-white shadow-sm"
          : "bg-surface hover:bg-surface-hover text-text-muted border border-border",
        className
      )}
    >
      {label}
      {count !== undefined && (
        <span
          className={cn(
            "inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-semibold",
            active
              ? "bg-white/20 text-white"
              : "bg-border-subtle text-text-muted"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
