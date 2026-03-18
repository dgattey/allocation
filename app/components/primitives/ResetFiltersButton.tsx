"use client";

import { cn } from "@/lib/utils";

interface ResetFiltersButtonProps {
  onClick: () => void;
  className?: string;
}

export function ResetFiltersButton({
  onClick,
  className,
}: ResetFiltersButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Reset all filters"
      aria-label="Reset filters"
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer hover-lift press-down",
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
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  );
}
