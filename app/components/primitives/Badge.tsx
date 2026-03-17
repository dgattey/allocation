"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  className?: string;
}

const VARIANT_STYLES: Record<string, string> = {
  Stocks:
    "bg-blue-50 text-blue-600/80 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400/80 dark:border-blue-900/20",
  ETFs: "bg-violet-50 text-violet-600/80 border-violet-100 dark:bg-violet-950/20 dark:text-violet-400/80 dark:border-violet-900/20",
  "Mutual Funds":
    "bg-emerald-50 text-emerald-600/80 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400/80 dark:border-emerald-900/20",
  Cash: "bg-gray-50 text-gray-500/80 border-gray-100 dark:bg-gray-800/15 dark:text-gray-400/80 dark:border-gray-700/20",
  Others:
    "bg-amber-50 text-amber-600/80 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400/80 dark:border-amber-900/20",
};

export function Badge({ label, className }: BadgeProps) {
  const style = VARIANT_STYLES[label] || VARIANT_STYLES["Others"];

  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap border",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
