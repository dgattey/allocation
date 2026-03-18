import type { FundHolding } from "@/lib/types";

export interface HoldingsProviderRequest {
  symbol: string;
  description?: string;
  fetchYahooHoldings: (symbol: string) => Promise<FundHolding[]>;
}

export async function fetchDirectFundHoldings({
  symbol,
  fetchYahooHoldings,
}: HoldingsProviderRequest): Promise<FundHolding[]> {
  return fetchYahooHoldings(symbol);
}
