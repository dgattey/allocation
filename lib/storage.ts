import type { FidelityPosition } from "./types";

const PORTFOLIO_KEY = "portfolio_positions";

/**
 * Save portfolio positions to localStorage.
 */
export function savePortfolio(positions: FidelityPosition[]): void {
  try {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(positions));
  } catch {
    console.error("Failed to save portfolio to localStorage");
  }
}

/**
 * Load portfolio positions from localStorage.
 */
export function loadPortfolio(): FidelityPosition[] | null {
  try {
    const raw = localStorage.getItem(PORTFOLIO_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as FidelityPosition[];
  } catch {
    return null;
  }
}

/**
 * Clear portfolio positions from localStorage.
 */
export function clearPortfolio(): void {
  try {
    localStorage.removeItem(PORTFOLIO_KEY);
  } catch {
    console.error("Failed to clear portfolio from localStorage");
  }
}
