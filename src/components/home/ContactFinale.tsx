import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";
import Placeholder from "@/components/ui/Placeholder";
import InquiryForm from "./InquiryForm";
import { site, showPlaceholders } from "@/content/site";

/** Final call-to-action with the full project inquiry form. */
export default function ContactFinale({ index = "(07)", headingAs = "h2" }: { index?: string; headingAs?: "h1" | "h2" }) {
  const { email, phone, address } = site.contact;
  const direct = [
    { label: "Email", value: email.value, href: email.value ? `mailto:${email.value}` : undefined, note: email.note },
    { label: "Phone", value: phone.value, href: phone.value ? `tel:${phone.value.replace(/\s/g, "")}` : undefined, note: phone.note },
    { label: "Studio", value: address.value, note: address.note },
  ];

  return (
    <section id="start" className="on-dark relative overflow-hidden py-[var(--section-y-lg)]" aria-labelledby="contact-title">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="shell relative">
        <p className="t-mono text-fog">{index} — Start a project</p>
        <SplitReveal as={headingAs} id="contact-title" className="t-display mt-8 max-w-[14ch]" by="lines">
          Have a space <span className="t-serif normal-case text-cobalt-glow">in mind?</span>
        </SplitReveal>
        <p className="t-mono-lg mt-10 text-ivory/80">Let&apos;s build something extraordinary.</p>

        <div className="mt-[var(--block-gap)] grid-12 gap-y-16">
          <Reveal as="aside" className="col-span-12 space-y-10 md:col-span-4" y={16}>
            <p className="t-lead text-ivory/75" data-reveal-item>
              Tell us about the event, the footprint and what you need the space to do. The more context, the more
              useful our first reply will be.
            </p>
            <dl className="space-y-6 border-t border-ivory/15 pt-8" data-reveal-item>
              {direct.map((d) =>
                d.value || showPlaceholders ? (
                  <div key={d.label}>
                    <dt className="t-mono text-fog">{d.label}</dt>
                    <dd className="mt-2">
                      {d.value ? (
                        d.href ? (
                          <a className="link-u text-lg" href={d.href}>
                            {d.value}
                          </a>
                        ) : (
                          <span className="text-lg">{d.value}</span>
                        )
                      ) : (
                        <Placeholder title={d.note}>Awaiting {d.label.toLowerCase()}</Placeholder>
                      )}
                    </dd>
                  </div>
                ) : null,
              )}
            </dl>
          </Reveal>
          <div className="col-span-12 md:col-span-7 md:col-start-6">
            <InquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
