import { z } from "zod";
import { services } from "@/content/services";

/** Shared by the form (client-side hints) and the API route (authoritative validation). */

export const timelineOptions = [
  "Within 4 weeks",
  "1–3 months",
  "3–6 months",
  "6+ months",
  "Not sure yet",
] as const;

export const budgetOptions = [
  "Prefer to discuss",
  "Under ₹5 lakh",
  "₹5–15 lakh",
  "₹15–40 lakh",
  "₹40 lakh +",
] as const;

const serviceSlugs = services.map((s) => s.slug) as [string, ...string[]];

const text = (max: number, label = "This field") =>
  z.string({ error: `${label} is required` }).trim().max(max, `Keep this under ${max} characters`);
const required = (label: string, max = 200) => text(max, label).min(1, `${label} is required`);

export const inquirySchema = z.object({
  name: required("Your name", 120),
  company: required("Company", 160),
  email: z.string({ error: "Enter a valid email address" }).trim().pipe(z.email("Enter a valid email address")),
  phone: text(40)
    .refine((v) => v === "" || /^[+()\d\s.-]{6,}$/.test(v), "Enter a valid phone number")
    .optional()
    .default(""),
  eventName: required("Event name", 200),
  location: required("Event location", 200),
  boothSize: required("Booth size", 80),
  services: z.array(z.enum(serviceSlugs), "Choose at least one service").min(1, "Choose at least one service").max(services.length),
  timeline: z.enum(timelineOptions, "Choose a timeline"),
  budget: z.union([z.enum(budgetOptions), z.literal("")]).optional().default(""),
  details: required("Project details", 5000).min(20, "Tell us a little more (20 characters minimum)"),
  /** Honeypot — real visitors never see or fill it. */
  website: z.string().max(0).optional().default(""),
  /** ms timestamp of when the form rendered; used to reject instant bot posts. */
  startedAt: z.number("Invalid request.").int().positive(),
});

export type Inquiry = z.infer<typeof inquirySchema>;
export type InquiryErrors = Partial<Record<keyof Inquiry | "form", string>>;

export type InquiryResponse =
  | { ok: true }
  | { ok: false; reason: "invalid"; errors: InquiryErrors }
  | { ok: false; reason: "not-configured" | "rate-limited" | "spam" | "delivery-failed"; message: string };

export function firstErrors(error: z.ZodError): InquiryErrors {
  const out: InquiryErrors = {};
  for (const issue of error.issues) {
    const key = (issue.path[0] ?? "form") as keyof InquiryErrors;
    out[key] ??= issue.message;
  }
  return out;
}
