import Link from "next/link";

/** Shared 404 body, used by the site segment and the root fallback. */
export default function NotFoundView() {
  return (
    <section className="on-dark relative flex min-h-[100svh] items-end overflow-hidden pb-[clamp(3rem,8vw,6rem)] pt-[calc(var(--nav-h)+4rem)]">
      <div aria-hidden className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="shell relative w-full">
        <p className="t-mono text-fog">(404) — Sheet not found</p>
        <h1 className="t-display mt-8 text-ivory">
          Nothing <span className="t-serif normal-case text-cobalt-glow">built</span> here.
        </h1>
        <div className="rule-t mt-12 flex flex-col gap-8 pt-8 md:flex-row md:items-end md:justify-between">
          <p className="t-lead max-w-xl text-ivory/70">
            The page you were looking for has moved or was never drawn up. Try the work index, or tell us what you are
            planning.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/work" className="btn btn-ghost">
              See our work <span className="btn-arrow">→</span>
            </Link>
            <Link href="/" className="btn btn-accent">
              Back to home <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
