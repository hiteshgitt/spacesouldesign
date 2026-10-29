import { site } from "@/content/site";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? site.url).replace(/\/$/, "");
export const absolute = (path: string) => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

/** Organization schema built only from confirmed data — empty fields are omitted, never guessed. */
export function organizationJsonLd() {
  const { email, phone, address } = site.contact;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    url: siteUrl,
    description: site.description,
    logo: absolute("/icon.svg"),
    ...(email.value ? { email: email.value } : {}),
    ...(phone.value ? { telephone: phone.value } : {}),
    ...(address.value ? { address: address.value } : {}),
    ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
    knowsAbout: [
      "Exhibition stall design",
      "Exhibition booth fabrication",
      "Custom exhibition stands",
      "3D visualization",
      "Brand activation",
      "Event and conference environments",
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absolute(it.path),
    })),
  };
}
