"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Dashboard } from "@/app/components/Dashboard";
import { PortfolioEmptyState } from "@/app/components/PortfolioEmptyState";
import { PortfolioLoadingState } from "@/app/components/PortfolioLoadingState";
import { PortfolioSearchParamsBridge } from "@/app/components/PortfolioSearchParamsBridge";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePortfolioUrlSync } from "@/hooks/usePortfolioUrlSync";
import { usePortfolioViewState } from "@/hooks/usePortfolioViewState";
import { useStoredPortfolioRecord } from "@/hooks/useStoredPortfolioRecord";
import {
  DESKTOP_TREE_MAP_LAYOUT,
  MOBILE_TREE_MAP_LAYOUT,
} from "@/lib/portfolioLayout";
import { updateStoredPortfolioName } from "@/lib/storage";
import { parsePortfolioUrlState } from "@/lib/urlFilters";

interface PortfolioDetailClientProps {
  portfolioId: string;
  initialSearchParamsString?: string;
}

export function PortfolioDetailClient({
  portfolioId,
  initialSearchParamsString = "",
}: PortfolioDetailClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [searchParamsString, setSearchParamsString] = useState(
    initialSearchParamsString
  );

  useEffect(() => {
    setSearchParamsString(initialSearchParamsString);
  }, [initialSearchParamsString]);

  const initialUrlState = useMemo(
    () => parsePortfolioUrlState(new URLSearchParams(searchParamsString)),
    [searchParamsString]
  );
  const treeMapLayout = isMobile
    ? MOBILE_TREE_MAP_LAYOUT
    : DESKTOP_TREE_MAP_LAYOUT;
  const layoutMode = isMobile ? "mobile" : "desktop";
  const record = useStoredPortfolioRecord({
    portfolioId,
    width: treeMapLayout.width,
    height: treeMapLayout.height,
    layoutMode,
  });
  const viewState = usePortfolioViewState({
    positions: record.positions,
    portfolioData: record.portfolioData,
    isMobile,
    initialUrlState,
  });

  usePortfolioUrlSync({
    searchParamsString,
    pathname,
    router,
    portfolioSlice: {
      filters: viewState.filters,
      selectedFunds: viewState.selectedFunds,
      sortConfig: viewState.sortConfig,
      viewMode: viewState.viewMode,
      treeMapGrouping: viewState.treeMapGrouping,
    },
    syncWithUrlState: viewState.syncWithUrlState,
  });

  useEffect(() => {
    document.title = record.summary
      ? `${record.summary.name} – Where's my money?`
      : "Where's my money?";
  }, [record.summary]);

  const handleRenamePortfolio = useCallback(
    (id: string, name: string) => {
      updateStoredPortfolioName(id, name);
      record.refreshFromStorage();
    },
    [record]
  );

  const searchParamsSync = useMemo(
    () => (
      <Suspense fallback={null}>
        <PortfolioSearchParamsBridge
          onSearchParamsString={setSearchParamsString}
        />
      </Suspense>
    ),
    [setSearchParamsString]
  );

  if (record.isMissing) {
    return (
      <>
        {searchParamsSync}
        <PortfolioEmptyState
          title="Portfolio not found"
          description="That saved portfolio is no longer available on this device."
        />
      </>
    );
  }

  if (!record.positions) {
    return (
      <>
        {searchParamsSync}
        <PortfolioLoadingState error={record.error} />
      </>
    );
  }

  if (!record.portfolioData) {
    return (
      <>
        {searchParamsSync}
        <PortfolioLoadingState
          enableIntroAnimation={!record.restoredFromStorage}
          error={record.error}
        />
      </>
    );
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      {searchParamsSync}
      <Dashboard
        portfolioData={record.portfolioData}
        portfolioName={record.summary?.name ?? "Portfolio"}
        portfolioId={portfolioId}
        viewTransitionPortfolioId={portfolioId}
        onRenamePortfolio={handleRenamePortfolio}
        filteredTreeMapNodes={viewState.filteredTreeMapNodes}
        filteredRows={viewState.filteredRows}
        isMobile={isMobile}
        filters={viewState.filters}
        onFiltersChange={viewState.setFilters}
        onResetFilters={viewState.resetFilters}
        sortConfig={viewState.sortConfig}
        onSort={viewState.handleSort}
        expandedRows={viewState.expandedRows}
        onToggleExpand={viewState.toggleExpand}
        onBackToPicker={() => {
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
          } else {
            router.push("/");
          }
        }}
        isLoading={record.isLoading}
        viewMode={viewState.viewMode}
        onViewModeChange={viewState.setViewMode}
        treeMapGrouping={viewState.treeMapGrouping}
        onTreeMapGroupingChange={viewState.setTreeMapGrouping}
        selectedFunds={viewState.selectedFunds}
        onToggleFund={viewState.toggleFundSelection}
        onClearFunds={viewState.clearSelectedFunds}
        fundOptions={viewState.fundOptions}
        activeSummary={viewState.activeSummary}
        treeMapWidth={viewState.treeMapWidth}
        treeMapHeight={viewState.treeMapHeight}
        enableIntroAnimation={!record.restoredFromStorage}
        enableValueAnimations={!record.restoredFromStorage}
        fetchError={record.error}
        onRefresh={record.refreshData}
        isRefreshing={record.isRefreshing}
      />
    </main>
  );
}
