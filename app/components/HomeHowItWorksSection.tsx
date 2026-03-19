export function HomeHowItWorksSection() {
  return (
    <section className="rounded-[30px] border border-border/70 bg-surface px-5 py-5 shadow-[var(--shadow-lg)] md:px-8 md:py-8">
      <h2 className="text-xl font-semibold text-text-primary md:text-2xl">
        How does it work?
      </h2>
      <div className="mt-4 space-y-3 text-sm leading-6 text-text-muted md:text-base md:leading-7">
        <p className="text-text-primary">
          You upload a{" "}
          <strong className="font-medium text-text-primary">
            Fidelity positions CSV
          </strong>
          . This app reads those rows and builds an interactive{" "}
          <strong className="font-medium text-text-primary">treemap</strong>{" "}
          (each tile is sized by how much of the portfolio it represents) and a{" "}
          <strong className="font-medium text-text-primary">
            detailed table
          </strong>{" "}
          you can sort and filter. For funds and ETFs, you can drill into{" "}
          <strong className="font-medium text-text-primary">
            published holdings
          </strong>{" "}
          when that data is available from public sources.
        </p>
        <p>
          Live <strong className="font-medium text-text-primary">prices</strong>{" "}
          and <strong className="font-medium text-text-primary">fund data</strong>{" "}
          are fetched using the <strong className="font-medium text-text-primary">symbols</strong>{" "}
          in your file—there are no brokerage logins, and nothing beyond what’s
          already in your export is required to use the tool.
        </p>
        <p>
          <strong className="font-medium text-text-primary">Privacy:</strong>{" "}
          uploads and saved portfolios stay{" "}
          <strong className="font-medium text-text-primary">in this browser</strong>{" "}
          on your device. The only traffic to the internet is ordinary requests
          for public market and fund information keyed by symbol.
        </p>
      </div>
    </section>
  );
}
