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
            <span className="font-medium text-text-primary">
              We split fund and ETF lines into published top holdings, then total
              how much you hold of each ticker across every wrapper.
            </span>{" "}
            Read-only: a deeper analytical layer on the same Fidelity
            export—fund sleeves unpacked and overlapping tickers summed so
            concentration is obvious, not something you reconstruct from
            positions alone.
          </p>
          <p>
            <span className="font-medium text-text-primary">
              Your data stays in the browser.
            </span>{" "}
            We only reach out for public quotes and fund facts, keyed to the
            tickers in your file—no brokerage login.
          </p>
        </div>
      </div>
    </section>
  );
}
