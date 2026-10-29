import type { ReactNode } from "react";
import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";

/**
 * Inner-page masthead: index marker, monumental H1 and an optional lead.
 * `tone="dark"` puts it on the void background with the blueprint grid.
 */
export default function PageHeader({
  index,
  title,
  lead,
  tone = "light",
  children,
}: {
  index: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "light" | "dark";
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <header
      className={`relative overflow-hidden pb-[clamp(2.5rem,7vw,6rem)] pt-[calc(var(--nav-h)+clamp(2rem,9vw,8rem))] ${
        dark ? "on-dark" : "bg-paper text-ink"
      }`}
    >
      {dark && <div aria-hidden className="blueprint-grid pointer-events-none absolute inset-0 opacity-60" />}
      <div className="shell relative">
        <p className={`t-mono mb-8 ${dark ? "text-fog" : "text-stone"}`}>{index}</p>
        <SplitReveal as="h1" trigger="load" by="lines" className="t-display-sm max-w-[16ch]">
          {title}
        </SplitReveal>
        {(lead || children) && (
          <Reveal className="grid-12 mt-10 gap-y-6 md:mt-14" delay={0.4}>
            {lead && <div className={`t-lead col-span-12 md:col-span-6 md:col-start-7 ${dark ? "text-ivory/75" : "text-ink/75"}`}>{lead}</div>}
            {children && <div className="col-span-12">{children}</div>}
          </Reveal>
        )}
      </div>
    </header>
  );
}
