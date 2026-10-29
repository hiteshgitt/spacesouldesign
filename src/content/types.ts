/**
 * Content model. Shaped so each collection can later be sourced from a
 * headless CMS (Sanity, Contentful, Payload…) by swapping the loaders in
 * `src/content/index.ts` — components only ever consume these types.
 */

export type CategoryId =
  | "exhibition-stands"
  | "custom-booth-fabrication"
  | "brand-activations"
  | "experiential-environments"
  | "event-conference-spaces"
  | "retail-spatial-installations";

export interface Category {
  id: CategoryId;
  index: string;
  label: string;
  short: string;
}

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Concept renders generated for layout only — must be replaced by real photography. */
  placeholder?: boolean;
  caption?: string;
}

export interface ProjectStage {
  id: "discover" | "imagine" | "engineer" | "fabricate" | "deliver";
  title: string;
  body: string;
}

export interface Project {
  slug: string;
  title: string;
  /** Only set when the client has approved publication. */
  client: string | null;
  category: CategoryId;
  industry: string;
  location: string;
  year?: string;
  /** e.g. "9 × 12 m · 108 m²" — omit if unknown */
  footprint?: string;
  services: string[];
  /** One-line creative concept */
  concept: string;
  summary: string;
  objectives: string[];
  conceptDevelopment: string;
  process: ProjectStage[];
  cover: ImageAsset;
  portrait: ImageAsset;
  gallery: ImageAsset[];
  /** Blueprint / concept / reality views for the case-study visualization */
  stages: { blueprint: ImageAsset; concept: ImageAsset; reality: ImageAsset };
  featured: boolean;
  /** Entire entry is illustrative sample content — never real completed work. */
  placeholder: boolean;
  seo: { title: string; description: string };
}

export interface Service {
  slug: string;
  index: string;
  title: string;
  kicker: string;
  summary: string;
  body: string;
  deliverables: string[];
  image: ImageAsset;
  relatedCategory?: CategoryId;
  keywords: string[];
}

export interface ProcessStep {
  index: string;
  title: string;
  body: string;
}

export interface JournalEntry {
  slug: string;
  title: string;
  kind: "Insight" | "Process" | "Material" | "Project story";
  excerpt: string;
  date: string;
  readingTime: string;
  cover: ImageAsset;
  body: { heading?: string; text: string }[];
  placeholder: boolean;
}

/** A value the business owner must confirm before launch. */
export interface Pending<T> {
  value: T | null;
  /** Shown in development/preview so nobody ships a guess. */
  note: string;
}
