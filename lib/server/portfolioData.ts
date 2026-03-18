import { isFundInvestmentType } from "@/lib/investmentTypes";
import type {
  FidelityPosition,
  FundHolding,
  PortfolioData,
  QuoteData,
} from "@/lib/types";
import { computePortfolioData } from "./aggregation";
import { fetchQuotes, fetchAllHoldings } from "./yahoo";

export async function buildPortfolioData(
  positions: FidelityPosition[],
  width: number,
  height: number
): Promise<PortfolioData> {
  const allSymbols = [...new Set(positions.map((position) => position.symbol))];
  const fundSymbols = positions
    .filter((position) => isFundInvestmentType(position.investmentType))
    .map((position) => ({
      symbol: position.symbol,
      description: position.description,
    }));
  const uniqueFundSymbols = Array.from(
    new Map(fundSymbols.map((fund) => [fund.symbol, fund])).values()
  );

  const [quotes, holdings] = await Promise.all([
    fetchQuotes(allSymbols),
    fetchAllHoldings(uniqueFundSymbols),
  ]);

  await hydrateHoldingQuotes(quotes, holdings);

  return computePortfolioData(positions, quotes, holdings, width, height);
}

async function hydrateHoldingQuotes(
  quotes: Record<string, QuoteData>,
  holdings: Record<string, FundHolding[]>
) {
  const holdingSymbols = new Set<string>();

  for (const fundHoldings of Object.values(holdings)) {
    for (const holding of fundHoldings) {
      if (holding.symbol && !quotes[holding.symbol]) {
        holdingSymbols.add(holding.symbol);
      }
    }
  }

  if (holdingSymbols.size === 0) {
    return;
  }

  Object.assign(quotes, await fetchQuotes([...holdingSymbols]));
}
