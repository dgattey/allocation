import type {
  FidelityPosition,
  FilterState,
  PositionSource,
  TreeMapNode,
} from "./types";

interface RowSourceSelection {
  rowSymbol: string;
  sourceType: PositionSource["type"];
  sourceSymbol: string;
}

export function hasActivePortfolioFilters(
  filters: FilterState,
  selectedFunds: string[]
): boolean {
  return (
    filters.investmentTypes.length > 0 ||
    filters.accounts.length > 0 ||
    selectedFunds.length > 0
  );
}

export function matchesSourceFilters(
  account: string,
  investmentType: string,
  filters: FilterState
): boolean {
  const matchesAccount =
    filters.accounts.length === 0 || filters.accounts.includes(account);
  const matchesType =
    filters.investmentTypes.length === 0 ||
    filters.investmentTypes.includes(investmentType);

  return matchesAccount && matchesType;
}

export function matchesPositionFilters(
  position: FidelityPosition,
  filters: FilterState
): boolean {
  return matchesSourceFilters(
    position.accountName,
    position.investmentType,
    filters
  );
}

export function matchesPositionFundSelection(
  position: FidelityPosition,
  selectedFunds: string[]
): boolean {
  return (
    selectedFunds.length === 0 || selectedFunds.includes(position.symbol)
  );
}

export function matchesRowSourceFundSelection(
  { rowSymbol, sourceType, sourceSymbol }: RowSourceSelection,
  selectedFunds: string[]
): boolean {
  if (selectedFunds.length === 0) {
    return true;
  }

  if (selectedFunds.includes(sourceSymbol)) {
    return true;
  }

  return sourceType === "direct" && selectedFunds.includes(rowSymbol);
}

export function matchesTreeMapNodeFilters(
  node: TreeMapNode,
  filters: FilterState
): boolean {
  const matchesAccount =
    filters.accounts.length === 0 ||
    (node.account ? filters.accounts.includes(node.account) : false);
  const matchesType =
    filters.investmentTypes.length === 0 ||
    (node.investmentType
      ? filters.investmentTypes.includes(node.investmentType)
      : false);

  return matchesAccount && matchesType;
}
