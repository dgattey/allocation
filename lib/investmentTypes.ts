const FUND_INVESTMENT_TYPES = new Set(["ETFs", "Mutual Funds", "Others"]);

export function isFundInvestmentType(type?: string): boolean {
  return !!type && FUND_INVESTMENT_TYPES.has(type);
}
