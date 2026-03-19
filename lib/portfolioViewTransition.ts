/**
 * Coordinates View Transitions between the home portfolio tile and the detail
 * dashboard. Only one tile should use these names at a time (forward: inline
 * styles set on click; back: session marker so the tile can pick up names on mount).
 */

const RETURN_KEY = "portfolio_vt_return_id";

function portfolioViewTransitionBase(portfolioId: string): string {
  return `pvt-${portfolioId.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

export function portfolioViewTransitionShell(portfolioId: string): string {
  return `${portfolioViewTransitionBase(portfolioId)}-shell`;
}

export function portfolioViewTransitionTitle(portfolioId: string): string {
  return `${portfolioViewTransitionBase(portfolioId)}-title`;
}

export function portfolioViewTransitionValue(portfolioId: string): string {
  return `${portfolioViewTransitionBase(portfolioId)}-value`;
}

export function markPortfolioViewTransitionReturn(portfolioId: string): void {
  if (typeof sessionStorage === "undefined") {
    return;
  }
  sessionStorage.setItem(RETURN_KEY, portfolioId);
}

export function peekPortfolioViewTransitionReturn(
  portfolioId: string
): boolean {
  if (typeof sessionStorage === "undefined") {
    return false;
  }
  return sessionStorage.getItem(RETURN_KEY) === portfolioId;
}

export function clearPortfolioViewTransitionReturn(): void {
  if (typeof sessionStorage === "undefined") {
    return;
  }
  sessionStorage.removeItem(RETURN_KEY);
}

export function applyPortfolioTileViewTransitionNames(
  portfolioId: string,
  rootEl: HTMLElement | null,
  titleEl: HTMLElement | null,
  valueEl: HTMLElement | null
): void {
  if (!rootEl) {
    return;
  }
  rootEl.style.viewTransitionName = portfolioViewTransitionShell(portfolioId);
  if (titleEl) {
    titleEl.style.viewTransitionName = portfolioViewTransitionTitle(portfolioId);
  }
  if (valueEl) {
    valueEl.style.viewTransitionName = portfolioViewTransitionValue(portfolioId);
  }
}
