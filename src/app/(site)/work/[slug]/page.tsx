import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";
import ImageReveal from "@/components/motion/ImageReveal";
import Placeholder from "@/components/ui/Placeholder";
import JsonLd from "@/components/ui/JsonLd";
import ProjectViewer from "@/components/work/ProjectViewer";
import CompareSlider from "@/components/work/CompareSlider";
import ContactFinale from "@/components/home/ContactFinale";
import { categoryById, getProject, getRelated, projects } from "@/content/projects";
import { breadcrumbJsonLd } from "@/lib/seo";

// Every slug is prerendered; unknown ones 404, so a blocking route is fine.
export const instant = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.seo.title,
    description: p.seo.description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      type: "article",
      url: `/work/${p.slug}`,
      title: p.seo.title,
      description: p.seo.description,
      images: [{ url: p.cover.src, width: p.cover.width, height: p.cover.height, alt: p.cover.alt }],
    },
    // Sample entries stay out of search until replaced by real projects.
    robots: p.placeholder ? { index: false, follow: true } : undefined,
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const cat = categoryById(p.category);
  const n = String(projects.indexOf(p) + 1).padStart(2, "0");
  const related = getRelated(p.slug, 2);
  const facts = [
    { label: "Client", value: p.client ?? "Withheld / sample" },
    { label: "Category", value: cat.label },
    { label: "Industry", value: p.industry },
    { label: "Format", value: p.location },
    { label: "Footprint", value: p.footprint },
    { label: "Year", value: p.year },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  return (
    <article>
      {/* ── Masthead ───────────────────────────────────────── */}
      <header className="on-dark relative overflow-hidden pt-[calc(var(--nav-h)+clamp(2rem,8vw,7rem))]">
        <div aria-hidden className="blueprint-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="shell relative">
          <nav aria-label="Breadcrumb" className="t-mono flex flex-wrap items-center gap-3 text-fog">
            <Link href="/work" className="link-u">Work</Link>
            <span aria-hidden>/</span>
            <Link href={`/work?category=${cat.id}`} className="link-u">{cat.label}</Link>
            <span aria-hidden>/</span>
            <span aria-current="page" className="text-ivory">{n}</span>
          </nav>
          <SplitReveal as="h1" trigger="load" by="lines" className="t-display mt-10 max-w-[12ch]">
            {p.title}
          </SplitReveal>
          <Reveal className="grid-12 mt-10 gap-y-6 pb-[clamp(3rem,6vw,5rem)]" delay={0.4}>
            <p className="t-serif col-span-12 text-[clamp(1.5rem,2.6vw,2.4rem)] leading-tight text-ivory/90 md:col-span-7" data-reveal-item>
              {p.concept}
            </p>
            <div className="col-span-12 flex items-end md:col-span-4 md:col-start-9 md:justify-end" data-reveal-item>
              {p.placeholder && (
                <Placeholder title="Illustrative case study — no client, no completed build. Replace with an approved project.">
                  Sample case study
                </Placeholder>
              )}
            </div>
          </Reveal>
        </div>
        <ImageReveal immediate delay={0.2} parallax={0.12} className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
          <Image
            src={p.cover.src}
            alt={p.cover.alt}
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
        </ImageReveal>
      </header>

      {/* ── Overview ───────────────────────────────────────── */}
      <section aria-labelledby="overview" className="bg-paper py-[var(--section-y-sm)] text-ink">
        <div className="shell grid-12 gap-y-14">
          <div className="col-span-12 md:col-span-4">
            <p className="t-mono text-stone">(01) — Overview</p>
            <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
              {facts.map((f) => (
                <div key={f.label} className="flex justify-between gap-6 py-4">
                  <dt className="t-mono text-stone">{f.label}</dt>
                  <dd className="text-right">{f.value}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Services on this project">
              {p.services.map((s) => (
                <li key={s} className="tag">{s}</li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 md:col-span-7 md:col-start-6">
            <h2 id="overview" className="sr-only">Overview</h2>
            <Reveal>
              <p className="t-lead text-[clamp(1.35rem,2.2vw,2rem)] leading-snug" data-reveal-item>{p.summary}</p>
            </Reveal>

            <h3 className="t-mono mt-[var(--block-gap-sm)] text-stone">(02) — Objectives</h3>
            <Reveal as="ol" className="mt-6 border-t border-ink/10" stagger={0.08}>
              {p.objectives.map((o, i) => (
                <li key={o} data-reveal-item className="grid grid-cols-[3rem_1fr] border-b border-ink/10 py-6">
                  <span className="t-mono text-cobalt">{String(i + 1).padStart(2, "0")}</span>
                  <span className="t-h3 normal-case">{o}</span>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Concept ────────────────────────────────────────── */}
      <section aria-labelledby="concept" className="bg-paper pb-[var(--section-y-sm)] text-ink">
        <div className="shell grid-12 items-start gap-y-12">
          <ImageReveal from="left" className="col-span-12 aspect-[4/5] md:col-span-5">
            <Image src={p.portrait.src} alt={p.portrait.alt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          </ImageReveal>
          <div className="col-span-12 md:col-span-6 md:col-start-7 md:pt-24">
            <p className="t-mono text-stone">(03) — Concept</p>
            <SplitReveal as="h2" id="concept" className="t-h2 mt-8">
              The idea, <span className="t-serif normal-case">resolved.</span>
            </SplitReveal>
            <Reveal>
              <p className="t-body mt-8 max-w-[52ch] text-ink/80" data-reveal-item>{p.conceptDevelopment}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 3D visualization ───────────────────────────────── */}
      <section aria-labelledby="viz" className="on-dark relative overflow-hidden py-[var(--section-y-sm)]">
        <div aria-hidden className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="shell relative">
          <div className="grid-12 items-end gap-y-8 pb-12">
            <p className="t-mono col-span-12 text-fog md:col-span-3">(04) — Visualization</p>
            <SplitReveal as="h2" id="viz" className="t-h2 col-span-12 md:col-span-9">
              Blueprint, concept, <span className="t-serif normal-case text-cobalt-glow">reality.</span>
            </SplitReveal>
          </div>
          <ProjectViewer project={p} />
          <div className="mt-[var(--block-gap)]">
            <p className="t-mono mb-6 text-fog">Drawing against render — drag to compare</p>
            <CompareSlider before={p.stages.blueprint} after={p.stages.reality} label={`${p.title}: compare drawing and render`} />
          </div>
        </div>
      </section>

      {/* ── Process ────────────────────────────────────────── */}
      <section aria-labelledby="process" className="bg-paper py-[var(--section-y-sm)] text-ink">
        <div className="shell">
          <div className="grid-12 gap-y-8 pb-14">
            <p className="t-mono col-span-12 text-stone md:col-span-3">(05) — Process</p>
            <SplitReveal as="h2" id="process" className="t-h2 col-span-12 md:col-span-9">
              From brief <span className="t-serif normal-case">to</span> handover.
            </SplitReveal>
          </div>
          <Reveal as="ol" className="grid border-t border-ink/15 md:grid-cols-5" stagger={0.08}>
            {p.process.filter((s) => s.body).map((s, i) => (
              <li key={s.id} data-reveal-item className="border-b border-ink/15 py-8 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                <span className="t-mono text-cobalt">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-h3 mt-6">{s.title}</h3>
                <p className="t-body mt-4 text-ink/70">{s.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Gallery ────────────────────────────────────────── */}
      <section aria-labelledby="gallery" className="bg-paper pb-[var(--section-y-sm)] text-ink">
        <div className="shell">
          <div className="flex items-end justify-between pb-10">
            <h2 id="gallery" className="t-mono text-stone">(06) — Gallery</h2>
            <Placeholder title="Generated concept renders — replace with project photography">Concept renders</Placeholder>
          </div>
          <div className="grid-12 gap-y-[var(--gutter)]">
            {p.gallery.map((g, i) => (
              <figure
                key={g.src}
                className={i === 0 ? "col-span-12" : i === 1 ? "col-span-12 md:col-span-5" : "col-span-12 md:col-span-7"}
              >
                <div style={{ aspectRatio: `${g.width} / ${g.height}` }}>
                  <ImageReveal from={i === 2 ? "right" : "bottom"} className="h-full w-full">
                    <Image
                      src={g.src}
                      alt={g.alt}
                      fill
                      sizes={i === 0 ? "100vw" : "(min-width: 768px) 55vw, 100vw"}
                      className="object-cover"
                    />
                  </ImageReveal>
                </div>
                {g.caption && (
                  <figcaption className="t-mono mt-4 flex gap-4 text-stone">
                    <span className="text-ink">Fig. {String(i + 1).padStart(2, "0")}</span>
                    {g.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related ────────────────────────────────────────── */}
      <section aria-labelledby="related" className="bg-paper pb-[var(--section-y-sm)] text-ink">
        <div className="shell">
          <div className="rule-t flex items-end justify-between pt-10 pb-10">
            <h2 id="related" className="t-h2">Next spaces</h2>
            <Link href="/work" className="btn btn-ghost hidden sm:inline-flex">All work</Link>
          </div>
          <ul className="grid gap-[var(--gutter)] md:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/work/${r.slug}`} className="group block">
                  <div className="img-frame relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={r.cover.src}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-6">
                    <span className="t-h3 link-u">{r.title}</span>
                    <span className="t-mono text-stone">{categoryById(r.category).short}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactFinale index="(07)" />

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: p.title, path: `/work/${p.slug}` },
        ])}
      />
    </article>
  );
}
