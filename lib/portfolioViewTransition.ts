/**
 * Stable `view-transition-name` identifiers for portfolio library tiles and the
 * matching dashboard regions. Names are unique per portfolio id so the browser
 * can pair elements on any navigation path (link click, history back/forward).
 */

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
