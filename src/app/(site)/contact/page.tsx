import type { Metadata } from "next";
import ContactFinale from "@/components/home/ContactFinale";
import JsonLd from "@/components/ui/JsonLd";
import { site } from "@/content/site";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: `Start a project with ${site.name}: tell us about your exhibition, event or brand space and we'll come back with next steps.`,
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", title: `Contact — ${site.name}` },
};

export default function ContactPage() {
  return (
    <div className="pt-[var(--nav-h)] bg-void">
      <ContactFinale index="(Contact)" headingAs="h1" />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
    </div>
  );
}
