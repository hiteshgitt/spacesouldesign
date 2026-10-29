import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import ContactFinale from "@/components/home/ContactFinale";
import ImageReveal from "@/components/motion/ImageReveal";
import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import JsonLd from "@/components/ui/JsonLd";
import Placeholder from "@/components/ui/Placeholder";
import { processSteps, services } from "@/content/services";
import { categoryById } from "@/content/projects";
import { site } from "@/content/site";
import { absolute, breadcrumbJsonLd, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Exhibition stall design, custom booths, 3D visualization, fabrication, event environments, brand activations and on-site installation.",
  alternates: { canonical: "/services" },
  openGraph: { url: "/services", title: `Services — ${site.name}` },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        index="(Services) — 07 disciplines"
        title={
          <>
            One studio, <span className="t-serif normal-case">from</span> sketch to handover.
          </>
        }
        lead={
          <>
            <p>
              Design, visualization, fabrication and installation under one roof — so the stand that opens on day one
              is the one that was approved on paper.
            </p>
            <p className="mt-6">
              <Placeholder title="Service list from the brief — owner to confirm scope and wording">
                Confirm service scope with owner
              </Placeholder>
            </p>
          </>
        }
      >
        <nav aria-label="Services" className="rule-t mt-6 flex flex-wrap gap-2 pt-6">
          {services.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className="chip">
              <span className="mr-2 opacity-60">{s.index}</span>{s.title}
            </a>
          ))}
        </nav>
      </PageHeader>

      <div className="bg-paper text-ink">
        {services.map((s, i) => {
          const cat = s.relatedCategory ? categoryById(s.relatedCategory) : undefined;
          const flip = i % 2 === 1;
          return (
            <section
              key={s.slug}
              id={s.slug}
              aria-labelledby={`${s.slug}-title`}
              className="rule-t scroll-mt-[var(--nav-h)] py-[var(--section-y-xs)]"
            >
              <div className="shell grid-12 gap-y-10">
                <div className={`col-span-12 md:col-span-5 ${flip ? "md:order-2 md:col-start-8" : ""}`}>
                  <div className="aspect-square">
                    <ImageReveal className="h-full" from={flip ? "left" : "right"} parallax={0.08}>
                      <Image
                        src={s.image.src}
                        alt={s.image.alt}
                        fill
                        sizes="(min-width: 768px) 40vw, 100vw"
                        className="object-cover"
                      />
                    </ImageReveal>
                  </div>
                </div>
                <div className={`col-span-12 flex flex-col md:col-span-6 ${flip ? "md:order-1" : "md:col-start-7"}`}>
                  <p className="t-mono text-stone">
                    ({s.index}) — {s.kicker}
                  </p>
                  <SplitReveal as="h2" id={`${s.slug}-title`} className="t-h2 mt-6">
                    {s.title}
                  </SplitReveal>
                  <Reveal className="mt-8 space-y-6">
                    <p data-reveal-item className="t-lead text-ink/80">
                      {s.summary}
                    </p>
                    <p data-reveal-item className="t-body text-ink/70">
                      {s.body}
                    </p>
                    <div data-reveal-item>
                      <h3 className="t-mono mb-3 text-stone">Deliverables</h3>
                      <ul className="rule-t">
                        {s.deliverables.map((d) => (
                          <li key={d} className="rule-b flex items-baseline justify-between gap-4 py-3">
                            <span className="t-body">{d}</span>
                            <span aria-hidden className="t-mono text-stone">
                              +
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {cat && (
                      <p data-reveal-item>
                        <Link href={`/work?category=${cat.id}`} className="link-u t-mono">
                          See {cat.label.toLowerCase()} →
                        </Link>
                      </p>
                    )}
                  </Reveal>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="on-dark relative overflow-hidden py-[var(--section-y)]" aria-labelledby="svc-process">
        <div aria-hidden className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="shell relative">
          <div className="grid-12 items-end gap-y-8 pb-14">
            <p className="t-mono col-span-12 text-fog md:col-span-3">(How) — Process</p>
            <SplitReveal as="h2" id="svc-process" className="t-h2 col-span-12 text-ivory md:col-span-9">
              Five steps, <span className="t-serif normal-case text-cobalt-glow">one</span> team.
            </SplitReveal>
          </div>
          <Reveal as="ol" className="grid gap-px bg-ivory/15 sm:grid-cols-2 lg:grid-cols-5" stagger={0.08}>
            {processSteps.map((p) => (
              <li key={p.index} data-reveal-item className="flex min-h-56 flex-col justify-between gap-10 bg-void p-6">
                <span className="t-mono text-cobalt-glow">{p.index}</span>
                <div>
                  <h3 className="t-h3 text-ivory">{p.title}</h3>
                  <p className="t-body mt-3 text-ivory/65">{p.body}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <ContactFinale index="(Next)" />

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": services.map((s) => ({
            "@type": "Service",
            "@id": absolute(`/services#${s.slug}`),
            name: s.title,
            description: s.summary,
            serviceType: s.keywords[0],
            provider: { "@id": `${siteUrl}/#organization` },
          })),
        }}
      />
    </>
  );
}
