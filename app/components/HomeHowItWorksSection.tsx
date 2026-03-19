export function HomeHowItWorksSection() {
  return (
    <section
      className="border-t border-border/60 pt-6 md:pt-8"
      aria-labelledby="how-it-works-label"
    >
      <div className="max-w-2xl">
        <p
          id="how-it-works-label"
          className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted"
        >
          How it works
        </p>
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
      </div>
    </section>
  );
}
