"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { categories, categoryById, projects } from "@/content/projects";
import type { CategoryId } from "@/content/types";
import Placeholder from "@/components/ui/Placeholder";

type Filter = CategoryId | "all";

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener("popstate", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("popstate", cb);
  };
};
const readFilter = (): Filter => {
  const q = new URLSearchParams(window.location.search).get("category");
  return q && categories.some((c) => c.id === q) ? (q as CategoryId) : "all";
};

/**
 * Filterable project grid. The active filter is mirrored to `?category=` with
 * replaceState so it can be shared without making the page dynamic.
 */
export default function WorkIndex() {
  const root = useRef<HTMLDivElement>(null);
  // The URL is the source of truth; the server render always shows "all".
  const filter = useSyncExternalStore(subscribe, readFilter, () => "all" as const);

  const choose = (f: Filter) => {
    const url = new URL(window.location.href);
    if (f === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", f);
    window.history.replaceState(window.history.state, "", url);
    listeners.forEach((l) => l());
  };

  const shown = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const counts = Object.fromEntries(categories.map((c) => [c.id, projects.filter((p) => p.category === c.id).length]));

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-card]",
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.07, overwrite: true },
      );
    },
    { dependencies: [filter], scope: root },
  );

  return (
    <div ref={root}>
      <div className="rule-b sticky top-[var(--nav-h)] z-20 -mx-[var(--gutter)] bg-paper/90 px-[var(--gutter)] backdrop-blur">
        <div role="group" aria-label="Filter projects by category" className="flex gap-2 overflow-x-auto py-4 [scrollbar-width:none]">
          {[{ id: "all" as const, label: "All", index: "00" }, ...categories].map((c) => {
            const n = c.id === "all" ? projects.length : counts[c.id];
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={filter === c.id}
                disabled={n === 0}
                onClick={() => choose(c.id)}
                className="t-mono shrink-0 border border-ink/15 px-4 py-2.5 transition-colors hover:border-ink disabled:opacity-35 aria-pressed:border-cobalt aria-pressed:bg-cobalt aria-pressed:text-ivory"
              >
                {c.label} ({String(n).padStart(2, "0")})
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {shown.length} {shown.length === 1 ? "project" : "projects"} shown
      </p>

      <ul className="grid gap-x-[var(--gutter)] gap-y-16 pt-12 md:grid-cols-2 md:pt-16">
        {shown.map((p, i) => (
          <li key={p.slug} data-card className={i % 2 === 1 ? "md:mt-32" : ""}>
            <Link href={`/work/${p.slug}`} className="group block">
              <div className="img-frame relative aspect-[4/5] bg-ink">
                <Image
                  src={p.portrait.src}
                  alt={p.portrait.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                />
                <span className="t-mono absolute left-4 top-4 text-ivory">{String(projects.indexOf(p) + 1).padStart(2, "0")}</span>
                {p.placeholder && (
                  <span className="absolute bottom-4 left-4">
                    <Placeholder title="Illustrative sample project with a generated concept render">Sample</Placeholder>
                  </span>
                )}
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h2 className="t-h3 transition-colors group-hover:text-cobalt">{p.title}</h2>
                <span className="t-mono shrink-0 text-stone">{categoryById(p.category).short}</span>
              </div>
              <p className="mt-2 max-w-[48ch] text-ink/65">{p.concept}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
