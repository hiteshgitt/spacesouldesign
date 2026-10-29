import nodemailer from "nodemailer";
import { firstErrors, inquirySchema, type Inquiry, type InquiryResponse } from "@/lib/inquiry";
import { services } from "@/content/services";
import { site } from "@/content/site";

/**
 * Project inquiry endpoint.
 *
 * Delivery (first configured wins):
 *   1. SMTP  — SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, INQUIRY_TO, INQUIRY_FROM
 *   2. Webhook — INQUIRY_WEBHOOK_URL (receives the validated JSON; e.g. a CRM, Zapier, Make, Slack workflow)
 * With neither configured it answers 503 so the form never pretends to have sent.
 *
 * Spam: honeypot field, minimum fill time, per-IP rate limit (in-memory — use a
 * shared store such as Redis if you run more than one server instance).
 */

const MIN_FILL_MS = 3000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string, now: number) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v[v.length - 1] > WINDOW_MS) hits.delete(k);
  return recent.length > MAX_PER_WINDOW;
}

const json = (body: InquiryResponse, status: number) => Response.json(body, { status });

const smtpConfigured = () =>
  !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.INQUIRY_TO);

function format(d: Inquiry) {
  const serviceNames = d.services.map((s) => services.find((x) => x.slug === s)?.title ?? s).join(", ");
  const rows: [string, string][] = [
    ["Name", d.name],
    ["Company", d.company],
    ["Email", d.email],
    ["Phone", d.phone || "—"],
    ["Event", d.eventName],
    ["Location", d.location],
    ["Booth size", d.boothSize],
    ["Services", serviceNames],
    ["Timeline", d.timeline],
    ["Budget", d.budget || "—"],
  ];
  const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  return {
    subject: `New inquiry — ${d.company} · ${d.eventName}`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nDetails:\n${d.details}\n`,
    html: `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows
      .map(([k, v]) => `<tr><td style="color:#666;vertical-align:top">${esc(k)}</td><td>${esc(v)}</td></tr>`)
      .join("")}</table><p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${esc(d.details)}</p>`,
  };
}

async function deliver(d: Inquiry) {
  if (smtpConfigured()) {
    const port = Number(process.env.SMTP_PORT ?? 587);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const { subject, text, html } = format(d);
    await transport.sendMail({
      from: process.env.INQUIRY_FROM || `"${site.name} website" <${process.env.SMTP_USER}>`,
      to: process.env.INQUIRY_TO,
      replyTo: { name: d.name, address: d.email },
      subject,
      text,
      html,
    });
    return true;
  }
  if (process.env.INQUIRY_WEBHOOK_URL) {
    const { website: _hp, startedAt: _t, ...payload } = d;
    const res = await fetch(process.env.INQUIRY_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "inquiry", receivedAt: new Date().toISOString(), ...payload }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return true;
  }
  return false;
}

export async function POST(request: Request) {
  const now = Date.now();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";

  if (rateLimited(ip, now)) {
    return json({ ok: false, reason: "rate-limited", message: "Too many submissions. Please try again in a few minutes." }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, reason: "invalid", errors: { form: "Invalid request." } }, 400);
  }

  // Spam checks run before validation so bots learn nothing from field errors.
  const raw = body as Partial<Inquiry> | null;
  if (raw && typeof raw === "object" && (raw.website || (typeof raw.startedAt === "number" && now - raw.startedAt < MIN_FILL_MS))) {
    return json({ ok: false, reason: "spam", message: "Submission rejected. If you are a person, please wait a moment and try again." }, 400);
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, reason: "invalid", errors: firstErrors(parsed.error) }, 422);

  try {
    const sent = await deliver(parsed.data);
    if (!sent) {
      return json(
        {
          ok: false,
          reason: "not-configured",
          message: "Online inquiries are not connected yet, so your message was not sent.",
        },
        503,
      );
    }
  } catch (err) {
    console.error("[inquiry] delivery failed:", err instanceof Error ? err.message : err);
    return json(
      { ok: false, reason: "delivery-failed", message: "We couldn't send your message just now. Please try again shortly." },
      502,
    );
  }

  return json({ ok: true }, 200);
}
