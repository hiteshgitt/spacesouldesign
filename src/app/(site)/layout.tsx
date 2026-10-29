import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/motion/SmoothScroll";
import JsonLd from "@/components/ui/JsonLd";
import { organizationJsonLd } from "@/lib/seo";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <SmoothScroll>
      <a
        href="#main"
        className="sr-only-focusable fixed left-4 top-4 z-[100] bg-cobalt px-4 py-3 t-mono text-paper"
      >
        Skip to content
      </a>
      <span id="top" aria-hidden />
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <JsonLd data={organizationJsonLd()} />
    </SmoothScroll>
  );
}
