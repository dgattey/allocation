"use client";

import { cn } from "@/lib/utils";

interface SortHeaderProps {
  label: string;
  sortKey: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
  className?: string;
}

export function SortHeader({
  label,
  active,
  direction,
  onClick,
  className,
}: SortHeaderProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider",
        "cursor-pointer select-none whitespace-nowrap",
        "transition-colors duration-150",
        active ? "text-text-primary" : "text-text-muted hover:text-text-primary",
        className
      )}
    >
      {label}
      <span className="text-[10px]">
        {active ? (direction === "asc" ? "▲" : "▼") : "⇅"}
      </span>
    </button>
  );
}
