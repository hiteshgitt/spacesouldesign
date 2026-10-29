import Link from "next/link";
import { nav, site, showPlaceholders } from "@/content/site";
import { services } from "@/content/services";
import Wordmark from "./Wordmark";
import Placeholder from "@/components/ui/Placeholder";

export default function Footer() {
  const { email, phone, address } = site.contact;
  return (
    <footer className="on-dark relative overflow-hidden pt-[var(--block-gap-md)] pb-8" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Site footer
      </h2>
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="shell relative [container-type:inline-size]">
        <div className="grid-12 gap-y-14">
          <div className="col-span-12 md:col-span-5">
            <p className="t-serif text-[clamp(1.8rem,3.2vw,2.8rem)] leading-[1.05] text-ivory">
              Exhibition stalls, brand environments and spaces that move people.
            </p>
            <Link href="/contact" className="btn btn-accent mt-10">
              Start a project <span className="btn-arrow">→</span>
            </Link>
          </div>

          <nav aria-label="Footer" className="col-span-6 md:col-span-2 md:col-start-7">
            <p className="t-mono mb-5 text-fog">Index</p>
            <ul className="space-y-2">
              {[{ href: "/", label: "Home" }, ...nav].map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link-u">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-6 md:col-span-3">
            <p className="t-mono mb-5 text-fog">Services</p>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`} className="link-u">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 md:col-span-2">
            <p className="t-mono mb-5 text-fog">Contact</p>
            <ul className="space-y-2">
              {email.value ? (
                <li>
                  <a href={`mailto:${email.value}`} className="link-u">
                    {email.value}
                  </a>
                </li>
              ) : null}
              {phone.value ? (
                <li>
                  <a href={`tel:${phone.value.replace(/\s/g, "")}`} className="link-u">
                    {phone.value}
                  </a>
                </li>
              ) : null}
              {address.value ? <li className="text-fog">{address.value}</li> : null}
              {site.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="link-u" target="_blank" rel="noreferrer">
                    {s.label} ↗
                  </a>
                </li>
              ))}
              <li>
                <Link href="/contact" className="link-u">
                  Inquiry form
                </Link>
              </li>
              {showPlaceholders && !email.value && !phone.value ? (
                <li className="pt-2">
                  <Placeholder title="Add email, phone, address and social links in src/content/site.ts">
                    Contact details pending
                  </Placeholder>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <p
          aria-hidden
          className="mt-[var(--block-gap-md)] select-none text-center font-display font-[900] uppercase leading-[0.8] tracking-[-0.045em] text-ivory [font-stretch:125%] text-[clamp(2.25rem,13cqi,16rem)]"
        >
          <Wordmark className="justify-center" />
        </p>

        <div className="rule-t mt-10 flex flex-col gap-3 border-ivory/15 pt-6 t-mono text-fog md:flex-row md:items-center md:justify-between">
          <p>
            © {site.name}
          </p>
          <p>Design · Engineer · Fabricate · Deliver</p>
          <a href="#top" className="link-u">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
