"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import type {
  ActivePortfolioSummary,
  FidelityPosition,
  FilterState,
  FundOption,
  PortfolioData,
  SortConfig,
  TableRow,
  TreeMapGrouping,
  TreeMapNode,
  ViewMode,
} from "@/lib/types";
import {
  POLL_INTERVAL_MS,
  PORTFOLIO_TREEMAP_HEIGHT,
  PORTFOLIO_TREEMAP_WIDTH,
} from "@/lib/portfolioLayout";
import { parseCSV } from "@/lib/parseCSV";
import {
  getActivePortfolioSummary,
  getFilteredRows,
  getFilteredTreeMapNodes,
} from "@/lib/portfolioSelectors";
import {
  savePortfolio,
  savePortfolioData,
  loadPortfolio,
  loadPortfolioData,
  clearPortfolio,
} from "@/lib/storage";
import {
  buildFlatHoldingTreeMapNodes,
  filterFundTreeMapNodes,
  getFundOptions,
} from "@/lib/treemap";

function createDefaultFilters(): FilterState {
  return {
    investmentTypes: [],
    accounts: [],
  };
}

function createDefaultSortConfig(): SortConfig {
  return {
    key: "totalValue",
    direction: "desc",
  };
}

export interface UsePortfolioResult {
  hasData: boolean;
  isLoading: boolean;
  error: string | null;
  portfolioData: PortfolioData | null;
  filteredRows: TableRow[];
  filteredTreeMapNodes: TreeMapNode[];
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  sortConfig: SortConfig;
  handleSort: (key: string) => void;
  expandedRows: Set<string>;
  toggleExpand: (symbol: string) => void;
  uploadFile: (file: File) => Promise<void>;
  clearData: () => void;
  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
  treeMapGrouping: TreeMapGrouping;
  setTreeMapGrouping: Dispatch<SetStateAction<TreeMapGrouping>>;
  selectedFunds: string[];
  toggleFundSelection: (symbol: string) => void;
  clearSelectedFunds: () => void;
  fundOptions: FundOption[];
  activeSummary: ActivePortfolioSummary | null;
}

export function usePortfolio(): UsePortfolioResult {
  const [positions, setPositions] = useState<FidelityPosition[] | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [filters, setFilters] = useState<FilterState>(createDefaultFilters);
  const [sortConfig, setSortConfig] = useState<SortConfig>(createDefaultSortConfig);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("holdings");
  const [treeMapGrouping, setTreeMapGrouping] =
    useState<TreeMapGrouping>("fund");
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);

  const mountedRef = useRef(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const positionsRef = useRef<FidelityPosition[] | null>(null);

  positionsRef.current = positions;

  const fetchData = useCallback(
    async (pos: FidelityPosition[], endpoint: string) => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            positions: pos,
            width: PORTFOLIO_TREEMAP_WIDTH,
            height: PORTFOLIO_TREEMAP_HEIGHT,
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server error: ${res.status}`);
        }
        const data: PortfolioData = await res.json();
        setPortfolioData(data);
        savePortfolioData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch portfolio data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load portfolio data"
        );
      }
    },
    []
  );

  useLayoutEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const saved = loadPortfolio();
    if (saved) {
      const cachedPortfolioData = loadPortfolioData();
      setPositions(saved);
      if (cachedPortfolioData) {
        setPortfolioData(cachedPortfolioData);
      }
      fetchData(saved, "/api/portfolio").finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    if (!positions) {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }

    function poll() {
      if (document.visibilityState === "visible" && positionsRef.current) {
        fetchData(positionsRef.current, "/api/portfolio/refresh");
      }
    }

    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);

    function handleVisibility() {
      if (document.visibilityState === "visible" && positionsRef.current) {
        fetchData(positionsRef.current, "/api/portfolio/refresh");
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [positions, fetchData]);

  // Switch source rows based on viewMode
  const sourceRows =
    viewMode === "holdings"
      ? portfolioData?.tableRows
      : portfolioData?.positionRows;

  const filteredFundTreeMapNodes = getFilteredTreeMapNodes(portfolioData, filters);
  const fundOptions = getFundOptions(filteredFundTreeMapNodes);

  useEffect(() => {
    const availableFunds = new Set(fundOptions.map((fund) => fund.symbol));

    setSelectedFunds((prev) => {
      const next = prev.filter((symbol) => availableFunds.has(symbol));
      return next.length === prev.length ? prev : next;
    });
  }, [fundOptions]);

  const filteredRows = getFilteredRows(
    sourceRows ?? null,
    filters,
    sortConfig,
    selectedFunds
  );
  const activeSummary = getActivePortfolioSummary(
    positions,
    filters,
    selectedFunds
  );
  const filteredTreeMapNodes =
    treeMapGrouping === "fund"
      ? filterFundTreeMapNodes(filteredFundTreeMapNodes, selectedFunds)
      : buildFlatHoldingTreeMapNodes({
          rows: portfolioData?.tableRows ?? [],
          filters,
          selectedFunds,
          totalPortfolioValue:
            activeSummary?.value ?? portfolioData?.summary.totalValue ?? 0,
          width: PORTFOLIO_TREEMAP_WIDTH,
          height: PORTFOLIO_TREEMAP_HEIGHT,
        });

  async function uploadFile(file: File) {
    setIsLoading(true);
    setError(null);
    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      savePortfolio(parsed);
      setPositions(parsed);
      await fetchData(parsed, "/api/portfolio");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to parse CSV file"
      );
    } finally {
      setIsLoading(false);
    }
  }

  function clearData() {
    clearPortfolio();
    setPositions(null);
    setPortfolioData(null);
    setError(null);
    setExpandedRows(new Set());
    setFilters(createDefaultFilters());
    setSelectedFunds([]);
    setTreeMapGrouping("fund");
    setSortConfig(createDefaultSortConfig());
    setViewMode("holdings");
    mountedRef.current = false;
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  function toggleExpand(symbol: string) {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) {
        next.delete(symbol);
      } else {
        next.add(symbol);
      }
      return next;
    });
  }

  function handleSort(key: string) {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  }

  function toggleFundSelection(symbol: string) {
    setSelectedFunds((prev) =>
      prev.includes(symbol)
        ? prev.filter((selected) => selected !== symbol)
        : [...prev, symbol]
    );
  }

  function clearSelectedFunds() {
    setSelectedFunds([]);
  }

  return {
    hasData: positions !== null,
    isLoading,
    error,
    portfolioData,
    filteredRows,
    filteredTreeMapNodes,
    filters,
    setFilters,
    sortConfig,
    handleSort,
    expandedRows,
    toggleExpand,
    uploadFile,
    clearData,
    viewMode,
    setViewMode,
    treeMapGrouping,
    setTreeMapGrouping,
    selectedFunds,
    toggleFundSelection,
    clearSelectedFunds,
    fundOptions,
    activeSummary,
  };
}
