import { describe, expect, it } from "vitest";

import { shouldSkipYahooSymbol } from "../yahoo";

describe("shouldSkipYahooSymbol", () => {
  it("keeps exchange-qualified numeric symbols fetchable", () => {
    expect(shouldSkipYahooSymbol("6501.T")).toBe(false);
    expect(shouldSkipYahooSymbol("8316.T")).toBe(false);
    expect(shouldSkipYahooSymbol("0700.HK")).toBe(false);
  });

  it("skips likely internal numeric-only identifiers", () => {
    expect(shouldSkipYahooSymbol("12345")).toBe(true);
  });

  it("skips malformed symbols", () => {
    expect(shouldSkipYahooSymbol("ABC DEF")).toBe(true);
    expect(shouldSkipYahooSymbol("TOO-LONG-SYMBOL-123")).toBe(true);
  });
});
