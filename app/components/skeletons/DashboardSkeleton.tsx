import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { FetchStatusBadge } from "../primitives/FetchStatusBadge";
import { DashboardHeaderSkeleton } from "./DashboardHeaderSkeleton";
import { TreeMapSkeleton } from "./TreeMapSkeleton";
import { SearchBarSkeleton } from "./SearchBarSkeleton";
import { TableSkeleton } from "./TableSkeleton";
import { ToolbarSkeleton } from "./ToolbarSkeleton";

interface DashboardSkeletonProps {
  /** Portfolio name from localStorage — renders immediately when available */
  portfolioName?: string;
  isMobile?: boolean;
  error?: string | null;
  enableIntroAnimation?: boolean;
  /** Controls which sections to show as skeleton vs hide entirely */
  sections?: {
    header?: boolean;
    treemap?: boolean;
    toolbar?: boolean;
    searchBar?: boolean;
    table?: boolean;
  };
}

const ALL_SECTIONS = {
  header: true,
  treemap: true,
  toolbar: true,
  searchBar: true,
  table: true,
};

export function DashboardSkeleton({
  portfolioName,
  isMobile = false,
  error,
  enableIntroAnimation = true,
  sections = ALL_SECTIONS,
}: DashboardSkeletonProps) {
  const show = { ...ALL_SECTIONS, ...sections };

  return (
    <div
      className={cn(
        "min-h-0 flex-1 pb-8",
        enableIntroAnimation && "animate-fade-in"
      )}
    >
      {/* Header */}
      {show.header && (
        <header className="sticky-header sticky top-0 z-40">
          <DashboardHeaderSkeleton
            portfolioName={portfolioName}
            isMobile={isMobile}
          />
          {error && (
            <div className={cn("max-w-[1400px] mx-auto", isMobile ? "px-4" : "px-6")}>
              <FetchStatusBadge error={error} hasData={false} />
            </div>
          )}
        </header>
      )}

      {/* TreeMap */}
      {show.treemap && (
        <section
          className={cn(
            isMobile ? "pt-2" : "pt-6",
            "mb-6 max-w-[1400px] mx-auto overflow-x-clip",
            enableIntroAnimation && "animate-soft-rise",
            isMobile ? "px-4" : "px-6"
          )}
          style={{ "--enter-delay": "60ms" } as CSSProperties}
        >
          <TreeMapSkeleton isMobile={isMobile} />
        </section>
      )}

      {/* Mobile toolbar */}
      {show.toolbar && isMobile && (
        <section
          className={cn(
            "px-4 mb-6 max-w-[1400px] mx-auto",
            enableIntroAnimation && "animate-soft-rise"
          )}
          style={{ "--enter-delay": "100ms" } as CSSProperties}
        >
          <ToolbarSkeleton isMobile />
        </section>
      )}

      {/* Search bar + Table */}
      <section
        className={cn(
          "max-w-[1400px] mx-auto overflow-x-clip",
          enableIntroAnimation && "animate-soft-rise",
          isMobile ? "px-4" : "px-6"
        )}
        style={{ "--enter-delay": "140ms" } as CSSProperties}
      >
        {show.searchBar && (
          <div className="mb-4 py-3">
            <SearchBarSkeleton isMobile={isMobile} />
          </div>
        )}
        {show.table && <TableSkeleton isMobile={isMobile} />}
      </section>

      {/* Desktop toolbar */}
      {show.toolbar && !isMobile && (
        <ToolbarSkeleton />
      )}
    </div>
  );
}
