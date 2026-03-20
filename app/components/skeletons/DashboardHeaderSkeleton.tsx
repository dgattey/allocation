import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "../icons";
import { SkeletonPulse } from "./SkeletonPulse";

interface DashboardHeaderSkeletonProps {
  /** When available from localStorage, show the real name instead of a placeholder */
  portfolioName?: string;
  isMobile?: boolean;
}

export function DashboardHeaderSkeleton({
  portfolioName,
  isMobile = false,
}: DashboardHeaderSkeletonProps) {
  return (
    <div
      className={cn(
        "relative z-10 max-w-[1400px] mx-auto py-5",
        isMobile ? "px-4" : "px-6"
      )}
    >
      <div className="mb-6 flex min-w-0 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border border-border/70",
              "bg-surface text-text-muted shadow-sm"
            )}
          >
            <ChevronLeftIcon />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-sm font-medium text-text-muted">Your portfolio</span>
            {portfolioName ? (
              <h1 className="truncate text-sm font-semibold text-text-primary md:text-base mt-0.5">
                {portfolioName}
              </h1>
            ) : (
              <SkeletonPulse className="mt-1 h-5 w-40" />
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <SkeletonPulse className="h-4 w-28" />
          <SkeletonPulse className="h-7 w-20 rounded-full" />
        </div>
      </div>

      <div
        className={cn(
          "gap-x-6 gap-y-3",
          isMobile ? "flex flex-col items-start" : "flex flex-wrap items-end"
        )}
      >
        <div className="min-w-fit shrink-0">
          <SkeletonPulse
            className={cn(
              "mb-1",
              isMobile ? "h-10 w-44" : "h-12 w-56 md:h-14"
            )}
          />
          <SkeletonPulse className="mt-2 h-3 w-32" />
        </div>
        <div className={cn("min-w-0", !isMobile && "self-end")}>
          <SkeletonPulse className="h-7 w-36 md:h-8" />
          <SkeletonPulse className="mt-2 h-3 w-48" />
        </div>
      </div>
    </div>
  );
}
