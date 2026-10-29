import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";
import Credibility from "@/components/home/Credibility";
import ContactFinale from "@/components/home/ContactFinale";
import ImageReveal from "@/components/motion/ImageReveal";
import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import JsonLd from "@/components/ui/JsonLd";
import Placeholder from "@/components/ui/Placeholder";
import { site } from "@/content/site";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Studio",
  description: `${site.name} is a spatial design studio for exhibitions, events and brand environments — designing, engineering and building in one team.`,
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: `Studio — ${site.name}` },
};

/** How the studio works. Written as approach, not as claims — facts about the business live in `site.ts`. */
const principles = [
  {
    index: "01",
    title: "Space is a medium",
    body: "A stand isn't a backdrop for a logo. Its proportions, thresholds and light are how a brand is felt before a word is read.",
  },
  {
    index: "02",
    title: "Drawn before it's built",
    body: "Every decision is resolved in plan, elevation and 3D first, so fabrication answers questions instead of raising them.",
  },
  {
    index: "03",
    title: "One team, end to end",
    body: "The people who design the space stay with it through the workshop and onto the show floor. Nothing gets lost in a handover.",
  },
  {
    index: "04",
    title: "Built to be reused",
    body: "Where the brief allows, structures are designed to travel, reconfigure and come back for the next show.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        index="(Studio) — About"
        tone="dark"
        title={
          <>
            Where structure <span className="t-serif normal-case text-cobalt-glow">meets</span> soul.
          </>
        }
        lead={
          <p>
            {site.name} designs and builds exhibition stalls, custom booths and brand environments. We work at the point
            where architecture, brand and engineering meet — and we stay with a space from first sketch to handover.
          </p>
        }
      />

      <section className="bg-paper py-[var(--section-y)] text-ink" aria-labelledby="studio-approach">
        <div className="shell grid-12 gap-y-12">
          <div className="col-span-12 md:col-span-5">
            <div className="aspect-[4/5]">
              <ImageReveal className="h-full" parallax={0.08}>
                <Image
                  src="/images/projects/monolith-pavilion/portrait.jpg"
                  alt="Concept render of a sculptural exhibition stand"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  loading="eager"
                  className="object-cover"
                />
              </ImageReveal>
            </div>
            <p className="mt-4">
              <Placeholder title="Replace with real studio, workshop or team photography">
                Concept render — replace with studio photo
              </Placeholder>
            </p>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <p className="t-mono text-stone">(01) — Approach</p>
            <SplitReveal as="h2" id="studio-approach" className="t-h2 mt-6">
              Designed with intent. Built with precision.
            </SplitReveal>
            <Reveal className="mt-10 space-y-6">
              <p data-reveal-item className="t-lead text-ink/80">
                Every space we make starts with a question: what should a visitor feel in the first three steps?
              </p>
              <p data-reveal-item className="t-body text-ink/70">
                From there we work through the brief, the hall and the audience to a spatial idea — then resolve it in
                drawings and 3D until every joint, light and graphic is decided before the workshop cuts a single
                panel.
              </p>
              <div data-reveal-item className="rule-t pt-6">
                <p className="t-mono mb-3 text-stone">Studio story</p>
                <Placeholder title="Owner to supply: founding year, founders, location, team size and the studio's own story">
                  Founding story, team &amp; location — to be supplied
                </Placeholder>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="rule-t bg-paper py-[var(--section-y)] text-ink" aria-labelledby="studio-principles">
        <div className="shell">
          <div className="grid-12 items-end gap-y-8 pb-14">
            <p className="t-mono col-span-12 text-stone md:col-span-3">(02) — Principles</p>
            <SplitReveal as="h2" id="studio-principles" className="t-h2 col-span-12 md:col-span-9">
              What we hold <span className="t-serif normal-case">every</span> space to.
            </SplitReveal>
          </div>
          <Reveal as="ol" className="grid border-l border-t border-ink/15 sm:grid-cols-2" stagger={0.06}>
            {principles.map((p) => (
              <li key={p.index} data-reveal-item className="flex min-h-64 flex-col justify-between gap-12 border-b border-r border-ink/15 p-6 md:p-10">
                <span className="t-mono text-stone">{p.index}</span>
                <div>
                  <h3 className="t-h3">{p.title}</h3>
                  <p className="t-body mt-4 max-w-[46ch] text-ink/70">{p.body}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <Credibility />
      <ContactFinale index="(Next)" />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Studio", path: "/about" },
        ])}
      />
    </>
  );
}
