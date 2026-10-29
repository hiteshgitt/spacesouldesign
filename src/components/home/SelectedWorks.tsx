"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { categoryById, projects } from "@/content/projects";
import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";
import Placeholder from "@/components/ui/Placeholder";

const featured = projects.filter((p) => p.featured);
const rest = projects.filter((p) => !p.featured);

/**
 * Editorial index: large numbered rows. On fine pointers a preview follows the
 * cursor; on touch each row shows its own image inline.
 */
export default function SelectedWorks() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const el = preview.current;
      if (!el || !window.matchMedia("(pointer: fine)").matches) return;
      const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      const list = root.current!.querySelector<HTMLElement>("[data-list]")!;
      const move = (e: PointerEvent) => {
        const r = list.getBoundingClientRect();
        x(e.clientX - r.left);
        y(e.clientY - r.top);
      };
      list.addEventListener("pointermove", move);
      return () => list.removeEventListener("pointermove", move);
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (!preview.current || prefersReducedMotion()) return;
      gsap.to(preview.current, {
        autoAlpha: active === null ? 0 : 1,
        scale: active === null ? 0.85 : 1,
        duration: 0.5,
        ease: "expo.out",
      });
    },
    { dependencies: [active], scope: root },
  );

  const all = [...featured, ...rest];

  return (
    <section ref={root} className="on-ink relative py-[var(--section-y)]" aria-labelledby="works-title">
      <div className="shell">
        <div className="grid-12 items-end gap-y-8 pb-14">
          <p className="t-mono col-span-12 text-fog md:col-span-3">(02) — Selected works</p>
          <SplitReveal as="h2" id="works-title" className="t-h2 col-span-12 md:col-span-6">
            Spaces built around one idea.
          </SplitReveal>
          <div className="col-span-12 flex flex-col items-start gap-4 md:col-span-3 md:items-end">
            <Placeholder title="All projects shown are illustrative samples with generated concept renders. Replace in src/content/projects.ts">
              Sample projects
            </Placeholder>
            <Link href="/work" className="link-u t-mono">
              All work ({String(projects.length).padStart(2, "0")}) →
            </Link>
          </div>
        </div>

        <div data-list className="relative">
          {/* Cursor-following preview (desktop) */}
          <div
            ref={preview}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-20 hidden aspect-[4/5] w-[min(22vw,20rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden opacity-0 [@media(pointer:fine)]:block"
          >
            {all.map((p, i) => (
              <Image
                key={p.slug}
                src={p.portrait.src}
                alt=""
                fill
                sizes="(min-width: 1921px) 17vw, 320px"
                className={`object-cover transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>

          <ol className="rule-t border-ivory/15" onPointerLeave={() => setActive(null)}>
            {all.map((p, i) => (
              <Reveal as="li" key={p.slug} className="rule-b border-ivory/15" y={16}>
                <Link
                  href={`/work/${p.slug}`}
                  className="group grid grid-cols-12 items-baseline gap-x-4 gap-y-4 py-7 md:py-9"
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                >
                  <span className="t-mono col-span-2 text-fog md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                  <span className="col-span-10 md:col-span-6">
                    <span className="block font-display text-[clamp(2rem,5.4vw,5.2rem)] font-[800] uppercase leading-[0.9] tracking-[-0.035em] [font-stretch:112%] transition-[color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3 group-hover:text-cobalt-glow">
                      {p.title}
                    </span>
                    <span className="mt-3 block max-w-[46ch] text-ivory/60 md:hidden">{p.concept}</span>
                  </span>
                  <span className="t-mono col-span-6 col-start-3 text-fog md:col-span-3 md:col-start-auto">
                    {categoryById(p.category).label}
                    <span className="block text-ivory/40">{p.industry}</span>
                  </span>
                  <span className="t-mono col-span-4 text-right text-fog md:col-span-2">
                    {p.footprint?.split("·")[0]}
                    <span className="ml-3 inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </span>
                  {/* Inline image on touch screens */}
                  <span className="relative col-span-12 block aspect-[16/10] overflow-hidden [@media(pointer:fine)]:hidden">
                    <Image src={p.cover.src} alt={p.cover.alt} fill sizes="100vw" className="object-cover" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
