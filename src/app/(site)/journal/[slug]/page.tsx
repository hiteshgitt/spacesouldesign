import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SplitReveal from "@/components/motion/SplitReveal";
import ImageReveal from "@/components/motion/ImageReveal";
import Reveal from "@/components/motion/Reveal";
import ContactFinale from "@/components/home/ContactFinale";
import JsonLd from "@/components/ui/JsonLd";
import Placeholder from "@/components/ui/Placeholder";
import { getEntry, journal } from "@/content/journal";
import { site } from "@/content/site";
import { absolute, breadcrumbJsonLd, siteUrl } from "@/lib/seo";

// Every slug is prerendered; unknown ones 404, so a blocking route is fine.
export const instant = false;

export function generateStaticParams() {
  return journal.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const j = getEntry(slug);
  if (!j) return {};
  return {
    title: j.title,
    description: j.excerpt,
    alternates: { canonical: `/journal/${j.slug}` },
    openGraph: {
      type: "article",
      url: `/journal/${j.slug}`,
      title: j.title,
      description: j.excerpt,
      publishedTime: j.date,
      images: [{ url: j.cover.src, width: j.cover.width, height: j.cover.height, alt: j.cover.alt }],
    },
    // Drafts stay out of search until the studio approves them.
    ...(j.placeholder ? { robots: { index: false, follow: true } } : {}),
  };
}

const fmt = (d: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(d));

export default async function JournalEntryPage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const j = getEntry(slug);
  if (!j) notFound();
  const i = journal.indexOf(j);
  const next = journal[(i + 1) % journal.length];

  return (
    <>
      <article className="bg-paper text-ink">
        <header className="shell pb-12 pt-[calc(var(--nav-h)+clamp(2rem,8vw,7rem))]">
          <nav aria-label="Breadcrumb" className="t-mono text-stone">
            <Link href="/journal" className="link-u">
              Journal
            </Link>{" "}
            / {j.kind}
          </nav>
          <SplitReveal as="h1" trigger="load" by="lines" className="t-display-sm mt-8 max-w-[18ch]">
            {j.title}
          </SplitReveal>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="t-mono text-stone">
              <time dateTime={j.date}>{fmt(j.date)}</time> · {j.readingTime} read
            </p>
            {j.placeholder && (
              <Placeholder title="Draft written for layout — studio to review before publishing">Draft article</Placeholder>
            )}
          </div>
        </header>

        <div className="shell">
          <div className="aspect-[16/10] md:aspect-[21/9]">
            <ImageReveal className="h-full" immediate parallax={0.1}>
              <Image src={j.cover.src} alt={j.cover.alt} fill preload sizes="100vw" className="object-cover" />
            </ImageReveal>
          </div>
        </div>

        <div className="shell grid-12 py-[var(--section-y-xs)]">
          <Reveal className="col-span-12 space-y-10 md:col-span-7 md:col-start-4" y={20}>
            {j.body.map((b, k) => (
              <section key={k} data-reveal-item>
                {b.heading && <h2 className="t-h3 mb-4">{b.heading}</h2>}
                <p className={k === 0 ? "t-lead text-ink/85" : "t-body text-[1.0625rem] leading-relaxed text-ink/75"}>{b.text}</p>
              </section>
            ))}
          </Reveal>
        </div>

        {next && next.slug !== j.slug && (
          <nav aria-label="Next article" className="shell rule-t pb-[var(--section-y-xs)] pt-10">
            <p className="t-mono text-stone">Next note</p>
            <Link href={`/journal/${next.slug}`} className="group mt-4 block">
              <span className="t-h2 group-hover:text-cobalt">{next.title} →</span>
            </Link>
          </nav>
        )}
      </article>

      <ContactFinale index="(Next)" />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: j.title,
          description: j.excerpt,
          datePublished: j.date,
          image: absolute(j.cover.src),
          mainEntityOfPage: absolute(`/journal/${j.slug}`),
          author: { "@id": `${siteUrl}/#organization` },
          publisher: { "@type": "Organization", name: site.name, "@id": `${siteUrl}/#organization` },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal" },
          { name: j.title, path: `/journal/${j.slug}` },
        ])}
      />
    </>
  );
}
