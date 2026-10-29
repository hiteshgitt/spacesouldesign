import type { JournalEntry } from "./types";

/**
 * ⚠️ DRAFT ARTICLES — general exhibition-design guidance written as layout
 * samples. Have the studio review, edit or replace them before publishing.
 */
export const journal: JournalEntry[] = [
  {
    slug: "designing-for-the-aisle",
    title: "Designing for the aisle, not the floor plan",
    kind: "Insight",
    excerpt: "Visitors decide in a few steps whether to enter. Why the first three metres of a stand matter most.",
    date: "2026-10-01",
    readingTime: "4 min",
    cover: {
      src: "/images/projects/monolith-pavilion/wide.jpg",
      alt: "Concept render of a stand seen from the aisle",
      width: 2400,
      height: 1350,
      placeholder: true,
    },
    placeholder: true,
    body: [
      {
        text: "A floor plan is drawn from above, but nobody experiences a stand from above. Visitors meet it at walking pace, from the aisle, often from an angle — and they decide within a few steps whether to slow down.",
      },
      {
        heading: "Start from the sightline",
        text: "Before zoning, map the approaches: the main hall entrances, the nearest crossings and the neighbours that will compete for attention. The view from each approach tells you where the brand moment needs to sit and how high it needs to be.",
      },
      {
        heading: "Make the threshold obvious",
        text: "An open corner, a change of floor finish or a pool of brighter light all say ‘you can come in’. Counters placed across the front often say the opposite.",
      },
      {
        heading: "Give people a reason to take one more step",
        text: "A product at hand height, a moving image or a glimpse of a calmer space behind is often enough. The goal is one more step, then another.",
      },
    ],
  },
  {
    slug: "from-blueprint-to-build",
    title: "From blueprint to build: why drawings come first",
    kind: "Process",
    excerpt: "Renders sell a stand. Drawings deliver it. How technical documentation protects quality on site.",
    date: "2026-09-12",
    readingTime: "5 min",
    cover: {
      src: "/images/projects/tidal-corridor/blueprint.jpg",
      alt: "Blueprint line drawing of an exhibition environment",
      width: 2400,
      height: 1500,
      placeholder: true,
    },
    placeholder: true,
    body: [
      {
        text: "A render is a promise. Plans, elevations and details are how that promise is kept: they're what organisers approve, what the workshop cuts from, and what the site team checks against.",
      },
      {
        heading: "Approval drawings",
        text: "Most venues require dimensioned plans and elevations, structural information for anything tall or suspended, and electrical layouts. Preparing them early avoids late redesigns.",
      },
      {
        heading: "Shop drawings",
        text: "Every panel, joint and fixing is resolved on paper before material is cut. This is where finishes, tolerances and transport sizes are decided.",
      },
      {
        heading: "Dry assembly",
        text: "Assembling the stand in the workshop before it ships turns unknowns into knowns — and keeps on-site time for finishing and lighting.",
      },
    ],
  },
  {
    slug: "light-as-material",
    title: "Light is a material",
    kind: "Material",
    excerpt: "Halls are bright and flat. Controlled, warm, directional light is often the cheapest way to stand out.",
    date: "2026-08-20",
    readingTime: "3 min",
    cover: {
      src: "/images/projects/orbit-lounge/detail.jpg",
      alt: "Concept render of a suspended light ring",
      width: 1600,
      height: 1600,
      placeholder: true,
    },
    placeholder: true,
    body: [
      {
        text: "Exhibition halls are lit for safety, not atmosphere: bright, cool and even. A stand with its own considered lighting immediately reads as a different place.",
      },
      {
        heading: "Contrast over brightness",
        text: "Adding more light rarely helps. Adding contrast — lit product against a darker backdrop — does.",
      },
      {
        heading: "Hide the source",
        text: "Integrated LED lines, backlit fabric and light coves keep the attention on what's lit rather than on fixtures.",
      },
    ],
  },
];

export const getEntry = (slug: string) => journal.find((j) => j.slug === slug);
