"use client";

import Link from "next/link";

export interface SiteFooterInnerProps {
  year: number;
}

export function SiteFooterInner({ year }: SiteFooterInnerProps) {
  return (
    <footer
      className="border-t border-border bg-surface/80 px-4 py-4 text-center text-sm text-text-muted backdrop-blur-sm md:px-6"
      role="contentinfo"
    >
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <span>© {year} Dylan Gattey.</span>
        <span className="text-border" aria-hidden="true">
          ·
        </span>
        <Link
          href="https://gattey.com"
          className="text-accent underline decoration-border underline-offset-2 transition-colors hover:text-text-primary"
          rel="noopener noreferrer"
          target="_blank"
        >
          gattey.com
        </Link>
      </p>
    </footer>
  );
}

export function SiteFooterFallback() {
  return (
    <footer
      className="border-t border-border bg-surface/80 px-4 py-4 text-center text-sm backdrop-blur-sm md:px-6"
      role="contentinfo"
      aria-busy="true"
      aria-label="Footer"
    >
      <div className="mx-auto h-5 w-72 max-w-full animate-pulse rounded-md bg-border-subtle" />
    </footer>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return <SiteFooterInner year={year} />;
}
