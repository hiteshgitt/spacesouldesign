"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { services } from "@/content/services";
import { site } from "@/content/site";
import {
  budgetOptions,
  firstErrors,
  inquirySchema,
  timelineOptions,
  type InquiryErrors,
  type InquiryResponse,
} from "@/lib/inquiry";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

const ORDER = ["name", "company", "email", "phone", "eventName", "location", "boothSize", "services", "timeline", "budget", "details"] as const;

/**
 * Project inquiry form. Posts to /api/inquiry and reports exactly what the
 * server says — it never shows a success state unless delivery succeeded.
 */
export default function InquiryForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(0);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const id = (name: string) => `${uid}-${name}`;
  const errProps = (name: keyof InquiryErrors) =>
    errors[name]
      ? { "aria-invalid": true as const, "aria-describedby": id(`${name}-err`) }
      : { "aria-invalid": false as const };

  function focusFirstError(errs: InquiryErrors) {
    const first = ORDER.find((k) => errs[k]);
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.focus();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending") return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      eventName: String(fd.get("eventName") ?? ""),
      location: String(fd.get("location") ?? ""),
      boothSize: String(fd.get("boothSize") ?? ""),
      services: fd.getAll("services").map(String),
      timeline: String(fd.get("timeline") ?? ""),
      budget: String(fd.get("budget") ?? ""),
      details: String(fd.get("details") ?? ""),
      website: String(fd.get("website") ?? ""),
      startedAt: startedAt.current || Date.now(),
    };

    const local = inquirySchema.safeParse(payload);
    if (!local.success) {
      const errs = firstErrors(local.error);
      setErrors(errs);
      setStatus({ kind: "error", message: "Please check the highlighted fields." });
      focusFirstError(errs);
      return;
    }

    setErrors({});
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as InquiryResponse | null;
      if (res.ok && data?.ok) {
        setStatus({ kind: "sent" });
        formRef.current?.reset();
        return;
      }
      if (data && !data.ok && data.reason === "invalid") {
        setErrors(data.errors);
        setStatus({ kind: "error", message: data.errors.form ?? "Please check the highlighted fields." });
        focusFirstError(data.errors);
        return;
      }
      const message = data && !data.ok && "message" in data ? data.message : "Something went wrong. Please try again.";
      setStatus({ kind: "error", message });
    } catch {
      setStatus({ kind: "error", message: "Network error — please check your connection and try again." });
    }
  }

  useEffect(() => {
    if (status.kind === "sent" || (status.kind === "error" && !Object.keys(errors).length)) statusRef.current?.focus();
  }, [status, errors]);

  if (status.kind === "sent") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="border-t border-ivory/20 pt-10 outline-none">
        <p className="t-mono text-cobalt-glow">Inquiry received</p>
        <p className="t-h3 mt-6 max-w-[22ch]">Thank you — your brief is with the studio.</p>
        <p className="t-body mt-6 max-w-[48ch] text-ivory/70">
          We&apos;ll reply to the email address you gave us. If anything changes in the meantime, simply send
          another note.
        </p>
        <button type="button" className="btn btn-ghost mt-10" onClick={() => setStatus({ kind: "idle" })}>
          Send another inquiry
        </button>
      </div>
    );
  }

  const fallbackEmail = site.contact.email.value;
  const sending = status.kind === "sending";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-labelledby={`${uid}-legend`}
      className="grid grid-cols-1 gap-x-10 gap-y-9 md:grid-cols-2"
    >
      <p id={`${uid}-legend`} className="sr-only">
        Project inquiry
      </p>

      <Text name="name" label="Your name" autoComplete="name" required id={id} err={errors} errProps={errProps} />
      <Text name="company" label="Company" autoComplete="organization" required id={id} err={errors} errProps={errProps} />
      <Text name="email" type="email" label="Email" autoComplete="email" required id={id} err={errors} errProps={errProps} />
      <Text name="phone" type="tel" label="Phone (optional)" autoComplete="tel" id={id} err={errors} errProps={errProps} />
      <Text name="eventName" label="Event / exhibition" placeholder="e.g. trade fair name and year" required id={id} err={errors} errProps={errProps} />
      <Text name="location" label="Event location" placeholder="City, venue" required id={id} err={errors} errProps={errProps} />
      <Text name="boothSize" label="Booth size" placeholder="e.g. 9 × 6 m, 54 m², island" required id={id} err={errors} errProps={errProps} />

      <div className="field">
        <label className="field-label" htmlFor={id("timeline")}>
          Timeline <Req />
        </label>
        <select id={id("timeline")} name="timeline" className="field-input" defaultValue="" required {...errProps("timeline")}>
          <option value="" disabled>
            Select…
          </option>
          {timelineOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <FieldError id={id("timeline-err")} msg={errors.timeline} />
      </div>

      <fieldset
        className="md:col-span-2"
        aria-describedby={errors.services ? id("services-err") : undefined}
        aria-invalid={errors.services ? true : undefined}
      >
        <legend className="field-label mb-4">
          Services needed <Req />
        </legend>
        <div className="flex flex-wrap gap-2">
          {services.map((s) => (
            <label key={s.slug} className="chip">
              <input type="checkbox" name="services" value={s.slug} className="sr-only" />
              {s.title}
            </label>
          ))}
        </div>
        <FieldError id={id("services-err")} msg={errors.services} />
      </fieldset>

      <div className="field">
        <label className="field-label" htmlFor={id("budget")}>
          Budget range (optional)
        </label>
        <select id={id("budget")} name="budget" className="field-input" defaultValue="" {...errProps("budget")}>
          <option value="">Prefer not to say</option>
          {budgetOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <FieldError id={id("budget-err")} msg={errors.budget} />
      </div>
      <div className="hidden md:block" aria-hidden />

      <div className="field md:col-span-2">
        <label className="field-label" htmlFor={id("details")}>
          Project details <Req />
        </label>
        <textarea
          id={id("details")}
          name="details"
          rows={5}
          required
          className="field-input resize-y"
          placeholder="Objectives, audience, products to show, must-haves, references…"
          {...errProps("details")}
        />
        <FieldError id={id("details-err")} msg={errors.details} />
      </div>

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>Website</label>
        <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-6 border-t border-ivory/15 pt-8 md:col-span-2 lg:flex-row lg:items-center lg:justify-between">
        <p className="t-body max-w-[46ch] text-ivory/55 text-sm">
          We use these details only to reply to your inquiry. Fields marked <Req /> are required.
        </p>
        <button type="submit" className="btn btn-accent self-start lg:self-auto shrink-0" disabled={sending} aria-disabled={sending}>
          {sending ? "Sending…" : "Send inquiry"}
          <span className="btn-arrow" aria-hidden>
            →
          </span>
        </button>
      </div>

      <div
        ref={statusRef}
        tabIndex={-1}
        role={status.kind === "error" ? "alert" : "status"}
        aria-live="polite"
        className="outline-none md:col-span-2"
      >
        {status.kind === "error" && (
          <div className="border border-[#f87171]/40 bg-[#f87171]/10 p-5 text-sm">
            <p>{status.message}</p>
            {!Object.keys(errors).length &&
              (fallbackEmail ? (
                <p className="mt-2 text-ivory/70">
                  You can also email us directly at{" "}
                  <a className="link-u" href={`mailto:${fallbackEmail}`}>
                    {fallbackEmail}
                  </a>
                  .
                </p>
              ) : null)}
          </div>
        )}
      </div>
    </form>
  );
}

function Req() {
  return (
    <span aria-hidden className="text-cobalt-glow">
      *
    </span>
  );
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  return msg ? (
    <p id={id} className="field-error mt-1">
      {msg}
    </p>
  ) : null;
}

function Text({
  name,
  label,
  type = "text",
  required,
  autoComplete,
  placeholder,
  id,
  err,
  errProps,
}: {
  name: keyof InquiryErrors;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  id: (n: string) => string;
  err: InquiryErrors;
  errProps: (n: keyof InquiryErrors) => object;
}) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={id(name)}>
        {label} {required && <Req />}
      </label>
      <input
        id={id(name)}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="field-input"
        {...errProps(name)}
      />
      <FieldError id={id(`${name}-err`)} msg={err[name]} />
    </div>
  );
}
