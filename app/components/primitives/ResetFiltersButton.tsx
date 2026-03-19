"use client";

import { cn } from "@/lib/utils";

interface ResetFiltersButtonProps {
  onClick: () => void;
  className?: string;
  label?: string;
}

export function ResetFiltersButton({
  onClick,
  className,
  label,
}: ResetFiltersButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Reset all filters"
      aria-label="Reset filters"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full transition-all duration-200 cursor-pointer hover-lift press-down",
        className
      )}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
      {label && <span className="whitespace-nowrap text-xs font-medium">{label}</span>}
    </button>
  );
}
