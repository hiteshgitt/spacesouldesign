import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { journal } from "@/content/journal";
import { absolute } from "@/lib/seo";

/**
 * Only indexable pages. Placeholder projects and draft articles render with
 * `noindex`, so they are left out here too and appear automatically once
 * their `placeholder` flag is removed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/work", "/services", "/about", "/journal", "/contact"].map((path) => ({
    url: absolute(path),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const work = projects
    .filter((p) => !p.placeholder)
    .map((p) => ({ url: absolute(`/work/${p.slug}`), changeFrequency: "yearly" as const, priority: 0.7 }));

  const notes = journal
    .filter((j) => !j.placeholder)
    .map((j) => ({ url: absolute(`/journal/${j.slug}`), lastModified: j.date, priority: 0.5 }));

  return [...pages, ...work, ...notes];
}
