import { site, showPlaceholders } from "@/content/site";
import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";
import Placeholder from "@/components/ui/Placeholder";

const credentialLabels: Record<keyof typeof site.credentials, string> = {
  yearsExperience: "Years of experience",
  projectsDelivered: "Projects delivered",
  citiesServed: "Cities served",
  largestFootprint: "Largest footprint",
};

/**
 * Proof section. Renders only verified data from `src/content/site.ts`.
 * Empty slots are shown as labelled placeholders in preview builds and
 * disappear entirely in production (NEXT_PUBLIC_SHOW_PLACEHOLDERS=false).
 */
export default function Credibility() {
  const creds = Object.entries(site.credentials) as [keyof typeof site.credentials, (typeof site.credentials)[keyof typeof site.credentials]][];
  const hasCreds = creds.some(([, c]) => c.value);
  const industries = site.industries.value;
  const hasAnything = hasCreds || industries?.length || site.clients.length || site.testimonials.length || site.awards.length;

  if (!hasAnything && !showPlaceholders) return null;

  return (
    <section className="on-ink relative py-[var(--section-y)]" aria-labelledby="proof-title">
      <div className="shell">
        <div className="grid-12 items-end gap-y-8 pb-14">
          <p className="t-mono col-span-12 text-fog md:col-span-3">(06) — Proof</p>
          <SplitReveal as="h2" id="proof-title" className="t-h2 col-span-12 md:col-span-9">
            Trusted on the show floor.
          </SplitReveal>
        </div>

        <Reveal className="grid grid-cols-2 border-l border-t border-ivory/15 md:grid-cols-4" stagger={0.06}>
          {creds.map(([key, c]) =>
            c.value || showPlaceholders ? (
              <div key={key} className="border-b border-r border-ivory/15 p-6 md:p-8" data-reveal-item>
                <p className="t-mono text-fog">{credentialLabels[key]}</p>
                {c.value ? (
                  <p className="mt-10 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-[800] leading-none tracking-[-0.04em]">
                    {c.value}
                  </p>
                ) : (
                  <div className="mt-10 space-y-3">
                    <p className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-[800] leading-none tracking-[-0.04em] text-ivory/15" aria-hidden>
                      —
                    </p>
                    <Placeholder title={c.note}>To confirm</Placeholder>
                  </div>
                )}
              </div>
            ) : null,
          )}
        </Reveal>

        <div className="mt-16 grid-12 gap-y-12">
          <div className="col-span-12 md:col-span-6">
            <p className="t-mono mb-6 text-fog">Industries</p>
            {industries?.length ? (
              <ul className="flex flex-wrap gap-2">
                {industries.map((i) => (
                  <li key={i} className="tag">
                    {i}
                  </li>
                ))}
              </ul>
            ) : (
              <Placeholder title={site.industries.note}>Industries served — to confirm</Placeholder>
            )}
          </div>
          <div className="col-span-12 md:col-span-6">
            <p className="t-mono mb-6 text-fog">Clients</p>
            {site.clients.length ? (
              <ul className="grid grid-cols-3 gap-6">
                {site.clients.map((c) => (
                  <li key={c.name}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.logo} alt={c.name} className="h-10 w-auto opacity-80" />
                  </li>
                ))}
              </ul>
            ) : (
              <Placeholder title="Client logos only with written permission. Add to site.clients in src/content/site.ts">
                Client logos — awaiting approval
              </Placeholder>
            )}
          </div>
        </div>

        {site.testimonials.length ? (
          <ul className="mt-[var(--block-gap-sm)] grid gap-12 md:grid-cols-2">
            {site.testimonials.map((t) => (
              <li key={t.name}>
                <blockquote className="t-serif text-[clamp(1.6rem,2.8vw,2.4rem)] leading-[1.1]">“{t.quote}”</blockquote>
                <p className="t-mono mt-6 text-fog">
                  {t.name} — {t.role}, {t.company}
                </p>
              </li>
            ))}
          </ul>
        ) : showPlaceholders ? (
          <div className="mt-[var(--block-gap-sm)] border border-dashed border-ivory/20 p-8 md:p-12">
            <p className="t-serif text-[clamp(1.6rem,2.8vw,2.4rem)] leading-[1.1] text-ivory/60">
              A client testimonial will appear here.
            </p>
            <div className="mt-6">
              <Placeholder title="Add real, attributed testimonials to site.testimonials in src/content/site.ts">
                Testimonial — none supplied
              </Placeholder>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
