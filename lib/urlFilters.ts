import type { FilterState } from "./types";

const PARAM_Q = "q";
const PARAM_ACCOUNTS = "accounts";
const PARAM_TYPES = "types";
const PARAM_FUNDS = "funds";

function parseArray(value: string | null): string[] {
  if (!value || typeof value !== "string") return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Parse filters and selected funds from URL search params.
 * Returns null if no filter-related params are present.
 */
export function parseFiltersFromSearchParams(
  params: URLSearchParams
): { filters: FilterState; selectedFunds: string[] } | null {
  const q = params.get(PARAM_Q)?.trim();
  const accounts = parseArray(params.get(PARAM_ACCOUNTS));
  const types = parseArray(params.get(PARAM_TYPES));
  const funds = parseArray(params.get(PARAM_FUNDS));

  const hasFilters =
    (q !== undefined && q !== null && q.length > 0) ||
    accounts.length > 0 ||
    types.length > 0 ||
    funds.length > 0;

  if (!hasFilters) return null;

  const filters: FilterState = {
    investmentTypes: types,
    accounts,
    ...(q ? { searchQuery: q } : {}),
  };

  return { filters, selectedFunds: funds };
}

/**
 * Build URL search params string from filters and selected funds.
 * Omits params that are empty/default.
 */
export function buildFilterSearchParams(
  filters: FilterState,
  selectedFunds: string[]
): string {
  const params = new URLSearchParams();

  const q = filters.searchQuery?.trim();
  if (q) params.set(PARAM_Q, q);
  if (filters.accounts.length > 0)
    params.set(PARAM_ACCOUNTS, filters.accounts.join(","));
  if (filters.investmentTypes.length > 0)
    params.set(PARAM_TYPES, filters.investmentTypes.join(","));
  if (selectedFunds.length > 0) params.set(PARAM_FUNDS, selectedFunds.join(","));

  return params.toString();
}
