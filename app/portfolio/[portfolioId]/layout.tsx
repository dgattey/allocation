import type { ReactNode } from "react";

/** Exists so shared portfolio chrome can be added later without reshuffling routes. */
export default function PortfolioDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
