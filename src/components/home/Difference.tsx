"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { processSteps } from "@/content/services";
import SplitReveal from "@/components/motion/SplitReveal";

/**
 * Five-step method. On desktop the heading stays pinned (CSS sticky — no JS
 * pin needed) while a cobalt rule fills as each step crosses the centre.
 */
export default function Difference() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", el);
      if (prefersReducedMotion()) {
        steps.forEach((s) => s.classList.add("is-on"));
        return;
      }
      gsap.fromTo(
        el.querySelector("[data-progress]"),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: el.querySelector("[data-steps]"), start: "top 60%", end: "bottom 60%", scrub: true },
        },
      );
      steps.forEach((s) =>
        gsap.timeline({
          scrollTrigger: {
            trigger: s,
            start: "top 62%",
            end: "bottom 62%",
            toggleClass: { targets: s, className: "is-on" },
          },
        }),
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative bg-paper py-[var(--section-y)]" aria-labelledby="diff-title">
      <div className="shell grid-12 gap-y-16">
        <div className="col-span-12 md:col-span-5">
          <div className="md:sticky md:top-[calc(var(--nav-h)+3rem)]">
            <p className="t-mono mb-8 text-stone">(03) — Method</p>
            <SplitReveal as="h2" id="diff-title" className="t-h2 text-ink">
              Designed with intent. Built with precision.
            </SplitReveal>
            <p className="t-body mt-8 max-w-[40ch] text-ink/65">
              One team from first sketch to final handover — so the idea that wins the pitch is the one that stands
              in the hall.
            </p>
            <svg viewBox="0 0 240 120" className="mt-12 hidden w-60 text-ink/30 md:block" aria-hidden fill="none" stroke="currentColor">
              <rect x="0.5" y="0.5" width="239" height="119" />
              <path d="M0 40h240M0 80h240M60 0v120M120 0v120M180 0v120" strokeDasharray="2 4" />
              <path d="M30 100 L90 30 L150 70 L210 20" stroke="var(--color-cobalt)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        <ol data-steps className="relative col-span-12 md:col-span-6 md:col-start-7">
          <span className="absolute left-0 top-0 h-full w-px bg-ink/12" aria-hidden />
          <span data-progress className="absolute left-0 top-0 h-full w-px origin-top bg-cobalt" aria-hidden />
          {processSteps.map((s) => (
            <li
              key={s.index}
              data-step
              className="group relative grid grid-cols-[4rem_1fr] gap-4 py-10 pl-6 md:py-14 md:pl-10"
            >
              <span className="t-mono pt-2 text-cobalt">{s.index}</span>
              <div>
                <h3 className="font-display text-[clamp(2.2rem,4.6vw,4rem)] font-[800] uppercase leading-[0.9] tracking-[-0.03em] [font-stretch:112%] text-ink/55 transition-colors duration-700 group-[.is-on]:text-ink">
                  {s.title}
                </h3>
                <p className="t-lead mt-4 max-w-[34ch] text-ink/70">{s.body}</p>
              </div>
              <span
                className="absolute -left-[5px] top-[3.1rem] size-[11px] rounded-full border border-ink/30 bg-paper transition-colors duration-500 group-[.is-on]:border-cobalt group-[.is-on]:bg-cobalt md:top-[4.1rem]"
                aria-hidden
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
