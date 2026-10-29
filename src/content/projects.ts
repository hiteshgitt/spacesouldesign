import type { Category, CategoryId, ImageAsset, Project } from "./types";

export const categories: Category[] = [
  { id: "exhibition-stands", index: "01", label: "Exhibition Stands", short: "Stands" },
  { id: "custom-booth-fabrication", index: "02", label: "Custom Booth Fabrication", short: "Fabrication" },
  { id: "brand-activations", index: "03", label: "Brand Activations", short: "Activations" },
  { id: "experiential-environments", index: "04", label: "Experiential Environments", short: "Experiential" },
  { id: "event-conference-spaces", index: "05", label: "Event & Conference Spaces", short: "Events" },
  { id: "retail-spatial-installations", index: "06", label: "Retail & Spatial Installations", short: "Retail" },
];

export const categoryById = (id: CategoryId) => categories.find((c) => c.id === id)!;

/**
 * Placeholder imagery: concept renders generated from the site's own
 * procedural booth generator (`npm run renders`). Replace each file in
 * /public/images/projects/<slug>/ with real photography of the same
 * aspect ratio, update `alt`, and drop `placeholder: true`.
 */
const img = (slug: string, shot: string, alt: string, w: number, h: number, caption?: string): ImageAsset => ({
  src: `/images/projects/${slug}/${shot}.jpg`,
  alt,
  width: w,
  height: h,
  placeholder: true,
  caption,
});

const stdProcess = (p: Partial<Record<Project["process"][number]["id"], string>>): Project["process"] => [
  { id: "discover", title: "Discover", body: p.discover ?? "" },
  { id: "imagine", title: "Imagine", body: p.imagine ?? "" },
  { id: "engineer", title: "Engineer", body: p.engineer ?? "" },
  { id: "fabricate", title: "Fabricate", body: p.fabricate ?? "" },
  { id: "deliver", title: "Deliver", body: p.deliver ?? "" },
];

function makeImages(slug: string, title: string) {
  return {
    cover: img(slug, "cover", `${title} — concept render, three-quarter view of the stand`, 2400, 1500),
    portrait: img(slug, "portrait", `${title} — concept render, vertical view`, 1200, 1500),
    gallery: [
      img(slug, "wide", `${title} — concept render, wide view across the aisle`, 2400, 1350, "Approach from the main aisle"),
      img(slug, "detail", `${title} — concept render, detail of display surfaces`, 1600, 1600, "Display & lighting detail"),
      img(slug, "plan", `${title} — concept render, overhead plan view`, 2000, 1500, "Overhead plan"),
    ],
    stages: {
      blueprint: img(slug, "blueprint", `${title} — blueprint line drawing`, 2400, 1500),
      concept: img(slug, "concept", `${title} — massing model with preliminary materials`, 2400, 1500),
      reality: img(slug, "cover", `${title} — finished environment render`, 2400, 1500),
    },
  };
}

/**
 * ⚠️ SAMPLE PROJECTS — ILLUSTRATIVE ONLY.
 * These six entries demonstrate the layout for each category. They are not
 * completed work and name no clients. Replace with real, approved projects.
 */
export const projects: Project[] = [
  {
    slug: "monolith-pavilion",
    title: "Monolith Pavilion",
    client: null,
    category: "exhibition-stands",
    industry: "Technology",
    location: "Island stand · trade fair",
    footprint: "12 × 9 m · 108 m²",
    services: ["Stall design", "3D visualization", "Fabrication", "Installation"],
    concept: "A single dark mass, split open by light, that pulls the aisle inside.",
    summary:
      "A sample island stand built around one monumental volume. A cut through its centre becomes the entrance, the demo zone and the brand moment at once.",
    objectives: [
      "Be legible from the far end of the hall",
      "Hold live product demos without crowding the aisle",
      "Create a quieter meeting zone behind the main volume",
    ],
    conceptDevelopment:
      "We started from a block and subtracted. Every cut into the monolith has a job — a doorway, a display niche, a sightline — so the stand reads as one confident object instead of a collection of furniture.",
    process: stdProcess({
      discover: "Hall plan, sightlines from each entrance, demo schedule and visitor flow assumptions.",
      imagine: "Massing studies, light-cut variations and three rendered directions.",
      engineer: "Modular timber frame, rigging points for the light header, power and data plan.",
      fabricate: "Panels pre-finished in the workshop; full dry-assembly before shipping.",
      deliver: "Build, lighting focus and handover the evening before opening.",
    }),
    ...makeImages("monolith-pavilion", "Monolith Pavilion"),
    featured: true,
    placeholder: true,
    seo: {
      title: "Monolith Pavilion — Island Exhibition Stand (Sample)",
      description: "Sample case study: a monumental island exhibition stand concept with a light-cut entrance and demo zone.",
    },
  },
  {
    slug: "folded-light",
    title: "Folded Light",
    client: null,
    category: "custom-booth-fabrication",
    industry: "Healthcare",
    location: "Corner stand · medical congress",
    footprint: "6 × 6 m · 36 m²",
    services: ["Custom fabrication", "Lighting design", "Graphics production"],
    concept: "Folded planes and backlit fabric that do more with a small corner.",
    summary:
      "A sample corner booth where two folded walls carry all the storytelling, lighting and storage, leaving the floor open for conversation.",
    objectives: ["Maximise usable floor on a compact corner", "Integrate storage invisibly", "Soft, clinical-grade light quality"],
    conceptDevelopment:
      "The folds give the walls depth and stiffness without extra structure, and each fold hides something useful — a cupboard, a screen, a light line.",
    process: stdProcess({
      discover: "Footprint constraints, congress regulations and brand guidelines.",
      imagine: "Folded paper models translated into 3D studies.",
      engineer: "CNC-cut folded panels with concealed storage and LED channels.",
      fabricate: "Tension-fabric light boxes and lacquered fold panels.",
      deliver: "Single-day install with a two-person crew.",
    }),
    ...makeImages("folded-light", "Folded Light"),
    featured: true,
    placeholder: true,
    seo: {
      title: "Folded Light — Custom Booth Fabrication (Sample)",
      description: "Sample case study: a compact custom-fabricated corner booth with folded walls and backlit graphics.",
    },
  },
  {
    slug: "orbit-lounge",
    title: "Orbit Lounge",
    client: null,
    category: "brand-activations",
    industry: "Consumer lifestyle",
    location: "Brand activation · public venue",
    footprint: "10 × 10 m",
    services: ["Concept", "3D visualization", "Fabrication", "On-site execution"],
    concept: "A suspended ring of light that turns a crowd into an audience.",
    summary:
      "A sample activation designed around a suspended halo. The ring frames the product reveal, guides queues and becomes the shareable image.",
    objectives: ["One unmistakable photo moment", "Manage queues gracefully", "Reconfigure quickly between sessions"],
    conceptDevelopment:
      "Everything orbits the centre: seating, product plinths and the light ring overhead. The geometry makes the space feel generous even at capacity.",
    process: stdProcess({
      discover: "Audience profile, session timing and venue load limits.",
      imagine: "Halo studies at three scales, light choreography sketches.",
      engineer: "Rigging calculations and a modular plinth system.",
      fabricate: "Rolled aluminium ring segments with diffused LED.",
      deliver: "Overnight rig, focus and rehearsal with the brand team.",
    }),
    ...makeImages("orbit-lounge", "Orbit Lounge"),
    featured: true,
    placeholder: true,
    seo: {
      title: "Orbit Lounge — Brand Activation Space (Sample)",
      description: "Sample case study: a brand activation space built around a suspended light ring.",
    },
  },
  {
    slug: "tidal-corridor",
    title: "Tidal Corridor",
    client: null,
    category: "experiential-environments",
    industry: "Energy",
    location: "Walk-through environment",
    footprint: "18 × 6 m",
    services: ["Experience design", "Spatial storytelling", "AV integration", "Fabrication"],
    concept: "A sequence of portals that turns a story into a walk.",
    summary:
      "A sample walk-through environment: a rhythm of frames and screens that slows visitors down and reveals the story chapter by chapter.",
    objectives: ["Linear narrative in under four minutes", "Accessible single-direction flow", "Content swappable per event"],
    conceptDevelopment:
      "Each portal is a chapter. Their spacing tightens toward the climax, so the architecture itself controls pace.",
    process: stdProcess({
      discover: "Story mapping with the client's content team.",
      imagine: "Portal rhythm studies and walk-through animatics.",
      engineer: "Repeatable portal module with integrated screen mounts.",
      fabricate: "Steel portals, acoustic panels, content-ready screens.",
      deliver: "Install, AV commissioning and content sync.",
    }),
    ...makeImages("tidal-corridor", "Tidal Corridor"),
    featured: false,
    placeholder: true,
    seo: {
      title: "Tidal Corridor — Experiential Environment (Sample)",
      description: "Sample case study: a walk-through experiential environment of portals and screens.",
    },
  },
  {
    slug: "the-assembly",
    title: "The Assembly",
    client: null,
    category: "event-conference-spaces",
    industry: "Finance",
    location: "Conference stage & foyer",
    footprint: "Stage 14 × 6 m",
    services: ["Stage design", "Set fabrication", "Lighting", "Installation"],
    concept: "A stage built like architecture, not scenery.",
    summary:
      "A sample conference set where the stage, screens and lighting are one composition — calm on camera, generous in the room.",
    objectives: ["Read well on livestream", "Flexible for panels and keynotes", "Fast changeover between sessions"],
    conceptDevelopment:
      "Stepped planes and a single light header create depth for the camera while keeping sightlines clean from every seat.",
    process: stdProcess({
      discover: "Run-of-show, camera positions and venue rigging plan.",
      imagine: "Camera-angle renders for each session format.",
      engineer: "Modular stage decks and screen surrounds.",
      fabricate: "Finished set panels and lighting header.",
      deliver: "Build, light, rehearse, strike.",
    }),
    ...makeImages("the-assembly", "The Assembly"),
    featured: false,
    placeholder: true,
    seo: {
      title: "The Assembly — Conference Stage Design (Sample)",
      description: "Sample case study: a conference stage and set designed as architecture.",
    },
  },
  {
    slug: "gallery-of-objects",
    title: "Gallery of Objects",
    client: null,
    category: "retail-spatial-installations",
    industry: "Design & retail",
    location: "Retail installation",
    footprint: "8 × 5 m",
    services: ["Spatial design", "Display fabrication", "Lighting"],
    concept: "Product displayed with the restraint of a museum.",
    summary:
      "A sample retail installation that treats every product as an exhibit — plinths, vitrines and precise light, nothing else.",
    objectives: ["Elevate a small product range", "Allow touch without clutter", "Re-use in multiple stores"],
    conceptDevelopment:
      "A family of plinths at three heights creates a landscape the visitor walks through, with one lit vitrine as the hero.",
    process: stdProcess({
      discover: "Product range, store footprints and reuse plan.",
      imagine: "Plinth landscape compositions.",
      engineer: "Flat-pack plinth system and vitrine detailing.",
      fabricate: "Solid-surface plinths and low-iron glass vitrine.",
      deliver: "Install, light focus and store team walkthrough.",
    }),
    ...makeImages("gallery-of-objects", "Gallery of Objects"),
    featured: false,
    placeholder: true,
    seo: {
      title: "Gallery of Objects — Retail Spatial Installation (Sample)",
      description: "Sample case study: a museum-like retail installation of plinths and vitrines.",
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const getRelated = (slug: string, n = 2) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return Array.from({ length: n }, (_, k) => projects[(i + k + 1) % projects.length]);
};
