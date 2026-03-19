export function HomeHowItWorksSection() {
  return (
    <div className="border-t border-border/60 pt-6 md:pt-8">
      <details className="group max-w-2xl">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-text-primary outline-none marker:content-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg md:text-base">
          <span>How does it work?</span>
          <ChevronIcon className="size-4 shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="mt-3 space-y-2 text-sm leading-6 text-text-muted">
          <p>
            Drop a Fidelity positions export and we turn it into a treemap and
            sortable table. Fund tiles can expand into public holdings when data
            exists.
          </p>
          <p>
            Quotes and fund facts are fetched by symbol—no brokerage login, no
            extra credentials.
          </p>
          <p className="text-xs leading-5 md:text-sm md:leading-6">
            Your CSVs and saved portfolios stay in this browser. Outbound
            requests only ask for public market and fund data keyed by symbol.
          </p>
        </div>
      </details>
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
