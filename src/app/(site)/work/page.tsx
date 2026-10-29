import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import WorkIndex from "@/components/work/WorkIndex";
import JsonLd from "@/components/ui/JsonLd";
import Placeholder from "@/components/ui/Placeholder";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Exhibition stands, custom booths, brand activations and event spaces by Space & Soul Design — filter the index by category.",
  alternates: { canonical: "/work" },
  openGraph: { url: "/work", title: "Work — Space & Soul Design" },
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        index="(Index) — Work"
        title={
          <>
            Spaces built <span className="t-serif normal-case">to be</span> remembered.
          </>
        }
        lead={
          <>
            <p>
              Stands, booths and environments across six disciplines. Each case study follows a space from first sketch
              to opening day.
            </p>
            <p className="mt-6">
              <Placeholder title="All six entries are illustrative layouts — replace with approved projects">
                Sample projects — replace with real work
              </Placeholder>
            </p>
          </>
        }
      />
      <div className="shell bg-paper pb-[var(--section-y)] text-ink">
        <WorkIndex />
      </div>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }])} />
    </>
  );
}
