import type { Pending } from "./types";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  BUSINESS INFORMATION — EDIT BEFORE LAUNCH
 *  Every `Pending` value below is `null` until the owner confirms it.
 *  Components hide empty values in production and flag them in preview
 *  (see `showPlaceholders`). Nothing here should ever be guessed.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Space & Soul Design",
  shortName: "Space & Soul",
  url: "https://spaceandsouldesign.com",
  tagline: "Exhibition stall design, fabrication & brand environments",
  description:
    "Space & Soul Design designs, engineers and builds exhibition stalls, custom booths and brand environments — from 3D visualization to fabrication and on-site installation.",

  contact: {
    email: {
      value: null,
      note: "Public inquiry email — e.g. hello@spaceandsouldesign.com once the mailbox exists.",
    } as Pending<string>,
    phone: { value: null, note: "Public phone / WhatsApp number in international format." } as Pending<string>,
    address: { value: null, note: "Studio / workshop address, or city only." } as Pending<string>,
    hours: { value: null, note: "Office hours, if published." } as Pending<string>,
  },

  social: [
    // { label: "Instagram", href: "https://instagram.com/…" },
    // { label: "LinkedIn", href: "https://linkedin.com/company/…" },
    // { label: "Behance", href: "https://behance.net/…" },
  ] as { label: string; href: string }[],

  /** Verified credentials only. Leave `value: null` to hide. */
  credentials: {
    yearsExperience: { value: null, note: "Years in business (verified)." } as Pending<string>,
    projectsDelivered: { value: null, note: "Number of delivered projects (verified)." } as Pending<string>,
    citiesServed: { value: null, note: "Cities / countries where the team has built." } as Pending<string>,
    largestFootprint: { value: null, note: "Largest stand delivered, in m²." } as Pending<string>,
  },
  industries: {
    value: null,
    note: "Industries served, e.g. Pharma, Automotive, Technology — confirm from real projects.",
  } as Pending<string[]>,
  locations: {
    value: null,
    note: "Venues / cities served, e.g. specific exhibition centres.",
  } as Pending<string[]>,
  /** Logos must be supplied as files with written permission from each client. */
  clients: [] as { name: string; logo: string }[],
  testimonials: [] as { quote: string; name: string; role: string; company: string }[],
  awards: [] as { title: string; year: string; body: string }[],
} as const;

/**
 * Show amber "placeholder" markers on unconfirmed content.
 * Defaults to on so the preview build is honest; set
 * NEXT_PUBLIC_SHOW_PLACEHOLDERS=false once real content is in place.
 */
export const showPlaceholders = process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS !== "false";

export const nav = [
  { href: "/work", label: "Work", index: "01" },
  { href: "/services", label: "Services", index: "02" },
  { href: "/about", label: "Studio", index: "03" },
  { href: "/journal", label: "Journal", index: "04" },
  { href: "/contact", label: "Contact", index: "05" },
] as const;
