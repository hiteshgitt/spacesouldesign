"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest = error instanceof Error && "digest" in error ? String(error.digest) : undefined;

  return (
    <section className="on-dark relative flex min-h-[100svh] items-end overflow-hidden pb-[clamp(3rem,8vw,6rem)] pt-[calc(var(--nav-h)+4rem)]">
      <div aria-hidden className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="shell relative w-full">
        <p className="t-mono text-fog">(500) — Something gave way</p>
        <h1 className="t-display-sm mt-8 text-ivory">
          This page <span className="t-serif normal-case text-cobalt-glow">didn&rsquo;t</span> load.
        </h1>
        <div className="rule-t mt-12 flex flex-col gap-8 pt-8 md:flex-row md:items-end md:justify-between">
          <p className="t-lead max-w-xl text-ivory/70">
            An unexpected error stopped this page from rendering. Try again — if it keeps happening, the rest of the site
            is still open.
            {digest ? <span className="t-mono mt-4 block text-fog">Ref {digest}</span> : null}
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => retry()} className="btn btn-accent">
              Try again <span className="btn-arrow">↻</span>
            </button>
            <Link href="/" className="btn btn-ghost">
              Back to home <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
