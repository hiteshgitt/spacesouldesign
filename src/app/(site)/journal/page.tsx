import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import ImageReveal from "@/components/motion/ImageReveal";
import Reveal from "@/components/motion/Reveal";
import JsonLd from "@/components/ui/JsonLd";
import Placeholder from "@/components/ui/Placeholder";
import { journal } from "@/content/journal";
import { site } from "@/content/site";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on exhibition design, materials, fabrication and the process behind brand spaces.",
  alternates: { canonical: "/journal" },
  openGraph: { url: "/journal", title: `Journal — ${site.name}` },
};

const fmt = (d: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(d));

export default function JournalPage() {
  const [lead, ...rest] = journal;
  return (
    <>
      <PageHeader
        index="(Journal) — Notes from the studio"
        title={
          <>
            Thinking <span className="t-serif normal-case">in</span> space.
          </>
        }
        lead={
          <>
            <p>Insights, process notes and material studies — how a stand gets from an idea to the show floor.</p>
            <p className="mt-6">
              <Placeholder title="Draft articles for layout — studio to review, edit or replace before publishing">
                Draft articles — review before publishing
              </Placeholder>
            </p>
          </>
        }
      />

      <section className="bg-paper pb-[var(--section-y)] text-ink" aria-label="Articles">
        <div className="shell">
          {lead && (
            <article className="rule-t grid-12 gap-y-8 py-12">
              <Link href={`/journal/${lead.slug}`} className="group col-span-12 md:col-span-7" aria-label={lead.title}>
                <div className="aspect-[16/10]">
                  <ImageReveal className="h-full">
                    <Image
                      src={lead.cover.src}
                      alt={lead.cover.alt}
                      fill
                      sizes="(min-width: 768px) 58vw, 100vw"
                      loading="eager"
                      className="object-cover transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                    />
                  </ImageReveal>
                </div>
              </Link>
              <div className="col-span-12 flex flex-col justify-between gap-8 md:col-span-4 md:col-start-9">
                <p className="t-mono text-stone">
                  {lead.kind} · <time dateTime={lead.date}>{fmt(lead.date)}</time> · {lead.readingTime}
                </p>
                <div>
                  <h2 className="t-h2">
                    <Link href={`/journal/${lead.slug}`} className="hover:text-cobalt">
                      {lead.title}
                    </Link>
                  </h2>
                  <p className="t-body mt-6 text-ink/70">{lead.excerpt}</p>
                </div>
                <Link href={`/journal/${lead.slug}`} className="link-u t-mono self-start">
                  Read article →
                </Link>
              </div>
            </article>
          )}

          <Reveal as="ul" className="rule-t grid gap-x-[var(--gutter)] gap-y-14 pt-12 md:grid-cols-2" stagger={0.08}>
            {rest.map((j) => (
              <li key={j.slug} data-reveal-item>
                <article>
                  <Link href={`/journal/${j.slug}`} className="group block">
                    <div className="img-frame relative aspect-[16/10]">
                      <Image
                        src={j.cover.src}
                        alt={j.cover.alt}
                        fill
                        sizes="(min-width: 768px) 45vw, 100vw"
                        className="object-cover transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                      />
                    </div>
                    <p className="t-mono mt-5 text-stone">
                      {j.kind} · <time dateTime={j.date}>{fmt(j.date)}</time> · {j.readingTime}
                    </p>
                    <h2 className="t-h3 mt-3 group-hover:text-cobalt">{j.title}</h2>
                    <p className="t-body mt-3 max-w-[52ch] text-ink/70">{j.excerpt}</p>
                  </Link>
                </article>
              </li>
            ))}
          </Reveal>
        </div>
      </section>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal" },
        ])}
      />
    </>
  );
}
