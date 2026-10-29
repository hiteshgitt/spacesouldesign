import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import NotFoundView from "@/components/layout/NotFoundView";

export const metadata: Metadata = { title: "Not found" };

/** Unmatched URLs land here, outside the (site) layout, so bring the chrome along. */
export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main">
        <NotFoundView />
      </main>
      <Footer />
    </>
  );
}
