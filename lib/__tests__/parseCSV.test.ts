import { describe, it, expect } from "vitest";
import { parseCSV } from "../parseCSV";

const VALID_HEADER =
  "Account Number,Account Name,Investment Type,Symbol,Description,Quantity,Last Price,Last Price Change,Current Value,Today's Gain/Loss Dollar,Today's Gain/Loss Percent,Total Gain/Loss Dollar,Total Gain/Loss Percent,Percent Of Account,Cost Basis Total,Average Cost Basis,Type";

function makeCSV(rows: string[]): string {
  return [VALID_HEADER, ...rows].join("\n");
}

const STOCK_ROW =
  'X86835552,DG stocks,Stocks,AAPL,APPLE INC,125,$260.81,-$0.02,$32601.25,-$2.50,-0.01%,+$15558.60,+91.29%,1.95%,$17042.65,$136.34,Cash,';
const ETF_ROW =
  'X86835552,DG stocks,ETFs,VTI,VANGUARD INDEX FDS VANGUARD TOTAL STK MKT ETF,902.218,$333.24,-$0.27,$300655.12,-$243.60,-0.09%,+$37112.81,+14.08%,17.96%,$263542.31,$292.10,Cash,';
const MONEY_MARKET_ROW =
  "X86835552,DG stocks,Cash,FZFXX**,HELD IN MONEY MARKET,,,,$43904.72,,,,,2.62%,,,Cash,";
const PENDING_ROW =
  "X86835552,DG stocks,,Pending activity,,,,,-$661.77,,,,,,";
const BRKB_ROW =
  'X86835552,DG stocks,Stocks,BRKB,BERKSHIRE HATHAWAY INC COM,73,$493.57,-$0.57,$36030.61,-$41.61,-0.12%,+$31700.32,+732.05%,2.15%,$4330.29,$59.32,Cash,';

describe("parseCSV", () => {
  it("parses a valid row with correct fields", () => {
    const result = parseCSV(makeCSV([STOCK_ROW]));
    expect(result).toHaveLength(1);
    const pos = result[0];
    expect(pos.symbol).toBe("AAPL");
    expect(pos.accountName).toBe("DG stocks");
    expect(pos.investmentType).toBe("Stocks");
    expect(pos.quantity).toBe(125);
    expect(pos.lastPrice).toBe(260.81);
    expect(pos.currentValue).toBe(32601.25);
    expect(pos.totalGainLossDollar).toBe(15558.6);
    expect(pos.totalGainLossPercent).toBe(91.29);
    expect(pos.costBasisTotal).toBe(17042.65);
  });

  it("parses multiple rows", () => {
    const result = parseCSV(makeCSV([STOCK_ROW, ETF_ROW]));
    expect(result).toHaveLength(2);
    expect(result[0].symbol).toBe("AAPL");
    expect(result[1].symbol).toBe("VTI");
    expect(result[1].investmentType).toBe("ETFs");
  });

  it("maps BRKB → BRK-B", () => {
    const result = parseCSV(makeCSV([BRKB_ROW]));
    expect(result).toHaveLength(1);
    expect(result[0].symbol).toBe("BRK-B");
  });

  it("strips ** from money market symbols and types as Cash", () => {
    const result = parseCSV(makeCSV([MONEY_MARKET_ROW]));
    expect(result).toHaveLength(1);
    expect(result[0].symbol).toBe("FZFXX");
    expect(result[0].investmentType).toBe("Cash");
  });

  it("skips pending activity rows", () => {
    const result = parseCSV(makeCSV([STOCK_ROW, PENDING_ROW]));
    expect(result).toHaveLength(1);
    expect(result[0].symbol).toBe("AAPL");
  });

  it("stops at disclaimer text", () => {
    const csv = makeCSV([
      STOCK_ROW,
      "",
      '"The data and information in this spreadsheet is provided..."',
    ]);
    const result = parseCSV(csv);
    expect(result).toHaveLength(1);
  });

  it("throws on file without Fidelity header", () => {
    expect(() => parseCSV("some,random,data\n1,2,3")).toThrow(
      "Invalid file"
    );
  });

  it("throws on file with header but no valid rows", () => {
    expect(() => parseCSV(makeCSV([PENDING_ROW]))).toThrow(
      "No valid positions"
    );
  });

  it("handles BOM character", () => {
    const csv = "\uFEFF" + makeCSV([STOCK_ROW]);
    const result = parseCSV(csv);
    expect(result).toHaveLength(1);
    expect(result[0].symbol).toBe("AAPL");
  });

  it("handles Windows line endings", () => {
    const csv = makeCSV([STOCK_ROW]).replace(/\n/g, "\r\n");
    const result = parseCSV(csv);
    expect(result).toHaveLength(1);
  });

  it("cleans dollar signs, plus, percent from numeric values", () => {
    const result = parseCSV(makeCSV([STOCK_ROW]));
    expect(result[0].lastPriceChange).toBe(-0.02);
    expect(result[0].todayGainLossDollar).toBe(-2.5);
    expect(result[0].todayGainLossPercent).toBe(-0.01);
  });

  it("handles quoted fields with commas (ETF descriptions)", () => {
    const row =
      'X86835552,DG stocks,ETFs,SPYX,"SPDR SERIES TRUST STATE STREET S&P 500 FOSSIL FUEL RESERVES FREE ETF",1696.651,$55.38,-$0.073,$93960.53,-$123.86,-0.14%,+$38135.60,+68.31%,37.49%,$55824.93,$32.90,Cash,';
    const result = parseCSV(makeCSV([row]));
    expect(result).toHaveLength(1);
    expect(result[0].symbol).toBe("SPYX");
    expect(result[0].description).toContain("SPDR SERIES TRUST");
  });
});
