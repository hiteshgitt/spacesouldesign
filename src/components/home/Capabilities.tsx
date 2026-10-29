"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { services } from "@/content/services";
import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";

/** Seven services as an accordion-like index; the sticky frame swaps imagery on hover/focus. */
export default function Capabilities() {
  const [active, setActive] = useState(0);
  const svc = services[active];

  return (
    <section className="relative bg-paper py-[var(--section-y)]" aria-labelledby="cap-title">
      <div className="shell">
        <div className="grid-12 items-end gap-y-8 pb-14">
          <p className="t-mono col-span-12 text-stone md:col-span-3">(05) — Capabilities</p>
          <SplitReveal as="h2" id="cap-title" className="t-h2 col-span-12 text-ink md:col-span-9">
            Everything a space needs, under one roof.
          </SplitReveal>
        </div>

        <div className="grid-12 gap-y-10">
          <div className="relative hidden md:col-span-5 md:block">
            <div className="sticky top-[calc(var(--nav-h)+2rem)] aspect-square overflow-hidden bg-ink">
              <div className="absolute inset-0">
              {services.map((s, i) => (
                <Image
                  key={s.slug}
                  src={s.image.src}
                  alt={i === active ? s.image.alt : ""}
                  fill
                  sizes="40vw"
                  className={`object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] ${
                    i === active ? "scale-100 opacity-100" : "scale-105 opacity-0"
                  }`}
                />
              ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-ivory">
                <span className="t-mono">{svc.index} / 07</span>
                <span className="t-mono max-w-[60%] text-right opacity-80">{svc.kicker}</span>
              </div>
            </div>
          </div>

          <Reveal as="ul" className="rule-t col-span-12 md:col-span-7" stagger={0.05}>
            {services.map((s, i) => (
              <li key={s.slug} className="rule-b" data-reveal-item>
                <Link
                  href={`/services#${s.slug}`}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-6 md:py-7"
                >
                  <span className={`t-mono transition-colors ${i === active ? "text-cobalt" : "text-stone"}`}>{s.index}</span>
                  <span>
                    <span className="block font-display text-[clamp(1.5rem,2.8vw,2.5rem)] font-[750] uppercase leading-[0.95] tracking-[-0.025em] text-ink [font-stretch:108%]">
                      {s.title}
                    </span>
                    <span
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)] ${
                        i === active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 max-md:grid-rows-[1fr] max-md:opacity-100"
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className="t-body block max-w-[52ch] pt-3 text-ink/65">{s.summary}</span>
                      </span>
                    </span>
                  </span>
                  <span className="text-xl text-ink transition-transform duration-500 group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
